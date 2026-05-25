import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Payment from "@/lib/models/Payment";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    // Fetch all orders for the authenticated user
    const orders = await Payment.find({ "user.email": user.email })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      orders: orders || [],
    });
  } catch (err) {
    console.error("Orders fetch error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
