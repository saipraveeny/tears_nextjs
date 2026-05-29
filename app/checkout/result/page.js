"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CheckoutSuccess from "@/components/CheckoutSuccess";
import { useCart } from "@/hooks/useCart";

export default function CheckoutResultPage() {
  const { clearCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Log the redirect details for debugging
    const params = {
      transactionId: searchParams.get("transactionId"),
      orderId: searchParams.get("orderId"),
      txnId: searchParams.get("txnId"),
      merchantOrderId: searchParams.get("merchantOrderId"),
      status: searchParams.get("status"),
      all: Object.fromEntries(searchParams),
    };
    console.log("Checkout Result Page - PhonePe Redirect Params:", params);
  }, [searchParams]);

  return (
    <div style={{ minHeight: "100vh" }}>
      <CheckoutSuccess onOrderSuccess={() => {}} onCartClear={clearCart} />
    </div>
  );
}
