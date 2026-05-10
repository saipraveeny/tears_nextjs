"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { computeCartTotals, formatCurrency } from "../utils/cartUtils";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

const CartModal = ({
  isOpen,
  cart,
  onClose,
  onUpdateQty,
  onRemove,
  onClearCart,
  onCheckout,
}) => {
  const { total, discountAmount } = computeCartTotals(cart);
  const { requireAuth } = useAuth();
  const router = useRouter();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="cart-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="cart-content glass-strong"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={onClose}>
              ×
            </button>
            <h2 className="cart-title">Your Cart</h2>
            {cart.length === 0 ? (
              <div className="cart-empty">Your cart is empty.</div>
            ) : (
              <div className="cart-items">
                {cart.map((item) => (
                  <div className="cart-item" key={item.cartItemId || item.id}>
                    <div className="cart-item-info">
                      <span className="cart-item-name">{item.name}{item.size && ` (${item.size})`}</span>
                      <span className="cart-item-price">{item.price}</span>
                    </div>
                    <div className="cart-item-controls">
                      <button
                        onClick={() => onUpdateQty(item.cartItemId || item.id, item.qty - 1)}
                      >
                        -
                      </button>
                      <span>{item.qty}</span>
                      <button
                        onClick={() => onUpdateQty(item.cartItemId || item.id, item.qty + 1)}
                      >
                        +
                      </button>
                      <button
                        className="cart-remove"
                        onClick={() => onRemove(item.cartItemId || item.id)}
                        title="Remove Item"
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "6px" }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total">
                  <div>Total: {formatCurrency(total)}</div>
                  {discountAmount > 0 && (
                    <div className="discount-applied">
                      <span className="discount-text">Discount Applied: </span>
                      <span className="discount-amount">
                        ₹{discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: "80%", marginTop: "1rem" }}
                  onClick={() => {
                    requireAuth(() => {
                      onClose();
                      onCheckout?.();
                      router.push("/checkout");
                    });
                  }}
                >
                  Checkout
                </button>
                <button
                  className="btn btn-secondary"
                  style={{ width: "80%", marginTop: "0.5rem" }}
                  onClick={onClearCart}
                >
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartModal;
