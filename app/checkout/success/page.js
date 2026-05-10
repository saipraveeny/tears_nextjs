"use client";

import CheckoutSuccess from "@/components/CheckoutSuccess";
import { useCart } from "@/hooks/useCart";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  return <CheckoutSuccess onOrderSuccess={() => {}} onCartClear={clearCart} />;
}
