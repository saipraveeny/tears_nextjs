"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Flame, Star, ShoppingCart, Eye, X, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";

import { ALL_PRODUCTS } from "@/utils/productData";
import { useCart } from "@/hooks/useCart";

interface ProductsProps {
  addToCart: (product: any, qty: number) => void;
  openCart: () => void;
  showConfirmationModal?: (product: any) => void;
  addBundleToCart?: any;
}

const ProductCard = ({ product, addToCart, cart, updateQty, openCart, itemVariants, formatProductName, renderHeatLevel }) => {
  const router = useRouter();
  const [folderImages, setFolderImages] = useState<string[]>([]);
  
  React.useEffect(() => {
    if (product.imageFolder) {
      fetch(`/api/product-images/${product.imageFolder}`)
        .then(res => res.json())
        .then(data => setFolderImages(data.images || []))
        .catch(() => setFolderImages([]));
    }
  }, [product.imageFolder]);

  const media = [
    ...(product.videos || []).map(v => ({ type: 'video', url: v })),
    ...folderImages.map(img => ({ type: 'image', url: img })),
    { type: 'image', url: product.productLogo, isLogo: true }
  ].filter(m => m.url);
  
  // Fallback: if no folder images loaded yet, show the primary image
  if (folderImages.length === 0 && product.image) {
    const hasPrimary = media.some(m => m.url === product.image);
    if (!hasPrimary) {
      media.splice(product.videos?.length || 0, 0, { type: 'image', url: product.image });
    }
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMedia = media[currentIndex % media.length];

  const handleNextMedia = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const handlePrevMedia = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  const inCart = cart.find((item) => item.id === product.id);

  return (
    <motion.div
      className="premium-product-card"
      variants={itemVariants}
      onClick={() => router.push(`/product/${product.slug}`)}
    >
      <div 
        className="premium-product-glass"
        style={{ "--product-color": product.color } as any}
      >
        <div className="premium-product-image-container">
          <div className="premium-product-glow" style={{ background: product.color, position: 'absolute', width: '60%', height: '60%', filter: 'blur(60px)', opacity: 0.2, zIndex: 0, pointerEvents: 'none' }} />
          
          {currentMedia?.type === 'video' ? (
            <video
              src={currentMedia.url}
              autoPlay
              muted
              loop
              playsInline
              className="premium-product-image"
              style={{ 
                objectFit: 'cover', 
                width: '100%', 
                height: '100%',
                borderTopLeftRadius: '40px',
                borderTopRightRadius: '40px'
              }}
            />
          ) : (
            <div style={{ 
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              alignItems: currentMedia?.isLogo ? 'center' : 'flex-start', 
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              borderTopLeftRadius: '40px',
              borderTopRightRadius: '40px',
              margin: 0,
              padding: 0
            }}>
              <img
                src={currentMedia?.url || product.image}
                alt={`${product.name} Hot Sauce`}
                className="premium-product-image"
                style={{ 
                  objectFit: currentMedia?.isLogo ? 'contain' : 'cover', 
                  width: currentMedia?.isLogo ? '70%' : '100%', 
                  height: currentMedia?.isLogo ? '70%' : '100%', 
                  filter: currentMedia?.isLogo ? 'none' : 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))',
                  zIndex: 2,
                  transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  objectPosition: currentMedia?.isLogo ? 'center' : 'top',
                  margin: 0,
                  padding: 0
                }}
              />
            </div>
          )}

          {/* Nav Arrows */}
          {media.length > 1 && (
            <>
              <button 
                className="media-nav-btn prev" 
                onClick={handlePrevMedia}
                title="Previous"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                className="media-nav-btn next" 
                onClick={handleNextMedia}
                title="Next"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {media.length > 1 && (
            <div className="media-dots">
              {media.map((_, i) => (
                <div 
                  key={i} 
                  className={`media-dot ${i === currentIndex ? 'active' : ''}`}
                />
              ))}
            </div>
          )}

          <div 
            className="premium-product-view-btn"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/product/${product.slug}`);
            }}
            title="View Product"
          >
            <Eye size={24} />
          </div>
        </div>

        <div className="premium-product-content">
          <div className="premium-product-header">
            <h3 className="premium-product-name">{formatProductName(product.name)}</h3>
            {product.available && (
              <div className="premium-product-rating">
                <Star size={12} fill="currentColor" />
                <span>{product.rating || "4.9"}</span>
              </div>
            )}
          </div>

          <p className="premium-product-description" title={product.description}>{product.description}</p>

          <div className="premium-product-heat">
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '0.5px', marginRight: '6px', whiteSpace: 'nowrap' }}>HEAT LEVEL</span>
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
              {product.price}
            </div>
            {product.available ? (
              inCart && inCart.qty > 0 ? (
                <div className="quantity-selector">
                  <button 
                    className="qty-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQty(inCart.cartItemId, inCart.qty - 1);
                    }}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="qty-count">{inCart.qty}</span>
                  <button 
                    className="qty-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product, 1);
                    }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              ) : (
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
                </button>
              )
            ) : (
              <div className="premium-coming-soon">Coming Soon</div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Products: React.FC<ProductsProps> = ({
  addToCart,
  openCart,
  showConfirmationModal,
  addBundleToCart,
}) => {
  const { cart, updateQty } = useCart();
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
              cart={cart}
              updateQty={updateQty}
              openCart={openCart}
              itemVariants={itemVariants}
              formatProductName={formatProductName}
              renderHeatLevel={renderHeatLevel}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Products;
