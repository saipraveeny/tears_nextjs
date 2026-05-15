"use client";

import React from "react";
import { useCart } from "@/hooks/useCart";
import CartModal from "./CartModal";
import ConfirmationModal from "./ConfirmationModal";
import ProfileCompletionModal from "./ProfileCompletionModal";

const wildImg = "/assets/wild.jpg";
const glitchImg = "/assets/glitch.jpg";
const greenImg = "/assets/green.png";

export default function GlobalModals() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    confirmationModal,
    setConfirmationModal,
    confirmAddToCart,
    updateConfirmationQuantity,
    removeFromCart,
    updateQty,
    clearCart,
  } = useCart();

  return (
    <>
      <CartModal
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={updateQty}
        onRemove={removeFromCart}
        onClearCart={clearCart}
        onCheckout={() => setIsCartOpen(false)}
      />

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        product={confirmationModal.product}
        quantity={confirmationModal.quantity}
        onClose={() =>
          setConfirmationModal({ isOpen: false, product: null, quantity: 1 })
        }
        onConfirm={confirmAddToCart}
        onQuantityChange={updateConfirmationQuantity}
        wildImg={wildImg}
        glitchImg={glitchImg}
        greenImg={greenImg}
      />

      <ProfileCompletionModal />
    </>
  );
}
