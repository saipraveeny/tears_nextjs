import React, { useState, useEffect, createContext, useContext } from "react";
import { useAuth } from "../contexts/AuthContext";
import { API_BASE } from "../utils/constants";

const CartContext = createContext<any>(null);

/**
 * Custom hook for cart management
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (context) return context;
  
  // Fallback for isolated use
  return useCartInternal();
};

const useCartInternal = () => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    product: null,
    quantity: 1,
  });

  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;
    
    // Sync cart with backend once logged in
    const syncWithBackend = async () => {
      try {
        const payload = cart.map(item => ({
          productId: String(item.id),
          name: item.name,
          size: item.size || "",
          quantity: item.qty,
          price: parseFloat(item.price.replace(/[^\d.]/g, "")),
          image: item.image || "",
        }));

        const res = await fetch(`${API_BASE}/api/cart/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: payload }),
          credentials: 'include'
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.items && data.items.length > 0) {
             // Map backend cart structure back to frontend state
             // The backend uses Schema: productId, name, size, quantity, price, image
             const merged = data.items.map(bItem => ({
               id: bItem.productId,
               name: bItem.name,
               size: bItem.size || null,
               qty: bItem.quantity,
               price: `₹${bItem.price}`,
               image: bItem.image || "",
               cartItemId: bItem.size ? `${bItem.productId}-${bItem.size}` : bItem.productId
             }));
             setCart(merged);
          }
        }
      } catch (err) {
        console.error("Cart sync failed:", err);
      }
    };

    syncWithBackend();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const addToCart = (product) => {
    const cartItemId = product.size ? `${product.id}-${product.size}` : product.id;
    setCart((prev) => {
      const found = prev.find((item) => item.cartItemId === cartItemId);
      if (found) {
        return prev.map((item) =>
          item.cartItemId === cartItemId ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...prev, { ...product, cartItemId, qty: 1 }];
    });
  };

  const showConfirmationModal = (product) => {
    setConfirmationModal({ isOpen: true, product, quantity: 1 });
  };

  const confirmAddToCart = () => {
    const { product, quantity } = confirmationModal;
    if (!product) return;

    const cartItemId = product.size ? `${product.id}-${product.size}` : product.id;
    setCart((prev) => {
      const found = prev.find((item) => item.cartItemId === cartItemId);
      if (found) {
        return prev.map((item) =>
          item.cartItemId === cartItemId ? { ...item, qty: item.qty + quantity } : item,
        );
      }
      return [...prev, { ...product, cartItemId, qty: quantity }];
    });
    setConfirmationModal({ isOpen: false, product: null, quantity: 1 });
  };

  const updateConfirmationQuantity = (newQuantity) => {
    setConfirmationModal((prev) => ({
      ...prev,
      quantity: Math.max(1, newQuantity),
    }));
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId && item.id !== cartItemId));
  };

  const updateQty = (cartItemId, qty) => {
    setCart((prev) =>
      prev.map((item) =>
        (item.cartItemId === cartItemId || item.id === cartItemId) ? { ...item, qty: Math.max(1, qty) } : item,
      ),
    );
  };

  const clearCart = () => setCart([]);

  return {
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
  };
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const cartState = useCartInternal();
  return (
    <CartContext.Provider value={cartState}>{children}</CartContext.Provider>
  );
};
