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

  const [isLoaded, setIsLoaded] = useState(false);
  const isSyncing = React.useRef(false);
  const { currentUser } = useAuth();

  // Load and merge cart on login / session restore; clear on logout
  useEffect(() => {
    if (!currentUser) {
      setIsLoaded(false);
      setCart([]);
      return;
    }

    let cancelled = false;
    isSyncing.current = true;

    const loadAndMergeCart = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/cart/sync`, {
          method: "GET",
          credentials: 'include'
        });

        if (cancelled) return;

        if (res.ok) {
          const data = await res.json();
          const dbItems = data.items || [];
          
          // Map database items to frontend format
          const mappedDbItems = dbItems.map((bItem: any) => ({
            id: bItem.productId,
            name: bItem.name,
            size: bItem.size || null,
            qty: bItem.quantity,
            price: `₹${bItem.price}`,
            image: bItem.image || "",
            cartItemId: bItem.size ? `${bItem.productId}-${bItem.size}` : bItem.productId
          }));

          setCart((prevCart) => {
            // If there are guest cart items from before login, merge them
            if (prevCart.length > 0) {
              const merged = [...mappedDbItems];
              prevCart.forEach((localItem: any) => {
                const existing = merged.find(
                  (item) => item.id === localItem.id && item.size === localItem.size
                );
                if (existing) {
                  existing.qty += localItem.qty;
                } else {
                  merged.push(localItem);
                }
              });

              // POST the merged cart to backend
              const payload = merged.map(item => ({
                productId: String(item.id),
                name: item.name,
                size: item.size || "",
                quantity: item.qty,
                price: typeof item.price === "string" 
                  ? parseFloat(item.price.replace(/[^\d.]/g, "")) 
                  : Number(item.price),
                image: item.image || "",
              }));

              fetch(`${API_BASE}/api/cart/sync`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: payload }),
                credentials: 'include'
              }).catch(err => console.error("Merge POST failed:", err));

              return merged;
            }
            // No local guest items, just load from database
            return mappedDbItems;
          });
        }
      } catch (err) {
        console.error("Cart load failed:", err);
      } finally {
        if (!cancelled) {
          isSyncing.current = false;
          setIsLoaded(true);
        }
      }
    };

    loadAndMergeCart();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // Sync cart modifications to backend (only after initial load is done)
  useEffect(() => {
    if (!currentUser || !isLoaded || isSyncing.current) return;

    const saveCartToBackend = async () => {
      try {
        const payload = cart.map(item => ({
          productId: String(item.id),
          name: item.name,
          size: item.size || "",
          quantity: item.qty,
          price: typeof item.price === "string" 
            ? parseFloat(item.price.replace(/[^\d.]/g, "")) 
            : Number(item.price),
          image: item.image || "",
        }));

        await fetch(`${API_BASE}/api/cart/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: payload }),
          credentials: 'include'
        });
      } catch (err) {
        console.error("Failed to save cart to backend:", err);
      }
    };

    saveCartToBackend();
  }, [cart, currentUser, isLoaded]);

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
    if (qty < 1) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        (item.cartItemId === cartItemId || item.id === cartItemId) ? { ...item, qty } : item,
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
    clearCart,
  };
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const cartState = useCartInternal();
  return (
    <CartContext.Provider value={cartState}>{children}</CartContext.Provider>
  );
};
