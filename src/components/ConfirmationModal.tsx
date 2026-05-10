"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { formatCurrency, getProductImage } from "../utils/cartUtils";
const wildVideo = "/assets/wild.mp4";
const glitchVideo = "/assets/glitch.mp4";
const backgroundVideo = "/assets/Background.mp4";

const ConfirmationModal = ({
  isOpen,
  product,
  quantity,
  onClose,
  onConfirm,
  onQuantityChange,
  wildImg,
  glitchImg,
  greenImg,
}) => {
  if (!product) return null;

  const productImg = getProductImage(
    product.name,
    wildImg,
    glitchImg,
    greenImg,
  );

  const totalPrice =
    parseFloat(product.price.replace(/[^\d.]/g, "")) * quantity;

  return (
    <motion.div
      className="confirmation-modal"
      style={{ display: isOpen ? "flex" : "none" }}
      initial={false}
      animate={isOpen ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className="confirmation-content glass-strong"
        initial={false}
        animate={
          isOpen ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }
        }
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2 className="confirmation-title">Add to Cart</h2>

        {/* Product image */}
        <div className="confirmation-image-wrapper">
          {product.name.includes("Wild") ? (
            <video
              src={wildVideo}
              autoPlay
              muted
              loop
              playsInline
              className="confirmation-product-image"
            />
          ) : product.name.includes("Glitch") ? (
            <video
              src={glitchVideo}
              autoPlay
              muted
              loop
              playsInline
              className="confirmation-product-image"
            />
          ) : product.name.includes("Green") ? (
            <video
              src={backgroundVideo}
              autoPlay
              muted
              loop
              playsInline
              className="confirmation-product-image"
            />
          ) : productImg ? (
            <img
              src={productImg}
              alt={product.name}
              className="confirmation-product-image"
            />
          ) : null}
        </div>

        <div className="confirmation-product">
          <div className="confirmation-product-info">
            <h3 className="confirmation-product-name">{product.name}{product.size && ` (${product.size})`}</h3>
            <p className="confirmation-product-description">
              {product.description}
            </p>
            <div className="confirmation-product-price">{product.price}</div>
          </div>

          <div className="confirmation-quantity">
            <label className="quantity-label">Quantity:</label>
            <div className="quantity-controls">
              <motion.button
                className="quantity-btn"
                onClick={() => onQuantityChange(quantity - 1)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Minus size={16} />
              </motion.button>
              <span className="quantity-display">{quantity}</span>
              <motion.button
                className="quantity-btn"
                onClick={() => onQuantityChange(quantity + 1)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Plus size={16} />
              </motion.button>
            </div>
          </div>

          <div className="confirmation-total">
            <span>Total: </span>
            <span className="total-price">{formatCurrency(totalPrice)}</span>
          </div>
        </div>

        <div className="confirmation-actions">
          <motion.button
            className="btn btn-primary"
            onClick={onConfirm}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart size={16} />
            Add to Cart
          </motion.button>
          <motion.button
            className="btn btn-secondary"
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmationModal;
