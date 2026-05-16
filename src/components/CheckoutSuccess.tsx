"use client";

import React, { useState, useEffect } from "react";
import { API_BASE, MAX_POLLS, POLLS_FREQUENCY_IN_MS } from "../utils/constants";
import { CheckCircle, XCircle, Package, MapPin, CreditCard, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

            if (["COMPLETED", "FAILED", "SUCCESS", "PAYMENT_SUCCESS"].includes(st)) {
              setLoadingStatus(false);
              if (st === "COMPLETED" || st === "SUCCESS" || st === "PAYMENT_SUCCESS") {
                onOrderSuccess?.({
                  id: payment.merchantOrderId,
                  total: payment.amount,
                });
                onCartClear?.();
                sessionStorage.removeItem("pendingOrderId");
              }
            } else {
              if (pollCount < MAX_POLLS) {
                setPollCount((prev) => prev + 1);
                timeoutId = setTimeout(fetchStatus, POLLS_FREQUENCY_IN_MS);
              } else {
                setLoadingStatus(false);
                setError("Verification timed out. Please contact support.");
              }
            }
          } else {
            if (pollCount < MAX_POLLS) {
              setPollCount((prev) => prev + 1);
              timeoutId = setTimeout(fetchStatus, POLLS_FREQUENCY_IN_MS);
            }
          }
        }
      } catch (err) {
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

  if (loadingStatus) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#050505", color: "#fff" }}>
        <div style={{ textAlign: "center" }}>
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            style={{ width: "60px", height: "60px", border: "4px solid rgba(255,59,48,0.1)", borderTopColor: "#ff3b30", borderRadius: "50%", margin: "0 auto 20px" }}
          />
          <h2 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "10px" }}>Verifying Payment</h2>
          <p style={{ color: "#888" }}>Please don't refresh or close the window...</p>
          <p style={{ fontSize: "12px", color: "#444", marginTop: "20px" }}>Verification Attempt: {pollCount}/{MAX_POLLS}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#050505", color: "#fff", padding: "40px 20px" }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: "500px", width: "100%", textAlign: "center", padding: "40px", borderRadius: "32px", border: "1px solid rgba(255,59,48,0.2)" }}
          className="glass-strong"
        >
          <XCircle size={64} color="#ff3b30" style={{ marginBottom: "20px" }} />
          <h2 style={{ fontSize: "2rem", fontWeight: "900", marginBottom: "15px" }}>Something Went Wrong</h2>
          <p style={{ color: "#888", marginBottom: "30px", lineHeight: 1.6 }}>{error}</p>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.href = "/"}
            style={{ width: "100%", padding: "16px", borderRadius: "12px", fontWeight: "800" }}
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  const status = statusData?.status || "UNKNOWN";
  const isSuccess = status === "COMPLETED" || status === "SUCCESS" || status === "PAYMENT_SUCCESS";
  const amount = statusData?.amount;
  const txId = statusData?.merchantOrderId || transactionId || orderId || "N/A";
  const customer = statusData?.customer || {};

  return (
    <div style={{ minHeight: "80vh", background: "#050505", color: "#fff", padding: "60px 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: "600px", width: "100%" }}
      >
        <div className="glass-strong" style={{ padding: "40px", borderRadius: "32px", textAlign: "center", border: `1px solid ${isSuccess ? 'rgba(76,217,100,0.2)' : 'rgba(255,59,48,0.2)'}`, position: "relative", overflow: "hidden" }}>
          {/* Status Icon */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            style={{ width: "100px", height: "100px", background: isSuccess ? "rgba(76,217,100,0.1)" : "rgba(255,59,48,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 30px", color: isSuccess ? "#4cd964" : "#ff3b30" }}
          >
            {isSuccess ? <CheckCircle size={54} /> : <XCircle size={54} />}
          </motion.div>

          <h1 style={{ fontSize: "2.5rem", fontWeight: "900", marginBottom: "10px", letterSpacing: "-1px" }}>
            {isSuccess ? "Order Confirmed!" : "Payment Failed"}
          </h1>
          <p style={{ color: "#888", marginBottom: "40px", fontSize: "1.1rem" }}>
            {isSuccess ? "Your tears are officially on the way. Get ready for the heat!" : "Something went wrong with your payment. Please try again or contact support."}
          </p>

          {/* Order Info Card */}
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "24px", padding: "30px", textAlign: "left", marginBottom: "30px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div>
                <p style={{ color: "#888", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Order ID</p>
                <p style={{ fontWeight: "700", fontSize: "1.1rem" }}>#{txId}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ color: "#888", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Amount</p>
                <p style={{ fontWeight: "900", fontSize: "1.2rem", color: isSuccess ? "#4cd964" : "#fff" }}>{amount ? `₹${amount}` : "Calculating..."}</p>
              </div>
            </div>

            <div style={{ display: "grid", gap: "20px" }}>
              <div style={{ display: "flex", gap: "15px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }}>
                  <Package size={20} />
                </div>
                <div>
                  <p style={{ color: "#888", fontSize: "0.8rem", marginBottom: "2px" }}>Status</p>
                  <p style={{ fontWeight: "600", color: isSuccess ? "#4cd964" : "#ff3b30" }}>{status.replace('_', ' ')}</p>
                </div>
              </div>

              {isSuccess && (
                <>
                  <div style={{ display: "flex", gap: "15px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }}>
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p style={{ color: "#888", fontSize: "0.8rem", marginBottom: "2px" }}>Delivery To</p>
                      <p style={{ fontWeight: "600", fontSize: "0.9rem" }}>{customer.name || "Customer"}</p>
                      <p style={{ color: "#666", fontSize: "0.8rem", lineHeight: 1.4 }}>{customer.address || "Address details will be sent via email"}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "grid", gap: "15px" }}>
            {isSuccess ? (
              <button 
                className="btn btn-primary" 
                onClick={() => window.location.href = "/"}
                style={{ width: "100%", padding: "18px", borderRadius: "16px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
              >
                Continue Shopping <ChevronRight size={20} />
              </button>
            ) : (
              <>
                <button 
                  className="btn btn-primary" 
                  onClick={() => window.location.href = "/checkout"}
                  style={{ width: "100%", padding: "18px", borderRadius: "16px", fontWeight: "800" }}
                >
                  Try Again
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => window.location.href = "/"}
                  style={{ width: "100%", padding: "18px", borderRadius: "16px", fontWeight: "800" }}
                >
                  Back to Home
                </button>
              </>
            )}
          </div>

          {isSuccess && (
            <p style={{ marginTop: "30px", color: "#444", fontSize: "0.8rem" }}>
              A confirmation email has been sent to {customer.email || "your email address"}.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutSuccess;
