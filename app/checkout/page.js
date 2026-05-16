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
    try {
      console.log("Submit triggered", !!e);
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      
      const errs = validateCheckoutForm();
      setFormErrors(errs);
      
      const errorCount = Object.keys(errs).length;
      if (errorCount > 0) {
        const firstError = Object.keys(errs)[0];
        const element = document.querySelector(`[name="${firstError}"]`) || document.querySelector(`input[placeholder*="${firstError}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
        return;
      }

      setSubmitting(true);
      
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
      console.error("Critical Submit Error:", err);
      alert("An unexpected error occurred during submission: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "20px", marginTop: "80px" }}>
      <CheckoutPageComponent
        key={JSON.stringify(formErrors)}
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
