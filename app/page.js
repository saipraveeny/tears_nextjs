"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Products from "@/components/Products";
import Benefits from "@/components/Benefits";
import Testimonials from "@/components/Testimonials";
import Recipes from "@/components/Recipes";
import Contact from "@/components/Contact";
import CartModal from "@/components/CartModal";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useCart } from "@/hooks/useCart";
import { BUNDLE_PRODUCT } from "@/utils/constants";

const logo = "/logo.png";
const wildImg = "/assets/wild.jpg";
const glitchImg = "/assets/glitch.jpg";
const greenImg = "/assets/green.png";

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const cartItemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  if (loading) {
    return <div>Loading...</div>; // You can use the Loader component
  }

  return (
    <div>
      <CartModal
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={updateQty}
        onRemove={removeFromCart}
        onClearCart={clearCart}
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

      <main>
        <Hero logo={logo} />
        <Features />
        <Products
          addToCart={addToCart}
          openCart={() => setIsCartOpen(true)}
          showConfirmationModal={showConfirmationModal}
          addBundleToCart={BUNDLE_PRODUCT}
        />
        <Benefits />
        <Testimonials />
        <Recipes />
        <Contact />
      </main>

      <AnimatePresence>
        {scrollY > 500 && (
          <motion.button
            className="scroll-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
