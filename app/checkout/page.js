"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CheckoutPageComponent from "@/components/CheckoutPage";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/useCart";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";
import { API_BASE } from "@/utils/constants";
import { computeCartTotals } from "@/utils/cartUtils";

export default function CheckoutPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const { cart, clearCart } = useCart();
  const { currentUser } = useAuth();

  const {
    checkoutForm,
    formErrors,
    setCheckoutForm,
    setFormErrors,
    handleCheckoutChange,
    handleInputKeyDown,
    validateCheckoutForm,
  } = useCheckoutForm();

  // Auto-fill form when user logs in
  useEffect(() => {
    if (currentUser) {
      setCheckoutForm(prev => ({
        ...prev,
        name: prev.name || currentUser.name || "",
        email: prev.email || currentUser.email || "",
        phone: prev.phone || currentUser.phone || ""
      }));
    }
  }, [currentUser, setCheckoutForm]);

  const submitCheckout = async (e) => {
    e?.preventDefault();
    const errs = validateCheckoutForm();
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);

    try {
      const { total } = computeCartTotals(cart);

      const productsPayload = cart.map((it) => ({
        productId: String(it.id),
        name: it.name,
        quantity: Number(it.qty),
        amount: parseFloat(it.price.replace(/[^\d.]/g, "")),
        image: it.image || "",
      }));

      const payload = {
        amount: Number(total.toFixed(2)),
        customer: {
          name: checkoutForm.name,
          phone: checkoutForm.phone,
          email: checkoutForm.email,
          address: checkoutForm.address,
        },
        products: productsPayload,
        callbackUrl: `${window.location.origin}/checkout/result`,
      };

      const resp = await fetch(`${API_BASE}/api/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) throw new Error(await resp.text());
      const data = await resp.json();

      if (data.redirectUrl && data.merchantOrderId) {
        sessionStorage.setItem("pendingOrderId", data.merchantOrderId);
        window.location.href = data.redirectUrl;
      } else {
        throw new Error("Invalid response from payment gateway");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Payment initiation failed: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "20px", marginTop: "80px" }}>
      <CheckoutPageComponent
        currentUser={currentUser}
        cart={cart}
        checkoutForm={checkoutForm}
        formErrors={formErrors}
        submitting={submitting}
        orderSuccess={orderSuccess}
        onFormChange={handleCheckoutChange}
        onInputKeyDown={handleInputKeyDown}
        onSubmit={submitCheckout}
      />
    </div>
  );
}
