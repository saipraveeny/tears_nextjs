import { NextResponse } from "next/server";
import client from "@/lib/phonepeClient";
import { connectDB } from "@/lib/db";
import Payment from "@/lib/models/Payment";
import Webhook from "@/lib/models/Webhook";
import { sendAllNotifications } from "@/lib/notify";
import { PAYMENT_STATUS } from "@/lib/constants";
import { logger } from "@/lib/logger";
import User from "@/lib/models/User";
import Cart from "@/lib/models/Cart";

export async function POST(req: Request) {
  const reqId = `Webhook-${Date.now()}`;

  try {
    const body = await req.json();

    let event, merchantOrderId, state, fullPayload;
    try {
      const validationResult = client.validateWebhook(body);
      event = validationResult.event;
      merchantOrderId = validationResult.merchantOrderId;
      state = validationResult.state;
      fullPayload = validationResult.fullPayload;
    } catch (validationErr: any) {
      console.error(
        `[${reqId}] Webhook validation failed:`,
        validationErr.message,
      );
      return NextResponse.json({ error: "Invalid webhook" }, { status: 403 });
    }

    await connectDB();

    try {
      await Webhook.create({
        payload: fullPayload,
        receivedAt: new Date(),
        status: state,
      });
    } catch (dbErr) {
      console.error(`[${reqId}] Failed to log webhook:`, dbErr);
    }

    let newStatus = null;
    if (state === "COMPLETED" || state === "PAYMENT_SUCCESS") {
      newStatus = PAYMENT_STATUS.COMPLETED;
    } else if (state === "FAILED" || state === "PAYMENT_ERROR") {
      newStatus = PAYMENT_STATUS.FAILED;
    }

    if (newStatus && merchantOrderId) {
      const payment = await Payment.findOne({ merchantOrderId });

      if (payment) {
        if (payment.status !== newStatus) {
          payment.status = newStatus as any;
          payment.webhookPayload = fullPayload;
          payment.notificationSent = false;
          payment.updatedAt = new Date();
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
                  `[${reqId}] Webhook cleared cart for user: ${payment.user.email}`,
                );
              }
            } catch (cartErr) {
              console.error(
                `[${reqId}] Webhook failed to clear cart:`,
                cartErr,
              );
            }
          }

          // Do not send notifications from the webhook.
          // The email should wait until the user returns to the site and the frontend polls status.
          // This avoids the immediate send before the browser redirect completes.
          // Notifications will be sent later from the status endpoint.
        }
      }
    }

    return NextResponse.json({ received: true, requestId: reqId });
  } catch (error: any) {
    console.error(`[${reqId}] Webhook processing error:`, error);
    return NextResponse.json(
      { error: "Webhook processing failed", requestId: reqId },
      { status: 500 },
    );
  }
}
