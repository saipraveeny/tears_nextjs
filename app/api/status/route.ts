import { NextResponse } from "next/server";
import client from "@/lib/phonepeClient";
import { connectDB } from "@/lib/db";
import Payment from "@/lib/models/Payment";
import { sendAllNotifications } from "@/lib/notify";
import { PAYMENT_STATUS } from "@/lib/constants";
import { logger } from "@/lib/logger";

async function updatePaymentStatusAndNotify(
  payment: any,
  newStatus: string,
  payload: any,
  requestId: string
) {
  if (payment.status !== newStatus) {
    payment.status = newStatus;
    payment.updatedAt = new Date();
    payment.webhookPayload = payload;

    await payment.save();

    if ([PAYMENT_STATUS.COMPLETED, PAYMENT_STATUS.FAILED].includes(newStatus as any)) {
      try {
        await sendAllNotifications(
          payment.merchantOrderId,
          newStatus,
          payment.user,
          payload,
          payment.products
        );
      } catch (notifyErr) {
        console.error(`[${requestId}] Notification failed for ${payment.merchantOrderId}:`, notifyErr);
      }
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
                $in: typeof targetIds === "string" ? targetIds.split(",") : targetIds,
              },
            },
            {
              transactionId: {
                $in: typeof targetIds === "string" ? targetIds.split(",") : targetIds,
              },
            },
          ],
        }
      : { status: { $nin: [PAYMENT_STATUS.COMPLETED, PAYMENT_STATUS.FAILED] } };

    const paymentsToCheck = await Payment.find(query).limit(50);
    const updatedPayments = [];

    for (const payment of paymentsToCheck) {
      try {
        const statusResponse = await client.getOrderStatus(payment.merchantOrderId);

        let newStatus: string = PAYMENT_STATUS.PENDING;
        const gatewayState = statusResponse.state;
        if (gatewayState === "COMPLETED" || gatewayState === "PAYMENT_SUCCESS") {
          newStatus = PAYMENT_STATUS.COMPLETED;
        } else if (gatewayState === "FAILED" || gatewayState === "PAYMENT_ERROR") {
          newStatus = PAYMENT_STATUS.FAILED;
        }

        if (statusResponse.orderId && !payment.transactionId) {
          payment.transactionId = statusResponse.orderId;
        }

        await updatePaymentStatusAndNotify(payment, newStatus, statusResponse, reqId);
        updatedPayments.push({
          merchantOrderId: payment.merchantOrderId,
          status: newStatus,
          amount: payment.amount,
        });
      } catch (e) {
        console.error(`[${reqId}] Failed to check ${payment.merchantOrderId}:`, e);
      }
    }

    return NextResponse.json({ success: true, updated: updatedPayments });
  } catch (err: any) {
    console.error(`[${reqId}] Status check failed:`, err);
    return NextResponse.json({
      error: "Status failed",
      details: err.message,
      requestId: reqId,
    }, { status: 500 });
  }
}
