import { logger, logError } from "./logger.js";
import crypto from "crypto";

class PhonePeClient {
  constructor() {
    // Validate required environment variables
    const required = [
      "PHONEPE_CLIENT_ID",
      "PHONEPE_CLIENT_SECRET",
      "PHONEPE_CLIENT_VERSION",
    ];
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(", ")}`,
      );
    }

    this.clientId = process.env.PHONEPE_CLIENT_ID;
    this.clientSecret = process.env.PHONEPE_CLIENT_SECRET;
    this.clientVersion = parseInt(
      process.env.PHONEPE_CLIENT_VERSION || "1",
      10,
    );
    this.env =
      (process.env.PHONEPE_ENV || "SANDBOX").toUpperCase() === "PRODUCTION"
        ? "PRODUCTION"
        : "SANDBOX";

    // OAuth endpoints
    this.oauthUrl =
      this.env === "PRODUCTION"
        ? "https://api.phonepe.com/apis/identity-manager/v1/oauth/token"
        : "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token";

    // Payment endpoints
    this.payBaseUrl =
      this.env === "PRODUCTION"
        ? "https://api.phonepe.com/apis/pg/checkout/v2"
        : "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2";

    // Token cache
    this.accessToken = null;
    this.expiresAt = 0;

    logger.info("PhonePeClient", "PhonePe client initialized", {
      environment: this.env,
      clientId: this.clientId.substring(0, 5) + "***",
    });
  }

  /**
   * Generate unique merchant order ID
   */
  generateOrderId(prefix = "TEARS") {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(3).toString("hex").toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  /**
   * Get access token with caching and auto-refresh
   */
  async getAccessToken() {
    const now = Date.now();
    const bufferMs = 60 * 1000; // 60 seconds buffer before expiry

    // Return cached token if still valid
    if (this.accessToken && this.expiresAt > now + bufferMs) {
      logger.debug("PhonePeClient", "Using cached access token", {
        expiresIn: Math.round((this.expiresAt - now) / 1000) + "s",
      });
      return this.accessToken;
    }

    logger.info(
      "PhonePeClient",
      "Fetching new access token from OAuth endpoint",
    );

    try {
      // Build form-encoded request body manually to avoid Expect header issues
      const body = `client_id=${encodeURIComponent(this.clientId)}&client_secret=${encodeURIComponent(this.clientSecret)}&client_version=${this.clientVersion}&grant_type=client_credentials`;

      const response = await fetch(this.oauthUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });

      if (!response.ok) {
        logger.error("PhonePeClient", "OAuth token request failed", {
          status: response.status,
          url: this.oauthUrl,
        });
        throw new Error(`OAuth token request failed: ${response.status}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.expiresAt = data.expires_at; // epoch in milliseconds

      logger.info("PhonePeClient", "Access token obtained", {
        expiresAt: new Date(this.expiresAt),
        expiresInSeconds: Math.round((this.expiresAt - now) / 1000),
      });

      return this.accessToken;
    } catch (err) {
      logger.error("PhonePeClient", "Failed to get access token", {
        error: err.message,
        url: this.oauthUrl,
      });
      throw err;
    }
  }

  /**
   * Initiate payment
   */
  async initiatePayment({ amount, user, redirectUrl, callbackUrl, orderId }) {
    const token = await this.getAccessToken();
    const merchantOrderId = orderId || this.generateOrderId("TEARS");
    const amountInPaise = Math.round(amount * 100); // Convert rupees to paise

    const payload = {
      merchantOrderId,
      amount: amountInPaise,
      expireAfter: 300, // 5 minutes
      paymentFlow: {
        type: "PG_CHECKOUT",
        merchantUrls: {
          redirectUrl,
          cancelUrl: redirectUrl,
        },
      },
      metaInfo: {
        udf1: user?.email || "",
        udf2: user?.phone || "",
      },
    };

    logger.debug("PhonePeClient", "Initiating payment", {
      merchantOrderId,
      amount: amountInPaise,
      redirectUrl,
    });

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

      if (!response.ok) {
        const error = new Error(
          `Payment initiation failed: ${response.status}`,
        );
        error.status = response.status;
        error.data = responseData;
        error.url = `${this.payBaseUrl}/pay`;
        logger.error("PhonePeClient", "Payment initiation API error", {
          status: response.status,
          url: `${this.payBaseUrl}/pay`,
          merchantOrderId,
          errorCode: responseData?.code,
        });
        throw error;
      }

      logger.info("PhonePeClient", "Payment initiated successfully", {
        orderId: responseData.orderId,
        state: responseData.state,
        merchantOrderId,
      });

      return {
        merchantOrderId,
        redirectUrl: responseData.redirectUrl,
        raw: responseData,
      };
    } catch (err) {
      logError("PhonePeClient", "Payment initiation request failed", err, {
        merchantOrderId,
      });
      throw err;
    }
  }

  /**
   * Get order status
   */
  async getOrderStatus(merchantOrderId) {
    const token = await this.getAccessToken();

    logger.debug("PhonePeClient", "Checking order status", { merchantOrderId });

    try {
      const response = await fetch(
        `${this.payBaseUrl}/order/${merchantOrderId}/status`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `O-Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        const error = new Error(`Status check failed: ${response.status}`);
        error.status = response.status;
        error.data = data;
        logger.error("PhonePeClient", "Status check API error", {
          status: response.status,
          merchantOrderId,
          errorCode: data?.code,
        });
        throw error;
      }

      // Map state to internal status
      let status = "PENDING";
      if (data.state === "COMPLETED") status = "COMPLETED";
      if (data.state === "FAILED") status = "FAILED";

      logger.info("PhonePeClient", "Order status retrieved", {
        merchantOrderId,
        state: data.state,
        status,
      });

      return {
        state: data.state,
        status,
        amount: data.amount,
        orderId: data.orderId,
        expireAt: data.expireAt,
        paymentDetails: data.paymentDetails || [],
        raw: data,
      };
    } catch (err) {
      logError("PhonePeClient", "Order status request failed", err, {
        merchantOrderId,
      });
      throw err;
    }
  }

  /**
   * Validate webhook signature
   */
  validateWebhook(headers, body) {
    logger.debug("PhonePeClient", "Validating webhook");

    // Parse body if it's a string
    let payload = body;
    if (typeof body === "string") {
      try {
        payload = JSON.parse(body);
      } catch (e) {
        throw new Error("Invalid webhook payload JSON");
      }
    }

    // Extract event and merchantOrderId from payload
    const event = payload.event;
    const merchantOrderId = payload.payload?.merchantOrderId;
    const state = payload.payload?.state;
    const fullPayload = payload;

    if (!event || !merchantOrderId || !state) {
      throw new Error(
        "Missing required webhook fields: event, merchantOrderId, or state",
      );
    }

    // Sanitize webhook payload for logging (remove PII)
    const sanitized = {
      event,
      merchantOrderId,
      state,
    };
    logger.info("PhonePeClient", "Webhook validated", sanitized);

    return {
      event,
      merchantOrderId,
      state,
      fullPayload,
    };
  }
}

// Export singleton instance
export default new PhonePeClient();
