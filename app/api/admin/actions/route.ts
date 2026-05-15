import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import Payment from "@/lib/models/Payment";
import User from "@/lib/models/User";
import { sendAllNotifications, sendEmail, sendWhatsAppMessage } from "@/lib/notify";
import { PAYMENT_STATUS } from "@/lib/constants";
import phonepeClient from "@/lib/phonepeClient";

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await connectDB();

    const { action, payload } = await req.json();
    if (!action) return NextResponse.json({ error: "Action required" }, { status: 400 });

    switch (action) {
      case "refreshStatus": {
        const { orderIds } = payload || {};
        if (!orderIds || !Array.isArray(orderIds)) {
          return NextResponse.json({ error: "orderIds array required" }, { status: 400 });
        }

        const results = [];
        for (const orderId of orderIds.slice(0, 50)) {
          try {
            const payment = await Payment.findOne({ merchantOrderId: orderId });
            if (!payment) {
              results.push({ orderId, status: "NOT_FOUND" });
              continue;
            }

            let newStatus = payment.status;
            try {
              const statusResp = await phonepeClient.getOrderStatus(orderId);
              const state = statusResp?.state;
              if (state === "COMPLETED") newStatus = PAYMENT_STATUS.COMPLETED;
              else if (state === "FAILED") newStatus = PAYMENT_STATUS.FAILED;
              else if (state === "PENDING") newStatus = PAYMENT_STATUS.PENDING;
            } catch (pgErr: any) {
              console.error(`Gateway check failed for ${orderId}:`, pgErr.message);
            }

            const oldStatus = payment.status;
            if (newStatus !== oldStatus) {
              payment.status = newStatus as any;
              payment.updatedAt = new Date();
              await payment.save();

              if ([PAYMENT_STATUS.COMPLETED, PAYMENT_STATUS.FAILED].includes(newStatus as any)) {
                try {
                  await sendAllNotifications(orderId, newStatus, payment.user, {}, payment.products);
                } catch (_) {}
              }
            }

            results.push({ orderId, oldStatus, newStatus, changed: oldStatus !== newStatus });
          } catch (err: any) {
            results.push({ orderId, error: err.message });
          }
        }
        return NextResponse.json({ success: true, results });
      }

      case "resendNotification": {
        const { orderId } = payload || {};
        if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });

        const payment = await Payment.findOne({ merchantOrderId: orderId });
        if (!payment) return NextResponse.json({ error: "Order not found" }, { status: 404 });

        try {
          await sendAllNotifications(orderId, payment.status, payment.user, {}, payment.products);
          return NextResponse.json({ success: true, message: `Notification sent for ${orderId}` });
        } catch (err: any) {
          return NextResponse.json({ error: `Notification failed: ${err.message}` }, { status: 500 });
        }
      }

      case "bulkNotify": {
        const { userIds, subject, message, imageUrl, channel = "EMAIL" } = payload || {};
        if (!message) return NextResponse.json({ error: "message required" }, { status: 400 });

        let targetUsers;
        if (userIds && Array.isArray(userIds) && userIds.length > 0) {
          targetUsers = await User.find({ _id: { $in: userIds } }).select("name email phone").lean();
        } else {
          targetUsers = await User.find({
            role: { $ne: "admin" }
          }).select("name email phone").lean();
        }

        if (targetUsers.length === 0) {
          return NextResponse.json({ error: "No users found to notify" }, { status: 400 });
        }

        let sentCount = 0;
        let failCount = 0;

        for (const u of targetUsers) {
          try {
            if (channel === "WHATSAPP") {
              if (u.phone) {
                await sendWhatsAppMessage(u.phone, message);
                sentCount++;
              } else {
                failCount++;
              }
            } else {
              if (u.email && !u.email.endsWith("@tears.local")) {
                await sendEmail(`BULK-${Date.now()}`, "PROMOTIONAL", u, [], subject, message, imageUrl);
                sentCount++;
              } else {
                failCount++;
              }
            }
          } catch (err) {
            failCount++;
          }
        }

        return NextResponse.json({
          success: true,
          message: `${channel} sent: ${sentCount}, Failed: ${failCount}`,
          totalTargeted: targetUsers.length,
          sentCount,
          failCount,
        });
      }

      case "fetchUsers": {
        const { page = 1, limit = 50, search } = payload || {};
        const query: any = {};
        if (search) {
          query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
          ];
        }
        query.email = { $not: /@tears\.local$/ };

        const total = await User.countDocuments(query);
        const users = await User.find(query)
          .select("name email phone role authProvider createdAt")
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean();

        return NextResponse.json({
          success: true,
          users: users.map((u: any) => ({
            id: u._id,
            name: u.name || "—",
            email: u.email,
            phone: u.phone || "—",
            role: u.role,
            provider: u.authProvider,
            joined: u.createdAt,
          })),
          total,
          page,
          pages: Math.ceil(total / limit),
        });
      }

      case "fetchPendingOrders": {
        const pendingOrders = await Payment.find({
          status: { $in: [PAYMENT_STATUS.PENDING, PAYMENT_STATUS.INITIATED] },
        })
          .sort({ createdAt: -1 })
          .limit(100)
          .select("merchantOrderId amount status user products createdAt updatedAt")
          .lean();

        return NextResponse.json({
          success: true,
          orders: pendingOrders.map((o: any) => ({
            id: o.merchantOrderId,
            amount: o.amount,
            status: o.status,
            customer: {
              name: o.user?.name || "N/A",
              email: o.user?.email || "",
              phone: o.user?.phone || "",
            },
            products: (o.products || []).map((p: any) => ({
              name: p.name,
              qty: p.quantity || 1,
            })),
            createdAt: o.createdAt,
            updatedAt: o.updatedAt,
          })),
        });
      }

      case "updateOrderStatus": {
        const { orderId, newStatus } = payload || {};
        if (!orderId || !newStatus) {
          return NextResponse.json({ error: "orderId and newStatus required" }, { status: 400 });
        }

        const validStatuses = Object.values(PAYMENT_STATUS);
        if (!validStatuses.includes(newStatus)) {
          return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const payment = await Payment.findOne({ merchantOrderId: orderId });
        if (!payment) return NextResponse.json({ error: "Order not found" }, { status: 404 });

        const oldStatus = payment.status;
        payment.status = newStatus;
        payment.updatedAt = new Date();
        await payment.save();

        return NextResponse.json({
          success: true,
          message: `Order ${orderId} updated`,
          oldStatus,
          newStatus,
        });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err) {
    console.error("Admin action error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
