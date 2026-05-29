"use client";

import { Suspense } from "react";
import CheckoutSuccess from "@/components/CheckoutSuccess";
import { useCart } from "@/hooks/useCart";

function CheckoutResultContent() {
  const { clearCart } = useCart();

  return (
    <div style={{ minHeight: "100vh" }}>
      <CheckoutSuccess onOrderSuccess={() => {}} onCartClear={clearCart} />
    </div>
  );
}

export default function CheckoutResultPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#050505",
            color: "#fff",
          }}
        >
          <p>Loading...</p>
        </div>
      }
    >
      <CheckoutResultContent />
    </Suspense>
  );
}
