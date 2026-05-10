import { NextResponse } from "next/server";
import client from "@/lib/phonepeClient";
import { connectDB } from "@/lib/db";
import Payment from "@/lib/models/payment";
import { PAYMENT_STATUS } from "@/lib/constants";
import { logger, logExecution } from "@/lib/logger";

export async function POST(request) {
  const requestId = `Init-${Date.now()}`;
  logger.info(requestId, "Payment initiation request received");

  try {
    const { amount, customer, products } = await request.json();

    // 1. Amount Validation
    const finalAmount = Number(amount);
    if (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) {
      logger.warn(requestId, "Invalid amount provided", {
        amount,
        finalAmount,
      });
      return NextResponse.json(
        { error: "Invalid amount. Must be greater than 0.", requestId },
        { status: 400 },
      );
    }
    logger.debug(requestId, "Amount validation passed", { finalAmount });

    // 2. Customer Validation
    if (!customer || typeof customer !== "object") {
      logger.warn(
        requestId,
        "Customer validation failed: missing or invalid object",
      );
      return NextResponse.json(
        { error: "Customer details are required.", requestId },
        { status: 400 },
      );
    }
    if (!customer.phone || !customer.email) {
      logger.warn(
        requestId,
        "Customer validation failed: missing phone or email",
        {
          hasPhone: !!customer.phone,
          hasEmail: !!customer.email,
        },
      );
      return NextResponse.json(
        { error: "Customer phone and email are required.", requestId },
        { status: 400 },
      );
    }
    logger.debug(requestId, "Customer validation passed", {
      email: customer.email,
      phone: customer.phone,
    });

    // 3. Products Validation
    if (!products || !Array.isArray(products) || products.length === 0) {
      logger.warn(
        requestId,
        "Products validation failed: empty or invalid array",
      );
      return NextResponse.json(
        { error: "Products array cannot be empty.", requestId },
        { status: 400 },
      );
    }

    const invalidProduct = products.find((p) => !p.productId || !p.amount);
    if (invalidProduct) {
      logger.warn(requestId, "Invalid product structure found", {
        invalidProduct,
      });
      return NextResponse.json(
        {
          error:
            "Invalid product format. Each product must have 'productId' and 'amount'.",
          requestId,
        },
        { status: 400 },
      );
    }
    logger.debug(requestId, "Products validation passed", {
      productCount: products.length,
    });

    const merchantOrderId = client.generateOrderId("TRS");
    logger.info(requestId, "Order ID generated", { merchantOrderId });

    const redirectUrl =
      process.env.PHONEPE_REDIRECT_URL ||
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/redirect`;
    const webhookUrl =
      process.env.WEBHOOK_URL ||
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook`;

    logger.debug(requestId, "URLs configured", {
      redirectUrl,
      webhookUrl,
    });

    const result = await logExecution(
      requestId,
      "client.initiatePayment",
      async () => {
        return await client.initiatePayment({
          amount: finalAmount,
          user: customer,
          redirectUrl,
          callbackUrl: webhookUrl,
          orderId: merchantOrderId,
        });
      },
    );

    logger.info(requestId, "PhonePe payment initiated successfully", {
      merchantOrderId,
      redirectUrl: result.redirectUrl,
    });

    await logExecution(requestId, "Payment.create", async () => {
      await connectDB();
      return await Payment.create({
        merchantOrderId,
        amount: finalAmount,
        user: customer,
        products,
        status: PAYMENT_STATUS.INITIATED,
        rawResponse: result.raw,
      });
    });

    logger.info(requestId, "Payment record created in database", {
      merchantOrderId,
      status: PAYMENT_STATUS.INITIATED,
    });

    return NextResponse.json({
      merchantOrderId,
      redirectUrl: result.redirectUrl,
      requestId,
    });
  } catch (error) {
    logger.error(requestId, "Payment initiation failed", error);
    return NextResponse.json(
      { error: "Payment initiation failed", requestId },
      { status: 500 },
    );
  }
}
