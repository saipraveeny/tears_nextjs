"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "#fff",
        padding: "60px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
          padding: "40px",
          borderRadius: "32px",
          border: "1px solid rgba(255,59,48,0.2)",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "900",
            marginBottom: "15px",
            color: "#ff3b30",
          }}
        >
          ⚠️ Something Went Wrong
        </h1>
        <p style={{ color: "#888", marginBottom: "20px", lineHeight: 1.6 }}>
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        {error.digest && (
          <p
            style={{
              fontSize: "12px",
              color: "#555",
              marginBottom: "30px",
              wordBreak: "break-all",
            }}
          >
            Error ID: {error.digest}
          </p>
        )}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            onClick={() => reset()}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "1px solid #ff3b30",
              background: "transparent",
              color: "#ff3b30",
              cursor: "pointer",
              fontWeight: "800",
            }}
          >
            Try Again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              background: "#ff3b30",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontWeight: "800",
            }}
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
