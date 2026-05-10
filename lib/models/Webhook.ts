import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWebhook extends Document {
  payload: any;
  receivedAt: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const WebhookSchema = new Schema<IWebhook>(
  {
    payload: Schema.Types.Mixed,
    receivedAt: { type: Date, default: Date.now },
    status: { type: String, default: "RECEIVED" },
  },
  { timestamps: true }
);

const Webhook: Model<IWebhook> = mongoose.models.Webhook || mongoose.model<IWebhook>("Webhook", WebhookSchema);

export default Webhook;
