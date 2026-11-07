import { NextResponse } from "next/server";
import client from "@/lib/phonepeClient";
import { connectDB } from "@/lib/db";
import Payment from "@/lib/models/Payment";
import { PAYMENT_STATUS } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { ALL_PRODUCTS } from "@/utils/productData";

export async function POST(req: Request) {
  const requestId = `Init-${Date.now()}`;

  try {
    const body = await req.json();
    const { amount, customer, products } = body ?? {};

    const finalAmount = Number(amount);
    if (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount.", requestId },
        { status: 400 },
      );
    }

    if (!customer || !customer.phone || !customer.email) {
      return NextResponse.json(
        { error: "Customer details required.", requestId },
        { status: 400 },
      );
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: "Products required.", requestId },
        { status: 400 },
      );
    }

    const totalQty =
      products.reduce(
        (sum: number, p: any) => sum + (Number(p?.quantity ?? p?.qty ?? 1) || 1),
        0,
      ) || 1;

    const normalizedProducts = products.map((p: any) => {
      const rawVal = p?.amount ?? p?.price ?? 0;
      let unitAmount =
        typeof rawVal === "string"
          ? parseFloat(rawVal.replace(/[^\d.]/g, ""))
          : Number(rawVal);

      if (!unitAmount || isNaN(unitAmount) || unitAmount <= 0) {
        const matched = ALL_PRODUCTS.find(
          (ap) =>
            String(ap.id) === String(p?.productId ?? p?.id) ||
            ap.name?.toLowerCase() === String(p?.name || "").toLowerCase(),
        );
        if (matched) {
          unitAmount =
            parseFloat(String(matched.price).replace(/[^\d.]/g, "")) || 0;
        }
      }

      if (!unitAmount || isNaN(unitAmount) || unitAmount <= 0) {
        unitAmount = Math.round((finalAmount / totalQty) * 100) / 100;
      }

      const quantity = Number(p?.quantity ?? p?.qty ?? 1) || 1;
      return {
        productId: String(p?.productId ?? p?.id ?? "unknown"),
        name: p?.name || "Tears Hot Sauce",
        size: p?.size || "",
        quantity,
        amount: unitAmount,
        price: unitAmount,
      };
    });

    const clientId = process.env.PHONEPE_CLIENT_ID;
    const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return NextResponse.json(
        {
          error: "PhonePe Integration is incomplete.",
          details:
            "PHONEPE_CLIENT_ID or PHONEPE_CLIENT_SECRET environment variables are missing on the server. Please configure them in your hosting provider's dashboard.",
          requestId,
        },
        { status: 500 },
      );
    }

    const merchantOrderId = client.generateOrderId("TRS");

    const origin = req.headers.get("origin") || "https://tears.co.in";
    const redirectUrl =
      process.env.PHONEPE_REDIRECT_URL || `${origin}/api/redirect`;
    const webhookUrl = process.env.WEBHOOK_URL || `${origin}/api/webhook`;

    console.log(`[${requestId}] Payment config:`, {
      redirectUrl,
      webhookUrl,
      origin,
    });

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
      products: normalizedProducts,
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
    return NextResponse.json(
      {
        error: "Payment initiation failed",
        details: err.message,
        requestId,
      },
      { status: 500 },
    );
  }
}
