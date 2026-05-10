import { PAYMENT_STATUS } from "./constants.js";
import { logger, logError } from "./logger.js";

const ENABLE_WHATSAPP =
  (process.env.ENABLE_NOTIF_WHATSAPP || "false") === "true";

export async function sendAllNotifications(orderId, status, user, payload) {
  const notifyContext = `Notify-${orderId}`;

  logger.info(notifyContext, "Starting notification process", {
    orderId,
    status,
    userEmail: user?.email,
  });

  const messageMap = {
    [PAYMENT_STATUS.COMPLETED]:
      "Your payment was successful. We will notify you when your order ships.",
    [PAYMENT_STATUS.FAILED]:
      "Your payment failed. Please retry or contact support.",
    [PAYMENT_STATUS.UNKNOWN]: "Your payment status has been updated.",
  };

  const emailVars = {
    name: user?.name || "Customer",
    message: messageMap[status] || "Your order status has been updated.",
    order_id: orderId,
    email: user?.email || "",
    address: user?.address || "No address provided. Please contact us.",
  };

  logger.debug(notifyContext, "Email template variables prepared", {
    name: emailVars.name,
    email: emailVars.email,
  });

  // Execute notifications in parallel but don't fail if one fails
  const results = await Promise.allSettled([
    sendWhatsAppMessage(orderId, `${emailVars.message} Order ID: ${orderId}`),
    sendEmailEmailJS(orderId, emailVars, status),
  ]);

  results.forEach((result, index) => {
    const notificationType = index === 0 ? "WhatsApp" : "Email";
    if (result.status === "rejected") {
      logError(
        notifyContext,
        `${notificationType} notification failed`,
        result.reason,
      );
    } else {
      logger.debug(notifyContext, `${notificationType} notification sent`, {
        result: result.value,
      });
    }
  });

  logger.info(notifyContext, "Notification process completed", {
    orderId,
    results: results.map((r) => r.status),
  });
}

export async function sendEmailEmailJS(orderId, templateParams, status) {
  const emailContext = `Email-${orderId}`;

  try {
    // Validate required parameters
    if (!process.env.EMAILJS_SERVICE_ID) {
      logger.warn(
        emailContext,
        "EMAILJS_SERVICE_ID not configured, skipping email",
      );
      return null;
    }
    const templateId =
      status === PAYMENT_STATUS.FAILED
        ? process.env.EMAILJS_TEMPLATE_ID_FAILED ||
          process.env.EMAILJS_TEMPLATE_ID
        : process.env.EMAILJS_TEMPLATE_ID;
    if (!templateId) {
      logger.warn(
        emailContext,
        "EMAILJS_TEMPLATE_ID not configured, skipping email",
      );
      return null;
    }
    if (!process.env.EMAILJS_PUBLIC_KEY) {
      logger.warn(
        emailContext,
        "EMAILJS_PUBLIC_KEY not configured, skipping email",
      );
      return null;
    }

    if (!templateParams.email) {
      logger.warn(emailContext, "Recipient email not provided, skipping");
      return null;
    }

    const url =
      process.env.EMAILJS_API_URL ||
      "https://api.emailjs.com/api/v1.0/email/send";

    const payload = {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: templateId,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      template_params: templateParams,
    };

    logger.debug(emailContext, "Sending email via EmailJS", {
      recipient: templateParams.email,
      orderId: templateParams.order_id,
    });

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(`EmailJS API returned ${resp.status}: ${errorText}`);
    }

    const json = await resp.json();
    logger.info(emailContext, "Email sent successfully", {
      recipient: templateParams.email,
      status: resp.status,
    });
    return json;
  } catch (err) {
    logError(emailContext, "Email notification failed", err, {
      templateParams: {
        ...templateParams,
        email: templateParams.email || "unknown",
      },
    });
    throw err;
  }
}

export async function sendWhatsAppMessage(orderId, message) {
  const whatsappContext = `WhatsApp-${orderId}`;

  try {
    if (!ENABLE_WHATSAPP) {
      logger.debug(whatsappContext, "WhatsApp notifications disabled");
      return null;
    }

    // Validate required environment variables
    const token = process.env.WHATSAPP_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_ID;
    const receiver = process.env.WHATSAPP_RECEIVER_NUMBER;

    if (!token || !phoneId || !receiver) {
      logger.warn(
        whatsappContext,
        "WhatsApp credentials not fully configured",
        {
          hasToken: !!token,
          hasPhoneId: !!phoneId,
          hasReceiver: !!receiver,
        },
      );
      return null;
    }

    if (!message || message.trim().length === 0) {
      logger.warn(whatsappContext, "Empty message provided");
      return null;
    }

    const url = `https://graph.facebook.com/v16.0/${phoneId}/messages`;
    const body = {
      messaging_product: "whatsapp",
      to: receiver,
      type: "text",
      text: { body: message },
    };

    logger.debug(whatsappContext, "Sending WhatsApp message", {
      receiver: receiver,
      messageLength: message.length,
    });

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(`WhatsApp API returned ${resp.status}: ${errorText}`);
    }

    const json = await resp.json();
    logger.info(whatsappContext, "WhatsApp message sent successfully", {
      receiver: receiver,
      messageId: json.messages?.[0]?.id,
    });
    return json;
  } catch (err) {
    logError(whatsappContext, "WhatsApp notification failed", err, {
      messageLength: message?.length,
    });
    throw err;
  }
}
