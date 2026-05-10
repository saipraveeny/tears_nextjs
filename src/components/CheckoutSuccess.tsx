"use client";

import React, { useState, useEffect } from "react";
import { API_BASE, MAX_POLLS, POLLS_FREQUENCY_IN_MS } from "../utils/constants";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const CheckoutSuccess = ({ onOrderSuccess, onCartClear }) => {
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [statusData, setStatusData] = useState(null);
  const [error, setError] = useState(null);
  const [pollCount, setPollCount] = useState(0);

  const [transactionId, setTransactionId] = useState(null);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setTransactionId(params.get("transactionId") || params.get("txnId"));
      setOrderId(params.get("orderId") || sessionStorage.getItem("pendingOrderId"));
    }
  }, []);

  useEffect(() => {
    let timeoutId;
    let isMounted = true;

    const fetchStatus = async () => {
      try {
        if (!orderId && !transactionId) {
          setLoadingStatus(false);
          setError("No Order ID found.");
          return;
        }

        const query = transactionId
          ? `orderIds=${encodeURIComponent(transactionId)}`
          : `orderIds=${encodeURIComponent(orderId)}`;

        const res = await fetch(`${API_BASE}/api/status?${query}`, {
          method: "POST",
        });
        if (!res.ok) throw new Error("Status check failed");

        const json = await res.json();
        const payment =
          (json.updated && json.updated[0]) ||
          (json.updatedPayments && json.updatedPayments[0]);

        if (isMounted) {
          if (payment) {
            setStatusData(payment);
            const st = payment.status;

            // Stop if Final
            if (
              ["COMPLETED", "FAILED", "SUCCESS", "PAYMENT_SUCCESS"].includes(st)
            ) {
              setLoadingStatus(false);
              if (st === "COMPLETED" || st === "SUCCESS") {
                onOrderSuccess?.({
                  id: payment.merchantOrderId,
                  total: payment.amount,
                });
                onCartClear?.();
                sessionStorage.removeItem("pendingOrderId");
              }
            } else {
              // Continue Polling
              if (pollCount < MAX_POLLS) {
                setPollCount((prev) => prev + 1);
                timeoutId = setTimeout(fetchStatus, POLLS_FREQUENCY_IN_MS);
              } else {
                setLoadingStatus(false);
                setError("Verification timed out. Please contact support.");
              }
            }
          } else {
            // Retry if record not found yet
            if (pollCount < MAX_POLLS) {
              setPollCount((prev) => prev + 1);
              timeoutId = setTimeout(fetchStatus, POLLS_FREQUENCY_IN_MS);
            }
          }
        }
      } catch (err) {
        // Retry on network error
        if (pollCount < MAX_POLLS && isMounted) {
          timeoutId = setTimeout(fetchStatus, POLLS_FREQUENCY_IN_MS);
        } else if (isMounted) {
          setLoadingStatus(false);
          setError(err.message);
        }
      }
    };

    fetchStatus();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [orderId, transactionId, pollCount, onOrderSuccess, onCartClear]);

  // Loading UI
  if (loadingStatus) {
    return (
      <div
        className="loader-container"
        style={{ textAlign: "center", padding: "40px" }}
      >
        <div className="loader"></div>
        <p>
          Verifying Payment... ({pollCount}/{MAX_POLLS})
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-msg" style={{ color: "red", padding: "20px" }}>
        {error}
      </div>
    );
  }

  // Render Status
  const status = statusData?.status || "UNKNOWN";
  const isSuccess = status === "COMPLETED" || status === "SUCCESS";
  const amount = statusData?.amount;
  const txId = statusData?.merchantOrderId;

  return (
    <div style={{ padding: 20 }}>
      <div
        className="glass-strong"
        style={{
          padding: 30,
          textAlign: "center",
          borderRadius: 12,
          marginTop: 60,
        }}
      >
        <h2 style={{ color: isSuccess ? "#4ade80" : "#f87171", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          {isSuccess ? (
            <>
              Payment Successful! 
              <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ duration: 0.5 }}>
                <CheckCircle size={28} />
              </motion.div>
            </>
          ) : (
            `Payment Status: ${status}`
          )}
        </h2>

        <div style={{ textAlign: "left", marginTop: 20 }}>
          <p>
            <strong>Order ID:</strong> {txId}
          </p>
          <p>
            <strong>Amount:</strong> ₹{amount}
          </p>
          <p>
            <strong>Status:</strong> {status}
          </p>
        </div>

        {!isSuccess && (
          <div
            style={{
              marginTop: 20,
              background: "rgba(255,0,0,0.1)",
              padding: 10,
              borderRadius: 8,
            }}
          >
            <p style={{ color: "red", fontSize: "14px" }}>
              Transaction taking longer than expected? <br />
              Please wait or contact support if money was deducted. You would be
              receiving the mail on this shortly
            </p>
          </div>
        )}

        <button
          className="btn btn-primary"
          style={{ marginTop: 20, width: "100%" }}
          onClick={() => (window.location.href = "/")}
        >
          {isSuccess ? "Continue Shopping" : "Back to Home"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
