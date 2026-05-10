import { NextResponse } from "next/server";
import client from "@/lib/phonepeClient";
import { connectDB } from "@/lib/db";
import Payment from "@/lib/models/Payment";
import { PAYMENT_STATUS } from "@/lib/constants";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  const requestId = `Init-${Date.now()}`;
  
  try {
    const body = await req.json();
    const { amount, customer, products } = body ?? {};

    const finalAmount = Number(amount);
    if (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount.", requestId }, { status: 400 });
    }

    if (!customer || !customer.phone || !customer.email) {
      return NextResponse.json({ error: "Customer details required.", requestId }, { status: 400 });
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "Products required.", requestId }, { status: 400 });
    }

    const merchantOrderId = client.generateOrderId("TEARS");

    const redirectUrl = process.env.PHONEPE_REDIRECT_URL || "https://tears.co.in/api/redirect";
    const webhookUrl = process.env.WEBHOOK_URL || "https://tears.co.in/api/webhook";

    const result = await client.initiatePayment({
      amount: finalAmount,
      user: customer,
      redirectUrl: redirectUrl,
      callbackUrl: webhookUrl,
      orderId: merchantOrderId,
    });

    await connectDB();
    await Payment.create({
      merchantOrderId,
      amount: finalAmount,
      user: customer,
      products: products,
      status: PAYMENT_STATUS.INITIATED,
      rawResponse: result.raw,
    });

    logger.info(requestId, "Payment initiated", { merchantOrderId });

    return NextResponse.json({
      merchantOrderId,
      redirectUrl: result.redirectUrl,
      requestId,
    });

  } catch (err: any) {
    console.error(`[${requestId}] Initiation failed:`, err);
    return NextResponse.json({
      error: "Payment initiation failed",
      details: err.message,
      requestId,
    }, { status: 500 });
  }
}
