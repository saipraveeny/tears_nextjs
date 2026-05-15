import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import { PAYMENT_STATUS } from "./constants";
import { 
  getOrderConfirmationTemplate, 
  getPaymentFailedTemplate, 
  getPendingOrderTemplate, 
  getResetPasswordTemplate,
  getPromotionalTemplate,
  getPartnerInquiryTemplate
} from "./emailTemplates";

const LOGO_PATH = path.join(process.cwd(), "public/assets/logo.png");

const ENABLE_WHATSAPP = (process.env.ENABLE_NOTIF_WHATSAPP || "false") === "true";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: process.env.SMTP_SECURE !== "false",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendAllNotifications(orderId: string, status: string, user: any, payload: any, products: any[]) {
  const messageMap: Record<string, string> = {
    [PAYMENT_STATUS.COMPLETED]: "🔥 Order Confirmed! Your payment was successful. We'll notify you when your TEARS order ships.",
    [PAYMENT_STATUS.FAILED]: "⚠️ Payment Failed. Your transaction for order was unsuccessful. Please retry or contact support.",
    [PAYMENT_STATUS.PENDING]: "⏳ Order Pending. We're waiting for payment confirmation for your TEARS order.",
    [PAYMENT_STATUS.UNKNOWN]: "ℹ️ Order Update. Your payment status has been updated.",
  };

  const whatsappMessage = (messageMap[status] || "Your order status has been updated.") + " Order ID: " + orderId;

  await Promise.allSettled([
    user?.phone ? sendWhatsAppMessage(user.phone, whatsappMessage) : Promise.resolve(null),
    sendEmail(orderId, status, user, products),
  ]);
}

const ADMIN_EMAIL = "tearshxd@gmail.com";

export async function sendEmail(
  orderId: string | null, 
  type: string, 
  user: any, 
  products: any[] = [], 
  customSubject: string | null = null, 
  customMessage: string | null = null, 
  imageUrl: string | null = null, 
  payload: any = null
) {
  const recipientEmail = user?.email;
  const recipientName = user?.name || "Customer";

  if (!recipientEmail) return null;
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;

  try {
    let html = "";
    let subject = customSubject || `Tears Hot Sauce - Order #${orderId}`;

    switch (type) {
      case PAYMENT_STATUS.COMPLETED:
        subject = `Order Confirmed! 🔥 - #${orderId}`;
        const fullAddress = [user.address, user.city, user.state, user.pincode].filter(Boolean).join(", ");
        html = getOrderConfirmationTemplate(recipientName, orderId!, products, calculateTotal(products), {
          email: user.email,
          phone: user.phone,
          address: fullAddress,
        });
        break;
      case PAYMENT_STATUS.FAILED:
        subject = `Payment Failed ⚠️ - #${orderId}`;
        html = getPaymentFailedTemplate(recipientName, orderId!);
        break;
      case PAYMENT_STATUS.PENDING:
      case "INITIATED":
        subject = `Order Pending ⏳ - #${orderId}`;
        html = getPendingOrderTemplate(recipientName, orderId!);
        break;
      case "RESET_PASSWORD":
        subject = "Reset Your Password - TEARS";
        html = getResetPasswordTemplate(recipientName, orderId!); // orderId is the code here
        break;
      case "PROMOTIONAL":
        subject = customSubject || "A Special Update from TEARS";
        html = getPromotionalTemplate(recipientName, subject, customMessage!, imageUrl);
        break;
      case "PARTNER_INQUIRY":
        subject = `Partnership Inquiry - ${payload.businessName} | TEARS`;
        html = getPartnerInquiryTemplate(
          payload.businessName,
          payload.contactName,
          payload.contactNumber,
          payload.email,
          payload.message,
          payload.bestTime
        );
        break;
      default:
        html = `<p>Hi ${recipientName}, your order status is: ${type}</p>`;
    }

    const attachments = [];
    if (fs.existsSync(LOGO_PATH)) {
      attachments.push({
        filename: 'logo.png',
        path: LOGO_PATH,
        cid: 'logo'
      });
    }

    const info = await transporter.sendMail({
      from: `"TEARS Hot Sauce" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      cc: ADMIN_EMAIL,
      subject: subject,
      html: html,
      attachments
    });

    return info;
  } catch (err) {
    console.error("[Notify] Email failed:", err);
    throw err;
  }
}

function calculateTotal(products: any[]) {
  return products.reduce((sum, p) => sum + (p.price || 0) * (p.quantity || 1), 0);
}

export async function sendWhatsAppMessage(phone: string, message: string) {
  try {
    if (!ENABLE_WHATSAPP) return null;
    const token = process.env.WHATSAPP_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_ID;

    if (!token || !phoneId || !phone) return null;

    // Format phone number: remove any non-digit characters and ensure it has country code
    let formattedPhone = phone.replace(/\D/g, "");
    if (formattedPhone.length === 10) formattedPhone = "91" + formattedPhone; // Default to India if 10 digits

    const url = `https://graph.facebook.com/v16.0/${phoneId}/messages`;
    const body = {
      messaging_product: "whatsapp",
      to: formattedPhone,
      type: "text",
      text: { body: message },
    };

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const errorData = await resp.json();
      console.error("[Notify] WhatsApp API error:", errorData);
      throw new Error(`WhatsApp API returned ${resp.status}`);
    }
    return await resp.json();
  } catch (err) {
    console.error("[Notify] WhatsApp failed:", err);
    return null;
  }
}
