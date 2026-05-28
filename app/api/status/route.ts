import { NextResponse } from "next/server";
import client from "@/lib/phonepeClient";
import { connectDB } from "@/lib/db";
import Payment from "@/lib/models/Payment";
import { sendAllNotifications } from "@/lib/notify";
import { PAYMENT_STATUS } from "@/lib/constants";
import { logger } from "@/lib/logger";
import User from "@/lib/models/User";
import Cart from "@/lib/models/Cart";

async function updatePaymentStatusAndNotify(
  payment: any,
  newStatus: string,
  payload: any,
  requestId: string,
) {
  const statusChanged = payment.status !== newStatus;
  if (statusChanged) {
    payment.status = newStatus;
    payment.updatedAt = new Date();
    payment.webhookPayload = payload;
    if (newStatus === PAYMENT_STATUS.COMPLETED) {
      payment.notificationSent = false;
    }

    await payment.save();

    // Clear user's cart upon successful payment to prevent abandonment emails
    if (newStatus === PAYMENT_STATUS.COMPLETED && payment.user?.email) {
      try {
        const userObj = await User.findOne({ email: payment.user.email });
        if (userObj) {
          await Cart.findOneAndUpdate(
            { userId: userObj._id },
            { $set: { items: [], totalAmount: 0 } },
          );
          console.log(
            `[${requestId}] Status API cleared cart for user: ${payment.user.email}`,
          );
        }
      } catch (cartErr) {
        console.error(
          `[${requestId}] Status API failed to clear cart:`,
          cartErr,
        );
      }
    }
  }

  if (newStatus === PAYMENT_STATUS.COMPLETED && !payment.notificationSent) {
    try {
      await sendAllNotifications(
        payment.merchantOrderId,
        newStatus,
        payment.user,
        payload,
        payment.products,
        payment.amount,
      );
      payment.notificationSent = true;
      await payment.save();
    } catch (notifyErr) {
      console.error(
        `[${requestId}] Notification failed for ${payment.merchantOrderId}:`,
        notifyErr,
      );
    }
  }
}

export async function POST(req: Request) {
  const reqId = `Status-${Date.now()}`;

  try {
    const { searchParams } = new URL(req.url);
    const body = await req.json().catch(() => ({}));

    const targetIds = searchParams.get("orderIds") || body.orderIds;

    await connectDB();

    const query: any = targetIds
      ? {
          $or: [
            {
              merchantOrderId: {
                $in:
                  typeof targetIds === "string"
                    ? targetIds.split(",")
                    : targetIds,
              },
            },
            {
              transactionId: {
                $in:
                  typeof targetIds === "string"
                    ? targetIds.split(",")
                    : targetIds,
              },
            },
          ],
        }
      : { status: { $nin: [PAYMENT_STATUS.COMPLETED, PAYMENT_STATUS.FAILED] } };

    const paymentsToCheck = await Payment.find(query).limit(50);
    const updatedPayments = [];

    for (const payment of paymentsToCheck) {
      try {
        const statusResponse = await client.getOrderStatus(
          payment.merchantOrderId,
        );

        let newStatus: string = PAYMENT_STATUS.PENDING;
        const gatewayState = statusResponse.state;
        if (
          gatewayState === "COMPLETED" ||
          gatewayState === "PAYMENT_SUCCESS"
        ) {
          newStatus = PAYMENT_STATUS.COMPLETED;
        } else if (
          gatewayState === "FAILED" ||
          gatewayState === "PAYMENT_ERROR"
        ) {
          newStatus = PAYMENT_STATUS.FAILED;
        }

        if (statusResponse.orderId && !payment.transactionId) {
          payment.transactionId = statusResponse.orderId;
        }

        await updatePaymentStatusAndNotify(
          payment,
          newStatus,
          statusResponse,
          reqId,
        );
        updatedPayments.push({
          merchantOrderId: payment.merchantOrderId,
          status: newStatus,
          amount: payment.amount,
        });
      } catch (e) {
        console.error(
          `[${reqId}] Failed to check ${payment.merchantOrderId}:`,
          e,
        );
      }
    }

    return NextResponse.json({ success: true, updated: updatedPayments });
  } catch (err: any) {
    console.error(`[${reqId}] Status check failed:`, err);
    return NextResponse.json(
      {
        error: "Status failed",
        details: err.message,
        requestId: reqId,
      },
      { status: 500 },
    );
  }
}
