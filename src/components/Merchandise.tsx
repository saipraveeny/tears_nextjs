"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ShoppingCart, Eye, ChevronLeft, ChevronRight, X } from "lucide-react";
import "./Merchandise.css";

// Import merchandise images
// Merchandise asset paths
const whiteBackImage = "/assets/merchandise/white back.png";
const whiteFrontImage = "/assets/merchandise/white front.png";
const blackBackImage = "/assets/merchandise/black back.png";
const blackFrontImage = "/assets/merchandise/black front.png";
const blackCapImage = "/assets/merchandise/black cap.png";

interface MerchandiseProps {
  addToCart: (product: any) => void;
  openCart?: () => void;
}

const Merchandise: React.FC<MerchandiseProps> = ({ addToCart, openCart }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [imageIndex, setImageIndex] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [zoomedProduct, setZoomedProduct] = useState(null);

  const merchandise = [
    {
      id: 101,
      name: "White T-Shirt",
      description: "Premium quality Tears branded t-shirt in classic white",
      price: "₹999.00",
      color: "#f5f5f5",
      sizes: [
        { size: "S", inStock: false },
        { size: "M", inStock: false },
        { size: "L", inStock: true },
        { size: "XL", inStock: true },
      ],
      material: "100% Cotton",
      images: [whiteFrontImage, whiteBackImage],
      available: true,
      category: "apparel",
    },
    {
      id: 102,
      name: "Black T-Shirt",
      description: "Bold statement piece with Tears branding in sleek black",
      price: "₹999.00",
      color: "#1a1a1a",
      sizes: [
        { size: "S", inStock: false },
        { size: "M", inStock: false },
        { size: "L", inStock: true },
        { size: "XL", inStock: true },
      ],
      material: "100% Cotton",
      images: [blackFrontImage, blackBackImage],
      available: true,
      category: "apparel",
    },
    {
      id: 103,
      name: "Black Cap",
      description: "Stylish black cap to showcase your Tears passion anywhere",
      price: "₹300.00",
      color: "#1a1a1a",
      sizes: [{ size: "One Size", inStock: true }],
      material: "Cotton Twill",
      images: [blackCapImage],
      available: true,
      category: "accessories",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const nextImage = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    const product = merchandise.find((p) => p.id === productId);
    if (!product || product.images.length <= 1) return;

    const current = imageIndex[productId] || 0;
    setImageIndex({
      ...imageIndex,
      [productId]: (current + 1) % product.images.length,
    });
  };

  const prevImage = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    const product = merchandise.find((p) => p.id === productId);
    if (!product || product.images.length <= 1) return;

    const current = imageIndex[productId] || 0;
    setImageIndex({
      ...imageIndex,
      [productId]: current === 0 ? product.images.length - 1 : current - 1,
    });
  };

  return (
    <section id="merchandise" className="merchandise">
      <div className="container">
        {/* Header */}
        <motion.div
          className="merchandise-header"
          initial={{ opacity: 0, y: -30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Tears Merchandise</h2>
          <p className="section-subtitle">
            Wear your passion. Show your support with our premium branded
            merchandise.
          </p>
        </motion.div>

        {/* Merchandise Grid */}
        <motion.div
          className="premium-merchandise-track"
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {merchandise.map((product) => (
            <motion.div
              key={product.id}
              className="premium-merchandise-card"
              variants={itemVariants}
              style={{ '--merch-color': product.color } as React.CSSProperties}
            >
              <div className="premium-merchandise-glass">
                <div className="merchandise-image-container">
                  <div className="premium-merchandise-glow" style={{ background: product.color }} />
                  <motion.img
                    key={imageIndex[product.id] || 0}
                    src={product.images[imageIndex[product.id] || 0]}
                    alt={`${product.name}`}
                    className="merchandise-product-image"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Image Navigation */}
                  {product.images.length > 1 && (
                    <div className="image-navigation">
                      <motion.button
                        className="nav-btn prev-btn"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.85 }}
                        onClick={(e) => prevImage(e, product.id)}
                        type="button"
                      >
                        <ChevronLeft size={18} />
                      </motion.button>
                      <motion.button
                        className="nav-btn next-btn"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.85 }}
                        onClick={(e) => nextImage(e, product.id)}
                        type="button"
                      >
                        <ChevronRight size={18} />
                      </motion.button>
                    </div>
                  )}

                  {/* Image Dots */}
                  {product.images.length > 1 && (
                    <div className="image-dots">
                      {product.images.map((_, idx) => (
                        <motion.div
                          key={idx}
                          className={`dot ${
                            idx === (imageIndex[product.id] || 0) ? "active" : ""
                          }`}
                          whileHover={{ scale: 1.2 }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Overlay Eye Button */}
                  <div 
                    className="premium-product-view-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomedProduct(product as any);
                    }}
                  >
                    <Eye size={24} />
                  </div>
                </div>

                {/* Product Info */}
                <div className="merchandise-content">
                  <div className="merchandise-header-info">
                    <h3 className="merchandise-name">{product.name}</h3>
                    <span className="merchandise-category">{product.category}</span>
                  </div>

                  <p className="merchandise-description">{product.description}</p>
                  <div className="material-tag">{product.material}</div>

                  <div className="merchandise-footer-main">
                    <div className="merchandise-variants">
                      <span className="variant-label">Select Variant/Size:</span>
                      <div className="variant-grid">
                        {product.sizes.map((sizeObj) => {
                          const isOutOfStock = !sizeObj.inStock;
                          const defaultActSize = product.sizes.find((s) => s.inStock)?.size || product.sizes[0].size;
                          const isSelected = (selectedSizes[product.id as keyof typeof selectedSizes] || defaultActSize) === sizeObj.size;

                          return (
                            <motion.button
                              key={sizeObj.size}
                              whileHover={isOutOfStock ? {} : { scale: 1.05 }}
                              whileTap={isOutOfStock ? {} : { scale: 0.95 }}
                              title={isOutOfStock ? "Out of Stock" : "Select Size"}
                              className={`size-btn ${isSelected ? "active" : ""} ${isOutOfStock ? "out-of-stock" : ""}`}
                              style={
                                isOutOfStock
                                  ? {
                                      opacity: 0.4,
                                      cursor: "not-allowed",
                                      background: "rgba(255,255,255,0.02)",
                                    }
                                  : {}
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isOutOfStock) return;
                                setSelectedSizes({
                                  ...selectedSizes,
                                  [product.id]: sizeObj.size,
                                });
                              }}
                            >
                              {sizeObj.size}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="merchandise-footer-bottom">
                      <span className="merchandise-price">{product.price}</span>
                      
                      {product.available ? (
                        <button
                          className="premium-add-to-cart-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            const defaultSize = product.sizes.find(s => s.inStock)?.size || product.sizes[0].size;
                            const size = selectedSizes[product.id as keyof typeof selectedSizes] || defaultSize;
                            addToCart({ ...product, size });
                            if (openCart) openCart();
                          }}
                        >
                          <ShoppingCart size={20} />
                          <span>Add to Cart</span>
                        </button>
                      ) : (
                        <div className="premium-coming-soon">
                          Coming Soon
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Info Banner */}
        <motion.div
          className="merchandise-info-banner"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="banner-content">
            <h3>Exclusive Merchandise Collection</h3>
            <p>
              Stand out with our premium Tears branded merchandise. Each item is
              crafted with attention to detail and quality materials. Perfect
              for fans and gift giving.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {zoomedProduct && (
          <motion.div
            className="zoom-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedProduct(null)}
          >
            <motion.div
              className="zoom-modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-modal-btn"
                onClick={() => setZoomedProduct(null)}
              >
                <X size={24} />
              </button>
              <img
                src={zoomedProduct.images[imageIndex[zoomedProduct.id] || 0]}
                alt={zoomedProduct.name}
                className="zoomed-product-image"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Merchandise;
