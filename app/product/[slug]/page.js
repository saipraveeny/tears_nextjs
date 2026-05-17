"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ALL_PRODUCTS } from "@/utils/productData";
import { useCart } from "@/hooks/useCart";
import { Flame, Star, ShoppingCart, ChevronLeft, ChevronRight, ShieldCheck, Truck, Sparkles, X, MessageSquarePlus } from "lucide-react";

import Reviews from "@/components/Reviews";
import CartModal from "@/components/CartModal";

function SuggestionCard({ p, isMobile }) {
  const [imgSrc, setImgSrc] = useState(`/assets/products/${p.imageFolder}/1.jpg`);

  useEffect(() => {
    if (p.imageFolder) {
      fetch(`/api/product-images/${p.imageFolder}`)
        .then(res => res.json())
        .then(data => {
          if (data.images && data.images.length > 0) {
            setImgSrc(data.images[0]);
          }
        })
        .catch(() => {});
    }
  }, [p.imageFolder]);

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      onClick={() => window.location.href = `/product/${p.slug}`}
      style={{ flex: isMobile ? "0 0 160px" : "0 0 220px", display: "flex", flexDirection: "column", gap: "10px", cursor: "pointer" }}
    >
      <div style={{ width: "100%", height: isMobile ? "160px" : "220px", background: "rgba(255,255,255,0.03)", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.05)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: "80px", height: "80px", background: p.color, filter: "blur(40px)", opacity: 0.15 }} />
        <img src={imgSrc} alt={p.name} style={{ width: "70%", height: "70%", objectFit: "contain", zIndex: 1 }} />
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontWeight: "700", fontSize: isMobile ? "0.85rem" : "1rem" }}>{p.name}</div>
      </div>
    </motion.div>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { addToCart, isCartOpen, setIsCartOpen, cart, updateQty, removeFromCart, clearCart } = useCart();
  
  const product = ALL_PRODUCTS.find(p => p.slug === slug);
  const [quantity, setQuantity] = useState(1);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);


  const [newReview, setNewReview] = useState({
    user: "",
    rating: 5,
    comment: ""
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [folderImages, setFolderImages] = useState([]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (product?.imageFolder) {
      fetch(`/api/product-images/${product.imageFolder}`)
        .then(res => res.json())
        .then(data => setFolderImages(data.images || []))
        .catch(() => setFolderImages([]));
    }
  }, [product?.imageFolder]);

  if (!product) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "20px" }}>
        <h1>Product Not Found</h1>
        <button className="btn btn-primary" onClick={() => router.push("/")}>Back to Home</button>
      </div>
    );
  }

  const media = [
    ...(product.videos || []).map(v => ({ type: 'video', url: v })),
    ...folderImages.map(img => ({ type: 'image', url: img })),
    { type: 'image', url: product.productLogo, isLogo: true }
  ].filter(m => m.url);

  // Fallback: if folder images haven't loaded yet, show primary image
  if (folderImages.length === 0 && product.image) {
    const hasPrimary = media.some(m => m.url === product.image);
    if (!hasPrimary) {
      media.splice(product.videos?.length || 0, 0, { type: 'image', url: product.image });
    }
  }

  const currentMedia = media[currentIndex % media.length];

  const handleNextMedia = () => setCurrentIndex((prev) => (prev + 1) % media.length);
  const handlePrevMedia = () => setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReview.user) return;
    
    const review = {
      ...newReview,
      comment: newReview.comment || "Rated but no comment provided.",
      id: Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    
    setReviews([...reviews, review]);
    setNewReview({ user: "", rating: 5, comment: "" });
    setIsReviewModalOpen(false);
  };

  const renderHeatLevel = (level, color) => {
    return [...Array(5)].map((_, i) => (
      <Flame
        key={i}
        size={isMobile ? 20 : 24}
        className={`heat-flame-premium ${i < level ? "heat-flame-active" : ""}`}
        style={{ color: i < level ? "#ff3b30" : "rgba(255, 255, 255, 0.2)" }}
      />
    ));
  };


  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : "0.0";


  return (
    <div style={{ background: "#050505", minHeight: "100vh", color: "#fff" }}>
      <CartModal
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={updateQty}
        onRemove={removeFromCart}
        onClearCart={clearCart}
      />

      {/* Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.9)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              style={{ width: "100%", maxWidth: "500px", background: "#0a0a0a", borderRadius: "32px", padding: isMobile ? "25px" : "40px", border: `1px solid ${product.color}30`, position: "relative" }}
            >
              <button 
                onClick={() => setIsReviewModalOpen(false)}
                style={{ position: "absolute", top: "20px", right: "20px", background: "transparent", border: "none", color: "#888", cursor: "pointer" }}
              >
                <X size={24} />
              </button>
              
              <h2 style={{ fontSize: isMobile ? "1.5rem" : "2rem", fontWeight: "900", marginBottom: "30px" }}>Share Your <span style={{ color: product.color }}>Experience</span></h2>
              
              <form onSubmit={handleAddReview} style={{ display: "grid", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", color: "#888", fontSize: "13px", marginBottom: "8px" }}>Your Name</label>
                  <input 
                    required
                    value={newReview.user}
                    onChange={(e) => setNewReview({...newReview, user: e.target.value})}
                    placeholder="Enter your name"
                    style={{ width: "100%", padding: "15px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}
                  />
                </div>
                
                <div>
                  <label style={{ display: "block", color: "#888", fontSize: "13px", marginBottom: "8px" }}>Rating</label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {[1, 2, 3, 4, 5].map(num => (
                      <button 
                        key={num}
                        type="button"
                        onClick={() => setNewReview({...newReview, rating: num})}
                        style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        <Star size={isMobile ? 24 : 30} fill={num <= newReview.rating ? "#fbbf24" : "none"} color={num <= newReview.rating ? "#fbbf24" : "#333"} />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label style={{ display: "block", color: "#888", fontSize: "13px", marginBottom: "8px" }}>Comment (Optional)</label>
                  <textarea 
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                    placeholder="How was the heat? (Optional)"
                    rows={4}
                    style={{ width: "100%", padding: "15px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", resize: "none" }}
                  />
                </div>
                
                <button className="btn btn-primary" style={{ padding: "18px", borderRadius: "12px", fontWeight: "800", marginTop: "10px" }}>
                  Submit Review
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav style={{ 
        padding: isMobile ? "15px 5%" : "20px 5%", 
        position: "fixed", 
        top: 0, 
        left: 0,
        width: "100%", 
        zIndex: 1000, 
        background: "rgba(5,5,5,0.95)", 
        backdropFilter: "blur(20px)", 
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        display: isMobile ? "none" : "block" 
      }}>
        <button 
          onClick={() => window.location.href = "/"}
          style={{ background: "transparent", border: "none", color: "#fff", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: "600", padding: "10px 0" }}
        >
          <ChevronLeft size={20} /> <span style={{ fontSize: "1rem" }}>Back to Collection</span>
        </button>
      </nav>

      <main style={{ padding: isMobile ? "80px 5% 120px" : "120px 5% 60px", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Mobile Back Button */}
        {isMobile && (
          <button 
            onClick={() => window.location.href = "/"}
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontWeight: "700", padding: "12px 20px", borderRadius: "14px", marginBottom: "20px", width: "fit-content" }}
          >
            <ChevronLeft size={20} /> <span style={{ fontSize: "0.9rem" }}>Back</span>
          </button>
        )}

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(400px, 1fr))", gap: isMobile ? "20px" : "60px", alignItems: "start" }}>
          {/* Image/Video Section */}
          <motion.div 
            initial={{ opacity: 0, x: isMobile ? 0 : -30, y: isMobile ? 20 : 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ position: "relative", borderRadius: isMobile ? "0" : "24px", overflow: "hidden", background: isMobile ? "transparent" : "rgba(255,255,255,0.02)", border: isMobile ? "none" : "1px solid rgba(255,255,255,0.05)", height: isMobile ? "380px" : "650px", display: "flex", alignItems: isMobile ? "flex-start" : "center", justifyContent: "center", padding: "0", margin: isMobile ? "0 -5%" : "0" }}
          >
            <div style={{ position: "absolute", width: isMobile ? "250px" : "400px", height: isMobile ? "250px" : "400px", background: product.color, filter: "blur(100px)", opacity: 0.15 }} />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                style={{ width: "100%", height: "100%", display: "flex", alignItems: currentMedia?.isLogo ? "center" : (isMobile ? "flex-start" : "center"), justifyContent: "center" }}
              >
                {currentMedia?.type === 'video' ? (
                  <video 
                    src={currentMedia.url} 
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <img 
                    src={currentMedia?.url || product.image} 
                    alt={`Designed for the Discerning Palate with amla chilli and hand-harvested ingredients, slow-fused for an unparalleled sensory journey.`} 
                    style={{ 
                      width: currentMedia?.isLogo ? (isMobile ? "70%" : "60%") : (isMobile ? "100%" : "80%"), 
                      height: currentMedia?.isLogo ? (isMobile ? "70%" : "80%") : (isMobile ? "110%" : "80%"), 
                      objectFit: "contain", 
                      objectPosition: isMobile ? "top" : "center",
                      zIndex: 1,
                      filter: currentMedia?.isLogo ? 'none' : 'drop-shadow(0 20px 50px rgba(0,0,0,0.5))',
                      marginTop: isMobile ? "-30px" : "0",
                      transform: isMobile ? "scale(1.2)" : "none"
                    }}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {media.length > 1 && (
              <>
                <button 
                  onClick={handlePrevMedia}
                  style={{ position: "absolute", left: isMobile ? "10px" : "20px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", width: isMobile ? "35px" : "45px", height: isMobile ? "35px" : "45px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10, backdropFilter: "blur(10px)" }}
                >
                  <ChevronLeft size={isMobile ? 18 : 24} />
                </button>
                <button 
                  onClick={handleNextMedia}
                  style={{ position: "absolute", right: isMobile ? "10px" : "20px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", width: isMobile ? "35px" : "45px", height: isMobile ? "35px" : "45px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10, backdropFilter: "blur(10px)" }}
                >
                  <ChevronRight size={isMobile ? 18 : 24} />
                </button>

                <div style={{ position: "absolute", bottom: isMobile ? "15px" : "30px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "6px", zIndex: 10 }}>
                  {media.map((_, i) => (
                    <div 
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      style={{ width: "6px", height: "6px", borderRadius: "50%", background: i === currentIndex % media.length ? "#fff" : "rgba(255,255,255,0.3)", cursor: "pointer", transition: "all 0.3s ease" }}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : 30, y: isMobile ? 20 : 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.6rem" }}>
              <span style={{ padding: "3px 8px", borderRadius: "20px", background: `${product.color}20`, color: product.color, fontSize: "0.7rem", fontWeight: "700", border: `1px solid ${product.color}40` }}>
                {product.category.toUpperCase()}
              </span>
              {product.premium && (
                <span style={{ padding: "3px 8px", borderRadius: "20px", background: "linear-gradient(135deg, #fbbf24, #d97706)", color: "#000", fontSize: "0.7rem", fontWeight: "800" }}>
                  PRIVATE RESERVE
                </span>
              )}
            </div>

            <h1 style={{ fontSize: isMobile ? "2rem" : "clamp(2.5rem, 5vw, 4rem)", fontWeight: "900", marginBottom: "0.6rem", lineHeight: 1.1 }}>
              {product.name}
            </h1>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: isMobile ? "1.2rem" : "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontWeight: "700", color: "#888", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>Heat Level:</span>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  {renderHeatLevel(product.heatLevel, "#ff3b30")}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "3px", color: "#fbbf24" }}>
                    <Star size={isMobile ? 14 : 18} fill="currentColor" />
                    <span style={{ fontWeight: "700", color: "#fff", fontSize: isMobile ? "0.9rem" : "1.2rem" }}>{averageRating}</span>
                  </div>
                  <span style={{ color: "#555", fontSize: "0.75rem" }}>({reviews.length})</span>
                </div>
                <div style={{ width: "1px", height: "12px", background: "rgba(255,255,255,0.1)" }} />
                <button 
                  onClick={() => setIsReviewModalOpen(true)}
                  style={{ background: "transparent", border: "none", color: "#ff3b30", fontWeight: "700", cursor: "pointer", fontSize: "0.75rem", textDecoration: "underline", display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <MessageSquarePlus size={12} /> Write a Review
                </button>
              </div>
            </div>


            <p style={{ fontSize: isMobile ? "0.95rem" : "1.2rem", color: "#ccc", lineHeight: 1.5, marginBottom: isMobile ? "1.5rem" : "2rem" }}>
              {product.description}
            </p>

            <div style={{ marginBottom: isMobile ? "1.5rem" : "2.5rem" }}>
              <h3 style={{ fontSize: "0.8rem", color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.8rem" }}>Culinary Pairings</h3>
              <p style={{ color: "#aaa", fontSize: "0.9rem", lineHeight: 1.4 }}>
                Pairs exquisitely with grilled meats, artisanal sourdough, or as a bold finish to roasted vegetables.
              </p>
            </div>

            <div style={{ fontSize: isMobile ? "1.8rem" : "3rem", fontWeight: "900", marginBottom: "1.5rem", color: product.color, display: isMobile ? "none" : "block" }}>
              {product.price}
            </div>

            {/* Features Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: isMobile ? "1.5rem" : "2.5rem" }}>
              {product.features?.map((f, i) => (
                <span key={i} style={{ padding: isMobile ? "6px 12px" : "10px 20px", borderRadius: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", fontSize: isMobile ? "0.75rem" : "0.9rem" }}>
                  {f}
                </span>
              ))}
            </div>

            {/* Trust Badges */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginTop: isMobile ? "1.5rem" : "3rem", paddingTop: isMobile ? "1rem" : "2rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <ShieldCheck size={18} color={product.color} />
                <span style={{ fontSize: "0.65rem", color: "#888" }}>100% Natural</span>
              </div>
              <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <Truck size={18} color={product.color} />
                <span style={{ fontSize: "0.65rem", color: "#888" }}>Fast Delivery</span>
              </div>
              <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <Sparkles size={18} color={product.color} />
                <span style={{ fontSize: "0.65rem", color: "#888" }}>Small Batch</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile Sticky Buy Bar */}
        {isMobile && (
          <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", background: "rgba(5,5,5,0.9)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.1)", padding: "15px 5% env(safe-area-inset-bottom)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "15px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "0.8rem", color: "#888", fontWeight: "600" }}>Price</span>
              <span style={{ fontSize: "1.4rem", fontWeight: "900", color: product.color }}>{product.price}</span>
            </div>
            {(() => {
              const inCart = cart.find(item => item.id === product.id);
              if (inCart && inCart.qty > 0) {
                return (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "8px 16px" }}>
                    <button 
                      onClick={() => updateQty(inCart.cartItemId, inCart.qty - 1)}
                      style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", padding: "4px", fontSize: "1.2rem", fontWeight: "800" }}
                    >−</button>
                    <span style={{ fontSize: "1.1rem", fontWeight: "800", minWidth: "24px", textAlign: "center" }}>{inCart.qty}</span>
                    <button 
                      onClick={() => addToCart(product, 1)}
                      style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", padding: "4px", fontSize: "1.2rem", fontWeight: "800" }}
                    >+</button>
                  </div>
                );
              }
              return (
                <button 
                  onClick={() => { addToCart(product, 1); }}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: "15px", borderRadius: "12px", fontSize: "0.95rem", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  <ShoppingCart size={18} /> Buy Now
                </button>
              );
            })()}
          </div>
        )}

        {/* Reviews Section - MOVED UP */}
        <div style={{ marginTop: isMobile ? "40px" : "100px", padding: isMobile ? "30px 0" : "40px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <Reviews 
            productName={product.name} 
            color={product.color} 
            reviews={reviews}
            onWriteReview={() => setIsReviewModalOpen(true)}
          />
        </div>

        {/* More Products Section - MOVED DOWN */}
        <div style={{ marginTop: isMobile ? "40px" : "100px", padding: isMobile ? "30px 0" : "40px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <h2 style={{ fontSize: isMobile ? "1.5rem" : "2.5rem", fontWeight: "900", marginBottom: isMobile ? "25px" : "40px", textAlign: "center" }}>
            Discover <span style={{ color: product.color }}>More Flavors</span>
          </h2>
          <div style={{ display: "flex", overflowX: "auto", gap: "15px", padding: "10px 0", scrollbarWidth: "none" }}>
            {ALL_PRODUCTS.filter(p => p.id !== product.id && p.category === "sauce").map((p) => (
              <SuggestionCard key={p.id} p={p} isMobile={isMobile} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
