import { NextResponse } from "next/server";
import client from "@/lib/phonepeClient";
import { connectDB } from "@/lib/db";
import Payment from "@/lib/models/payment";
import Webhook from "@/lib/models/webhook";
import { sendAllNotifications } from "@/lib/notify";
import { PAYMENT_STATUS } from "@/lib/constants";
import { logger, logError } from "@/lib/logger";

export async function POST(request) {
  const reqId = `Webhook-${Date.now()}`;
  logger.info(reqId, "Webhook received");

  try {
    const headers = Object.fromEntries(request.headers);
    const body = await request.text();

    logger.debug(reqId, "Validating webhook signature");

    let event, merchantOrderId, state, fullPayload;

    try {
      const validationResult = client.validateWebhook(headers, body);
      event = validationResult.event;
      merchantOrderId = validationResult.merchantOrderId;
      state = validationResult.state;
      fullPayload = validationResult.fullPayload;
    } catch (validationErr) {
      logError(reqId, "Webhook validation failed", validationErr, {
        headers: Object.keys(headers),
        bodyLength: body?.length,
      });
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 403 },
      );
    }

    logger.info(reqId, "Webhook validated", {
      event,
      merchantOrderId,
      state,
    });

    await connectDB();

    // Log raw webhook
    try {
      await Webhook.create({
        payload: fullPayload,
        receivedAt: new Date(),
        status: state,
      });
      logger.debug(reqId, "Webhook payload logged to database");
    } catch (dbErr) {
      logError(reqId, "Failed to save webhook log to database", dbErr);
    }

    // Map Status
    let newStatus = null;
    if (state === "COMPLETED" || state === "PAYMENT_SUCCESS") {
      newStatus = PAYMENT_STATUS.COMPLETED;
    } else if (state === "FAILED" || state === "PAYMENT_ERROR") {
      newStatus = PAYMENT_STATUS.FAILED;
    }

    logger.debug(reqId, "Status mapping", {
      gatewayState: state,
      mappedStatus: newStatus,
    });

    // Update Payment
    if (newStatus && merchantOrderId) {
      try {
        const payment = await Payment.findOne({ merchantOrderId });

        if (!payment) {
          logError(
            reqId,
            "Payment record not found in database",
            new Error("Payment not found"),
            { merchantOrderId },
          );
          return NextResponse.json({
            received: true,
            warning: "Payment record not found",
            requestId: reqId,
          });
        }

        if (payment.status === PAYMENT_STATUS.COMPLETED) {
          logger.warn(
            reqId,
            "Payment already completed, ignoring duplicate webhook",
            {
              merchantOrderId,
            },
          );
        } else {
          logger.info(reqId, "Updating payment status", {
            merchantOrderId,
            previousStatus: payment.status,
            newStatus,
          });

          payment.status = newStatus;
          payment.webhookPayload = fullPayload;
          payment.updatedAt = new Date();

          try {
            await payment.save();
            logger.info(reqId, "Payment status updated in database", {
              merchantOrderId,
              status: newStatus,
            });
          } catch (saveErr) {
            logError(reqId, "Failed to save payment status update", saveErr, {
              merchantOrderId,
            });
            throw saveErr;
          }

          // Send notifications
          try {
            logger.info(reqId, "Sending notifications", {
              merchantOrderId,
              status: newStatus,
            });
            await sendAllNotifications(
              merchantOrderId,
              newStatus,
              payment.user,
              fullPayload,
            );
            logger.info(reqId, "Notifications sent successfully", {
              merchantOrderId,
            });
          } catch (notifyErr) {
            logError(reqId, "Failed to send notifications", notifyErr, {
              merchantOrderId,
            });
          }
        }
      } catch (err) {
        logError(reqId, "Failed to update payment", err, { merchantOrderId });
      }
    } else {
      logger.warn(
        reqId,
        "Unable to determine new status or missing merchantOrderId",
        {
          newStatus,
          merchantOrderId,
        },
      );
    }

    return NextResponse.json({ received: true, requestId: reqId });
  } catch (error) {
    logError(reqId, "Webhook processing error", error, {
      reqHeaders: Object.keys(Object.fromEntries(request.headers)),
    });
    return NextResponse.json(
      {
        error: "Webhook processing failed",
        requestId: reqId,
      },
      { status: 500 },
    );
  }
}
