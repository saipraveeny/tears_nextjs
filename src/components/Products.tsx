"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Flame, Star, ShoppingCart, Eye, X } from "lucide-react";
import { ALL_PRODUCTS } from "@/utils/productData";
import { useCart } from "@/hooks/useCart";


interface ProductsProps {
  addToCart: (product: any, qty: number) => void;
  openCart: () => void;
  showConfirmationModal?: (product: any) => void;
  addBundleToCart?: any;
}

const Products: React.FC<ProductsProps> = ({
  addToCart,
  openCart,
  showConfirmationModal,
  addBundleToCart,
}) => {
  const { cart } = useCart();
  const [ref, inView] = useInView({

    triggerOnce: true,
    threshold: 0.1,
  });

  const [selectedProduct, setSelectedProduct] = useState(null);

  const products = ALL_PRODUCTS.filter(p => p.category === "sauce");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.2, 0.8, 0.2, 1],
      },
    },
  };

  const renderHeatLevel = (level: number, color: string) => {
    return [...Array(5)].map((_, i) => (
      <Flame
        key={i}
        size={18}
        className={`heat-flame-premium ${i < level ? "heat-flame-active" : ""}`}
        style={{ color: i < level ? "#ff3b30" : "rgba(255, 255, 255, 0.2)" }}
      />
    ));
  };



  const formatProductName = (name: string) => {
    if (name.includes("(100ml)")) {
      return (
        <>
          {name.replace("(100ml)", "").trim()}
          <span className="premium-product-size"> (100ml)</span>
        </>
      );
    }
    return name;
  };

  return (
    <section id="products" className="products premium-products-section" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ marginBottom: "2rem" }}
        >
          <h2 className="section-title">
            Our <span className="text-gradient">Collection</span>
          </h2>
          <p className="section-subtitle">
            Discover the perfect balance of heat and flavor for your palate
          </p>
        </motion.div>

        <motion.div
          className="premium-products-track"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              className="premium-product-card"
              variants={itemVariants}
              onClick={() => window.location.href = `/product/${product.slug}`}
            >
              <div 
                className="premium-product-glass"
                style={{ "--product-color": product.color } as any}
              >
                <div className="premium-product-image-container">
                  <div className="premium-product-glow" style={{ background: product.color }} />
                  <img
                    src={product.image}
                    alt={`${product.name} Hot Sauce`}
                    className="premium-product-image"
                  />
                  <div 
                    className="premium-product-view-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/product/${product.slug}`;
                    }}
                  >
                    <Eye size={24} />
                  </div>
                </div>

                <div className="premium-product-content">
                  <div className="premium-product-header">
                    <h3 className="premium-product-name">{formatProductName(product.name)}</h3>
                    {product.available && (
                      <div className="premium-product-rating">
                        <Star size={16} fill="currentColor" />
                        <span>4.9</span>
                      </div>
                    )}
                  </div>

                  <p className="premium-product-description">{product.description}</p>

                  <div className="premium-product-heat">
                    {renderHeatLevel(product.heatLevel, product.color)}
                  </div>

                  <div className="premium-product-features">
                    {product.features.slice(0, 3).map((feature, i) => (
                      <span key={i} className="premium-feature-tag">
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="premium-product-footer-row">
                    <div className="premium-product-price">
                      ₹{product.price}
                    </div>
                    {product.available ? (
                      <button
                        className="premium-icon-cart-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product, 1);
                          if (openCart) openCart();
                        }}
                        title="Add to Cart"
                        style={{ position: "relative" }}
                      >
                        <ShoppingCart size={18} />
                        {(() => {
                          const inCart = cart.find((item) => item.id === product.id);
                          return inCart && inCart.qty > 0 ? (
                            <span className="cart-badge-compact">{inCart.qty}</span>
                          ) : null;
                        })()}
                      </button>

                    ) : (
                      <div className="premium-coming-soon">Coming Soon</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Great Deal Panel */}
        {/* <motion.div
          className="premium-deal-panel"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        >
          <div className="premium-deal-glass">
            <div className="premium-deal-glow"></div>
            <div className="premium-deal-content">
              <div className="premium-deal-badge">Special Offer</div>
              <h3 className="premium-deal-title">The Ultimate Trio</h3>
              <p className="premium-deal-desc">
                Experience our core lineup with the 3-bottle pack (Green, Wild, Glitch).
              </p>
              <div className="premium-deal-pricing">
                <span className="premium-deal-current">₹816.00</span>
                <span className="premium-deal-original">₹916.00</span>
                <span className="premium-deal-savings">Save ₹100</span>
              </div>
            </div>
            <button 
              className="premium-deal-btn"
              onClick={() => {
                if(addBundleToCart) {
                  addToCart(addBundleToCart, 1);
                  openCart();
                }
              }}
            >
              <ShoppingCart size={20} />
              Grab The Bundle
            </button>
          </div>
        </motion.div> */}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <motion.div
          className="product-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedProduct(null)}
        >
          <motion.div
            className="modal-content glass-strong"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{ 
              background: 'rgba(18, 18, 18, 0.95)',
              border: `1px solid ${(selectedProduct as any).color}40`,
              boxShadow: `0 30px 60px rgba(0,0,0,0.6), 0 0 40px ${(selectedProduct as any).color}20`
            }}
          >
            <button
              className="premium-modal-close"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProduct(null);
              }}
            >
              <X size={24} />
            </button>
            <div className="modal-product modal-product-grid">
              <div className="modal-image modal-image-fill">
                {selectedProduct.video ? (
                  <video
                    className="modal-variant-image modal-variant-image-fill"
                    src={selectedProduct.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                  />
                ) : (
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2rem' }}
                  />
                )}
              </div>
              <div className="modal-details">
                <h2 style={{ color: (selectedProduct as any).color }}>{formatProductName((selectedProduct as any).name)}</h2>
                <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>{(selectedProduct as any).description}</p>
                <div className="modal-heat" style={{ marginTop: '2rem' }}>
                  <div className="heat-level">
                    {renderHeatLevel((selectedProduct as any).heatLevel, (selectedProduct as any).color)}
                  </div>
                </div>
                <div className="modal-features" style={{ gap: '0.75rem', marginTop: '1.5rem' }}>
                  {(selectedProduct as any).features.map((feature: string, i: number) => (
                    <span 
                      key={i} 
                      className="premium-feature-tag"
                      style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="modal-price" style={{ marginTop: '2rem', fontSize: '2.5rem' }}>{(selectedProduct as any).price}</div>
                {(selectedProduct as any).available ? (
                  <motion.button
                    className="premium-add-to-cart-btn"
                    style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      addToCart(selectedProduct, 1);
                      setSelectedProduct(null);
                      openCart();
                    }}
                  >
                    <ShoppingCart size={20} />
                    <span>Add to Cart</span>
                  </motion.button>
                ) : (
                  <div className="modal-coming-soon" style={{ padding: '1rem', textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem' }}>
                    <span>Launching soon - Stay Tuned!</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default Products;
