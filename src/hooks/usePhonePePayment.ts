import { useState } from "react";
import axios from "axios";

interface PaymentResponse {
  status: "success" | "pending" | "failure";
  transactionId?: string;
  message?: string;
}

export const usePhonePePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = async (
    paymentData: any
  ): Promise<PaymentResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/phonepe/initiate", paymentData);
      return response.data;
    } catch (err) {
      setError("Payment initiation failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    initiatePayment,
    loading,
    error,
  };
};
