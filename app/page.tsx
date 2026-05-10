"use client";

import React from "react";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Products from "@/components/Products";
import Merchandise from "@/components/Merchandise";
import Benefits from "@/components/Benefits";
import Testimonials from "@/components/Testimonials";
import Recipes from "@/components/Recipes";
import Contact from "@/components/Contact";
import { useCart } from "@/hooks/useCart";
import { BUNDLE_PRODUCT } from "@/utils/constants";
import CartModal from "@/components/CartModal";
import ConfirmationModal from "@/components/ConfirmationModal";
const wildImg = "/assets/wild.jpg";
const glitchImg = "/assets/glitch.jpg";
const greenImg = "/assets/green.png";

export default function Home() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    confirmationModal,
    setConfirmationModal,
    addToCart,
    showConfirmationModal,
    confirmAddToCart,
    updateConfirmationQuantity,
    removeFromCart,
    updateQty,
    clearCart,
  } = useCart();

  const logo = "/assets/logo.png";

  return (
    <>
      <main>
        <Hero logo={logo} />
        <Features />
        <Products
          addToCart={addToCart}
          openCart={() => setIsCartOpen(true)}
          showConfirmationModal={showConfirmationModal}
          addBundleToCart={BUNDLE_PRODUCT}
        />
        <Merchandise 
          addToCart={addToCart} 
          openCart={() => setIsCartOpen(true)} 
        />
        <Benefits />
        <Testimonials />
        <Recipes />
        <Contact />
      </main>

      {/* Cart Modal */}
      <CartModal
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={updateQty}
        onRemove={removeFromCart}
        onClearCart={clearCart}
        onCheckout={() => setIsCartOpen(false)}
      />

      {/* Confirmation Modal */}
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
    </>
  );
}
