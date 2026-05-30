import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

const UI_BASE =
  process.env.UI_REDIRECT_URL ||
  "/checkout/result";

async function extractParams(req: Request) {
  const url = new URL(req.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());

  let bodyParams: Record<string, string> = {};
  if (req.method === "POST") {
    try {
      const contentType = req.headers.get("content-type") || "";
      if (contentType.includes("application/x-www-form-urlencoded")) {
        const formData = await req.formData();
        bodyParams = Object.fromEntries(
          Array.from(formData.entries()).map(([k, v]) => [k, String(v)])
        );
      } else if (contentType.includes("application/json")) {
        bodyParams = await req.json().catch(() => ({}));
      }
    } catch (e: any) {
      logger.error("Redirect-Extract", "Failed to parse POST body", { error: e.message });
    }
  }

  // Merge parameters (body parameters override query parameters)
  const merged = { ...queryParams, ...bodyParams };

  const code = merged.code || merged.status || "";
  const transactionId = merged.transactionId || merged.merchantTransactionId || merged.orderId || "";
  const amount = merged.amount || "";

  return { code, transactionId, amount, allParams: merged };
}

export async function GET(req: Request) {
  return handleRedirect(req);
}

export async function POST(req: Request) {
  return handleRedirect(req);
}

async function handleRedirect(req: Request) {
  const reqId = `Redirect-${Date.now()}`;
  logger.info(reqId, `Redirect ${req.method} request received`);

  try {
    const { code, transactionId, amount, allParams } = await extractParams(req);

    logger.info(reqId, "Redirect data extracted", {
      transactionId,
      code,
      amount,
      allParams,
    });

    const params = new URLSearchParams();
    if (transactionId) params.append("orderId", transactionId);
    if (code) params.append("status", code);
    if (amount) params.append("amount", amount);

    const targetUrl = UI_BASE.startsWith("http")
      ? new URL(UI_BASE)
      : new URL(UI_BASE, new URL(req.url).origin);

    params.forEach((value, key) => {
      targetUrl.searchParams.set(key, value);
    });

    logger.info(reqId, "Redirecting user to frontend", { targetUrl: targetUrl.toString() });
    return NextResponse.redirect(targetUrl.toString());
  } catch (err: any) {
    logger.error(reqId, "Redirect processing failed", { error: err.message });
    const targetUrl = UI_BASE.startsWith("http")
      ? new URL(UI_BASE)
      : new URL(UI_BASE, new URL(req.url).origin);
    targetUrl.searchParams.set("error", "processing_failed");
    return NextResponse.redirect(targetUrl.toString());
  }
}
