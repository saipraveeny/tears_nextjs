"use client";

import React, { useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";
import CartModal from "./CartModal";
import ConfirmationModal from "./ConfirmationModal";
import ProfileCompletionModal from "./ProfileCompletionModal";

const wildImg = "/assets/wild.jpg";
const glitchImg = "/assets/glitch.jpg";
const greenImg = "/assets/green.png";

export default function GlobalModals() {
  const { currentUser, openAuthModal, authModalOpen } = useAuth();
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

  // Forced Login Prompt Logic
  useEffect(() => {
    if (currentUser) return;

    const timer = setInterval(() => {
      // Only open if not already open and user is still guest
      if (!currentUser && !authModalOpen) {
        openAuthModal();
      }
    }, 45000); // Increased to 45 seconds interval for better UX

    return () => clearInterval(timer);
  }, [currentUser, authModalOpen, openAuthModal]);

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
