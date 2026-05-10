import mongoose from "mongoose";

const WebhookSchema = new mongoose.Schema(
  {
    payload: mongoose.Schema.Types.Mixed,
    receivedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    status: { type: String, default: "RECEIVED" },
  },
  { timestamps: true },
);

const Webhook = mongoose.model("Webhook", WebhookSchema);

export default Webhook;
