import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";
import Payment from "@/lib/models/Payment";
import User from "@/lib/models/User";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    await connectDB();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [overallAgg] = await Payment.aggregate([
      { $match: { status: "COMPLETED" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: "$amount" },
        },
      },
    ]);

    const [todayAgg] = await Payment.aggregate([
      { $match: { status: "COMPLETED", createdAt: { $gte: todayStart } } },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$amount" },
          orders: { $sum: 1 },
        },
      },
    ]);

    const [monthAgg] = await Payment.aggregate([
      { $match: { status: "COMPLETED", createdAt: { $gte: monthStart } } },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$amount" },
          orders: { $sum: 1 },
        },
      },
    ]);

    const [prevMonthAgg] = await Payment.aggregate([
      {
        $match: {
          status: "COMPLETED",
          createdAt: { $gte: prevMonthStart, $lt: monthStart },
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$amount" },
          orders: { $sum: 1 },
        },
      },
    ]);

    const statusDistribution = await Payment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const dailyTrend = await Payment.aggregate([
      { $match: { status: "COMPLETED", createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          revenue: { $sum: "$amount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const allOrdersDailyTrend = await Payment.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const topProducts = await Payment.aggregate([
      { $match: { status: "COMPLETED" } },
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.name",
          totalQty: { $sum: { $ifNull: ["$products.quantity", 1] } },
          totalRevenue: { $sum: "$products.amount" },
        },
      },
      { $sort: { totalQty: -1 } },
      { $limit: 10 },
    ]);

    const ordersByCity = await Payment.aggregate([
      { $match: { status: "COMPLETED" } },
      {
        $project: {
          city: {
            $cond: {
              if: {
                $and: [
                  { $ne: ["$user.city", null] },
                  { $ne: ["$user.city", ""] },
                ],
              },
              then: { $trim: { input: "$user.city" } },
              else: {
                $let: {
                  vars: {
                    parts: {
                      $split: [{ $ifNull: ["$user.address", ""] }, ","],
                    },
                  },
                  in: {
                    $cond: {
                      if: { $gte: [{ $size: "$$parts" }, 2] },
                      then: {
                        $trim: {
                          input: {
                            $arrayElemAt: [
                              "$$parts",
                              {
                                $subtract: [{ $size: "$$parts" }, 2],
                              },
                            ],
                          },
                        },
                      },
                      else: "Unknown",
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        $group: {
          _id: "$city",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 15 },
    ]);

    const totalUsers = await User.countDocuments();
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: monthStart },
    });

    const recentOrders = await Payment.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .select(
        "merchantOrderId amount status user products createdAt updatedAt"
      )
      .lean();

    const totalAllOrders = await Payment.countDocuments();

    return NextResponse.json({
      success: true,
      data: {
        revenue: {
          total: overallAgg?.totalRevenue || 0,
          today: todayAgg?.revenue || 0,
          thisMonth: monthAgg?.revenue || 0,
          prevMonth: prevMonthAgg?.revenue || 0,
          avgOrderValue: overallAgg?.avgOrderValue || 0,
        },
        orders: {
          total: totalAllOrders,
          completed: overallAgg?.totalOrders || 0,
          today: todayAgg?.orders || 0,
          thisMonth: monthAgg?.orders || 0,
          prevMonth: prevMonthAgg?.orders || 0,
          statusDistribution: statusDistribution.map((s) => ({
            status: s._id,
            count: s.count,
          })),
        },
        users: {
          total: totalUsers,
          newThisMonth: newUsersThisMonth,
        },
        trends: {
          daily: dailyTrend.map((d) => ({
            date: d._id,
            revenue: d.revenue,
            orders: d.orders,
          })),
          allOrdersDaily: allOrdersDailyTrend.map((d) => ({
            date: d._id,
            orders: d.orders,
          })),
        },
        products: {
          top: topProducts.map((p) => ({
            name: p._id,
            quantity: p.totalQty,
            revenue: p.totalRevenue,
          })),
        },
        geography: {
          cities: ordersByCity.map((c) => ({
            city: c._id || "Unknown",
            orders: c.count,
          })),
        },
        recentOrders: recentOrders.map((o: any) => ({
          id: o.merchantOrderId,
          amount: o.amount,
          status: o.status,
          customer: {
            name: o.user?.name || "N/A",
            email: o.user?.email || "",
            phone: o.user?.phone || "",
            city: o.user?.city || "",
            state: o.user?.state || "",
          },
          products: (o.products || []).map((p: any) => ({
            name: p.name,
            qty: p.quantity || 1,
            amount: p.amount,
          })),
          date: o.createdAt,
        })),
      },
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
