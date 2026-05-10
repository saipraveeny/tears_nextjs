import { NextResponse } from "next/server";
import client from "@/lib/phonepeClient";
import { connectDB } from "@/lib/db";
import Payment from "@/lib/models/payment";
import { sendAllNotifications } from "@/lib/notify";
import { PAYMENT_STATUS } from "@/lib/constants";
import { logger, logError, logExecution } from "@/lib/logger";

async function updatePaymentStatusAndNotify(
  payment,
  newStatus,
  payload,
  requestId,
) {
  if (payment.status !== newStatus) {
    logger.info(requestId, "Payment status update", {
      merchantOrderId: payment.merchantOrderId,
      fromStatus: payment.status,
      toStatus: newStatus,
    });

    payment.status = newStatus;
    payment.updatedAt = new Date();
    payment.webhookPayload = payload;

    await logExecution(
      requestId,
      "payment.save",
      async () => {
        return await payment.save();
      },
      { merchantOrderId: payment.merchantOrderId },
    );

    if ([PAYMENT_STATUS.COMPLETED, PAYMENT_STATUS.FAILED].includes(newStatus)) {
      logger.info(
        requestId,
        "Sending notifications for payment status change",
        { merchantOrderId: payment.merchantOrderId, status: newStatus },
      );
      try {
        await sendAllNotifications(
          payment.merchantOrderId,
          newStatus,
          payment.user,
          payload,
        );
      } catch (notifyErr) {
        logError(requestId, "Notification send failed", notifyErr, {
          merchantOrderId: payment.merchantOrderId,
        });
      }
    }
  }
}

export async function POST(request) {
  const reqId = `Status-${Date.now()}`;
  logger.info(reqId, "Status check request received");

  try {
    const { orderIds } = await request.json();
    logger.debug(reqId, "Status check parameters", { orderIds });

    await connectDB();

    const query = orderIds
      ? {
          $or: [
            {
              merchantOrderId: {
                $in: Array.isArray(orderIds) ? orderIds : [orderIds],
              },
            },
            {
              transactionId: {
                $in: Array.isArray(orderIds) ? orderIds : [orderIds],
              },
            },
          ],
        }
      : { status: { $nin: [PAYMENT_STATUS.COMPLETED, PAYMENT_STATUS.FAILED] } };

    logger.debug(reqId, "Database query", {
      queryType: orderIds ? "specific-orders" : "pending-orders",
      queryJson: JSON.stringify(query),
    });

    const paymentsToCheck = await logExecution(
      reqId,
      "Payment.find",
      async () => {
        return await Payment.find(query).limit(50);
      },
      { queryType: orderIds ? "specific" : "pending" },
    );

    logger.info(reqId, "Payments fetched from database", {
      count: paymentsToCheck.length,
    });

    const updatedPayments = [];

    for (const payment of paymentsToCheck) {
      try {
        logger.debug(reqId, "Checking payment status", {
          merchantOrderId: payment.merchantOrderId,
        });

        const statusResponse = await logExecution(
          reqId,
          `client.getOrderStatus(${payment.merchantOrderId})`,
          async () => {
            return await client.getOrderStatus(payment.merchantOrderId);
          },
        );

        // Map gateway status to internal status constants
        let newStatus = PAYMENT_STATUS.PENDING;
        const gatewayState = statusResponse.state;
        if (
          gatewayState === "COMPLETED" ||
          gatewayState === "PAYMENT_SUCCESS"
        ) {
          newStatus = PAYMENT_STATUS.COMPLETED;
        } else if (
          gatewayState === "FAILED" ||
          gatewayState === "PAYMENT_ERROR"
        ) {
          newStatus = PAYMENT_STATUS.FAILED;
        }

        // Update transactionId if not set
        if (statusResponse.orderId && !payment.transactionId) {
          payment.transactionId = statusResponse.orderId;
        }

        logger.info(reqId, "Payment status from gateway", {
          merchantOrderId: payment.merchantOrderId,
          transactionId: payment.transactionId,
          status: newStatus,
        });

        await updatePaymentStatusAndNotify(
          payment,
          newStatus,
          statusResponse,
          reqId,
        );
        updatedPayments.push({
          merchantOrderId: payment.merchantOrderId,
          status: newStatus,
          amount: payment.amount,
        });
      } catch (e) {
        logError(reqId, "Failed to check payment status", e, {
          merchantOrderId: payment.merchantOrderId,
        });
      }
    }

    logger.info(reqId, "Status check completed", {
      totalChecked: paymentsToCheck.length,
      totalUpdated: updatedPayments.length,
    });

    return NextResponse.json({ success: true, updated: updatedPayments });
  } catch (err) {
    logError(reqId, "Status check failed", err);
    return NextResponse.json(
      {
        error: "Status failed",
        details: err.message,
        requestId: reqId,
      },
      { status: 500 },
    );
  }
}
