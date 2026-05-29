"use client";

export default function NotFound() {
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
            fontSize: "3rem",
            fontWeight: "900",
            marginBottom: "15px",
            color: "#ff3b30",
          }}
        >
          404
        </h1>
        <p
          style={{
            fontSize: "1.5rem",
            fontWeight: "800",
            marginBottom: "10px",
          }}
        >
          Page Not Found
        </p>
        <p style={{ color: "#888", marginBottom: "30px", lineHeight: 1.6 }}>
          The page you're looking for doesn't exist. If you were redirected here
          after a payment, please check your email or contact support.
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
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
            Back to Home
          </button>
          <button
            onClick={() => (window.location.href = "/my-orders")}
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
            Check Orders
          </button>
        </div>
        <p style={{ fontSize: "12px", color: "#555", marginTop: "40px" }}>
          Support:{" "}
          <a
            href="mailto:tearshxd@gmail.com"
            style={{ color: "#ff3b30", textDecoration: "none" }}
          >
            tearshxd@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
