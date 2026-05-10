import crypto from "crypto";
import { logger, logError } from "./logger";

class PhonePeClient {
  private clientId: string;
  private clientSecret: string;
  private clientVersion: number;
  private env: "PRODUCTION" | "SANDBOX";
  private oauthUrl: string;
  private payBaseUrl: string;
  private accessToken: string | null = null;
  private expiresAt: number = 0;

  constructor() {
    this.clientId = process.env.PHONEPE_CLIENT_ID || "";
    this.clientSecret = process.env.PHONEPE_CLIENT_SECRET || "";
    this.clientVersion = parseInt(process.env.PHONEPE_CLIENT_VERSION || "1", 10);
    this.env = (process.env.PHONEPE_ENV || "SANDBOX").toUpperCase() === "PRODUCTION" ? "PRODUCTION" : "SANDBOX";

    this.oauthUrl = this.env === "PRODUCTION"
      ? "https://api.phonepe.com/apis/identity-manager/v1/oauth/token"
      : "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token";

    this.payBaseUrl = this.env === "PRODUCTION"
      ? "https://api.phonepe.com/apis/pg/checkout/v2"
      : "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2";

    if (this.clientId) {
      logger.info("PhonePeClient", "PhonePe client initialized", { environment: this.env });
    }
  }

  generateOrderId(prefix = "TEARS") {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(3).toString("hex").toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  async getAccessToken(): Promise<string> {
    const now = Date.now();
    const bufferMs = 60 * 1000;

    if (this.accessToken && this.expiresAt > now + bufferMs) {
      return this.accessToken;
    }

    try {
      const body = `client_id=${encodeURIComponent(this.clientId)}&client_secret=${encodeURIComponent(this.clientSecret)}&client_version=${this.clientVersion}&grant_type=client_credentials`;

      const response = await fetch(this.oauthUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      if (!response.ok) throw new Error(`OAuth token request failed: ${response.status}`);

      const data = await response.json();
      this.accessToken = data.access_token;
      this.expiresAt = data.expires_at;

      return this.accessToken!;
    } catch (err: any) {
      logError("PhonePeClient", "Failed to get access token", err);
      throw err;
    }
  }

  async initiatePayment({ amount, user, redirectUrl, callbackUrl, orderId }: any) {
    const token = await this.getAccessToken();
    const merchantOrderId = orderId || this.generateOrderId("TEARS");
    const amountInPaise = Math.round(amount * 100);

    const payload = {
      merchantOrderId,
      amount: amountInPaise,
      expireAfter: 300,
      paymentFlow: {
        type: "PG_CHECKOUT",
        merchantUrls: { redirectUrl, cancelUrl: redirectUrl },
      },
      metaInfo: { udf1: user?.email || "", udf2: user?.phone || "" },
    };

    try {
      const response = await fetch(`${this.payBaseUrl}/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `O-Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      if (!response.ok) throw new Error(`Payment initiation failed: ${response.status}`);

      return {
        merchantOrderId,
        redirectUrl: responseData.redirectUrl,
        raw: responseData,
      };
    } catch (err: any) {
      logError("PhonePeClient", "Payment initiation request failed", err, { merchantOrderId });
      throw err;
    }
  }

  async getOrderStatus(merchantOrderId: string) {
    const token = await this.getAccessToken();

    try {
      const response = await fetch(`${this.payBaseUrl}/order/${merchantOrderId}/status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `O-Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(`Status check failed: ${response.status}`);

      let status = "PENDING";
      if (data.state === "COMPLETED") status = "COMPLETED";
      if (data.state === "FAILED") status = "FAILED";

      return {
        state: data.state,
        status,
        amount: data.amount,
        orderId: data.orderId,
        expireAt: data.expireAt,
        paymentDetails: data.paymentDetails || [],
        raw: data,
      };
    } catch (err: any) {
      logError("PhonePeClient", "Order status request failed", err, { merchantOrderId });
      throw err;
    }
  }

  validateWebhook(body: any) {
    let payload = body;
    if (typeof body === "string") payload = JSON.parse(body);

    const event = payload.event;
    const merchantOrderId = payload.payload?.merchantOrderId;
    const state = payload.payload?.state;

    if (!event || !merchantOrderId || !state) {
      throw new Error("Missing required webhook fields");
    }

    return { event, merchantOrderId, state, fullPayload: payload };
  }
}

const client = new PhonePeClient();
export default client;
