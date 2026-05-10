"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Flame, Star, ShoppingCart, Eye } from "lucide-react";

// Import variant images
// Variant images (using string paths from public/assets)
const wildImage = "/assets/wild.png";
const glitchImage = "/assets/glitch.png";
const greenImage = "/assets/green.png";
const spikeImage = "/assets/spike.PNG";
const altImage = "/assets/alt.PNG";

// Video paths
const wildJpg = "/assets/wild.mp4";
const glitchJpg = "/assets/glitch.mp4";
const bgVideo = "/assets/Background.mp4";

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
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [selectedProduct, setSelectedProduct] = useState(null);

  const products = [
    {
      id: 1,
      name: "Green (100ml)",
      description:
        "Classic green chilli with citrus undertones, with coriander seeds, black pepper, capsicum and kaffir lime",
      heatLevel: 2,
      price: "₹250.00",
      color: "#548c50",
      features: ["Green chilli", "Lemon", "Balanced Heat", "Versatile"],
      image: greenImage,
      available: true,
    },
    {
      id: 2,
      name: "Wild (100ml)",
      description:
        "This is the peak of the Tears spectrum, our spiciest variant yet. Crafted with a heavy-hitting chili base",
      heatLevel: 4,
      price: "₹333.00",
      color: "#ff3b30",
      features: ["Extra Hot", "Herb Infused", "Smoky Finish"],
      image: wildImage,
      available: true,
    },
    {
      id: 3,
      name: "Glitch (100ml)",
      description: "Innovative fusion of red chilli and grape fruit",
      heatLevel: 3,
      price: "₹333.00",
      color: "#0f222b",
      features: ["Exotic Spices", "Complex Heat"],
      image: glitchImage,
      available: true,
    },
    {
      id: 4,
      name: "Spike (100ml)",
      description:
        "Sharp, piercing heat with a bold chilli profile. Perfect for heat enthusiasts seeking an intense kick",
      heatLevel: 2,
      price: "₹301.00",
      color: "#cc4400",
      features: ["Intense Heat", "Bold Flavor", "Spicy Kick"],
      image: spikeImage,
      available: true,
    },
    {
      id: 5,
      name: "ALT (100ml)",
      description: "Amla chilli",
      heatLevel: 3,
      price: "₹326.00",
      color: "#8B9B17",
      features: ["Amla", "Chilli"],
      image: altImage,
      available: true,
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

  const renderHeatLevel = (level) => {
    return [...Array(5)].map((_, i) => (
      <Flame
        key={i}
        size={16}
        className={`heat-flame ${i < level ? "active" : ""}`}
      />
    ));
  };

  return (
    <section id="products" className="products">
      <div className="container">
        <motion.div
          className="products-grid"
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="product-card neumorphic"
              variants={itemVariants}
              whileHover={{
                y: -10,
                scale: 1.02,
              }}
              onClick={() => setSelectedProduct(product)}
            >
              <div
                className="product-image"
                style={{ background: product.color, borderRadius: "2rem" }}
              >
                <img
                  src={product.image}
                  alt={`${product.name} Hot Sauce`}
                  className="product-variant-image"
                />
                <motion.div
                  className="product-overlay"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <motion.button
                    className="overlay-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Eye size={20} />
                  </motion.button>
                </motion.div>
              </div>

              <div className="product-content">
                <div className="product-header">
                  <h3 className="product-name">{product.name}</h3>
                  {product.available && (
                    <div className="product-rating">
                      <Star size={16} className="star-icon" />
                      <span>4.9</span>
                    </div>
                  )}
                </div>

                <p className="product-description">{product.description}</p>

                <div className="product-heat">
                  <span className="heat-label">Heat Level:</span>
                  <div className="heat-level">
                    {renderHeatLevel(product.heatLevel)}
                  </div>
                </div>

                <div className="product-features">
                  {product.features.map((feature, i) => (
                    <span key={i} className="feature-tag">
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="product-footer-main">
                  <div className="product-price-row">
                    <span className="product-price">{product.price}</span>
                  </div>
                  <div className="product-actions">
                    {product.available ? (
                      <motion.button
                        className="add-to-cart-full"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product, 1);
                          openCart();
                        }}
                      >
                        <ShoppingCart size={18} />
                        <span className="cart-btn-text">Add to Cart</span>
                      </motion.button>
                    ) : (
                      <div className="coming-soon-badge-full">
                        <span>Launching soon</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Great Deal Panel (moved below products) */}
        <motion.div
          className="great-deal-panel"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="great-deal-content">
            <div className="great-deal-title">Launching Offer</div>
            <div className="great-deal-desc">
              <b>3 bottles pack(green, wild, glitch)</b> for just{" "}
              <span className="great-deal-price">₹816.00</span>
              <span className="discount-badge">Save ₹100</span>
            </div>
            <div className="original-price">
              <span className="strikethrough">₹916.00</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="products-cta"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="cta-text">
            Perfect for cafés, fine-dining restaurants, and barbecue joints
          </p>
          <motion.button
            className="btn btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openCart}
          >
            View Cart
          </motion.button>
        </motion.div>
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
          >
            <button
              className="modal-close"
              onClick={() => setSelectedProduct(null)}
            >
              ×
            </button>
            <div className="modal-product modal-product-grid">
              <div className="modal-image modal-image-fill">
                {selectedProduct.name === "Wild (100ml)" && (
                  <video
                    className="modal-variant-image modal-variant-image-fill"
                    src={wildJpg}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    aria-label="Wild Hot Sauce video"
                  />
                )}
                {selectedProduct.name === "Glitch (100ml)" && (
                  <video
                    className="modal-variant-image modal-variant-image-fill"
                    src={glitchJpg}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    aria-label="Wild Hot Sauce video"
                  />
                )}
                {selectedProduct.name === "Green (100ml)" && (
                  <video
                    className="modal-variant-image modal-variant-image-fill"
                    src={bgVideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    aria-label="Green Hot Sauce video"
                  />
                )}
              </div>
              <div className="modal-details">
                <h2>{selectedProduct.name}</h2>
                <p>{selectedProduct.description}</p>
                <div className="modal-heat">
                  <span>Heat Level:</span>
                  <div className="heat-level">
                    {renderHeatLevel(selectedProduct.heatLevel)}
                  </div>
                </div>
                <div className="modal-features">
                  {selectedProduct.features.map((feature, i) => (
                    <span key={i} className="feature-tag">
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="modal-price">{selectedProduct.price}</div>
                {selectedProduct.available ? (
                  <motion.button
                    className="btn btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      addToCart(selectedProduct, 1);
                      setSelectedProduct(null);
                      openCart();
                    }}
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </motion.button>
                ) : (
                  <div className="modal-coming-soon">
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
