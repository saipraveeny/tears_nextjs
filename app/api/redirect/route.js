import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

const UI_BASE =
  process.env.UI_REDIRECT_URL ||
  `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/result`;

export async function GET(request) {
  const reqId = `Redirect-${Date.now()}`;
  logger.info(reqId, "Redirect GET request received");

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const transactionId = searchParams.get("transactionId");
    const amount = searchParams.get("amount");

    const txId = transactionId;
    const status = code;
    const amt = amount;

    logger.debug(reqId, "Redirect data extracted", {
      transactionId: txId,
      status,
      amount: amt,
    });

    if (!txId) {
      logger.warn(reqId, "No transaction ID found in request");
    }

    const params = new URLSearchParams();
    if (txId) params.append("orderId", txId);
    if (status) params.append("status", status);
    if (amt) params.append("amount", amt);

    const targetUrl = `${UI_BASE}?${params.toString()}`;
    logger.info(reqId, "Redirecting user to frontend", { targetUrl });

    return NextResponse.redirect(targetUrl);
  } catch (err) {
    logger.error(reqId, "Redirect processing failed", { error: err.message });
    return NextResponse.redirect(`${UI_BASE}?error=processing_failed`);
  }
}

export async function POST(request) {
  const reqId = `Redirect-${Date.now()}`;
  logger.info(reqId, "Redirect POST request received");

  try {
    const body = await request.json();
    const query = Object.fromEntries(new URL(request.url).searchParams);

    const { code, transactionId, amount } = { ...body, ...query };

    const txId = transactionId;
    const status = code;
    const amt = amount;

    logger.debug(reqId, "Redirect data extracted", {
      transactionId: txId,
      status,
      amount: amt,
    });

    if (!txId) {
      logger.warn(reqId, "No transaction ID found in request");
    }

    const params = new URLSearchParams();
    if (txId) params.append("orderId", txId);
    if (status) params.append("status", status);
    if (amt) params.append("amount", amt);

    const targetUrl = `${UI_BASE}?${params.toString()}`;
    logger.info(reqId, "Redirecting user to frontend", { targetUrl });

    return NextResponse.redirect(targetUrl);
  } catch (err) {
    logger.error(reqId, "Redirect processing failed", { error: err.message });
    return NextResponse.redirect(`${UI_BASE}?error=processing_failed`);
  }
}
