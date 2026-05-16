"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ALL_PRODUCTS } from "@/utils/productData";
import { useCart } from "@/hooks/useCart";
import { Flame, Star, ShoppingCart, ChevronLeft, ShieldCheck, Truck, Sparkles, X, MessageSquarePlus } from "lucide-react";

import Reviews from "@/components/Reviews";
import CartModal from "@/components/CartModal";

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

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!product) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "20px" }}>
        <h1>Product Not Found</h1>
        <button className="btn btn-primary" onClick={() => router.push("/")}>Back to Home</button>
      </div>
    );
  }

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

      <nav style={{ padding: isMobile ? "15px 5%" : "20px 5%", position: "fixed", top: 0, width: "100%", zIndex: 100, background: "rgba(5,5,5,0.8)", backdropFilter: "blur(10px)" }}>
        <button 
          onClick={() => router.push("/")}
          style={{ background: "transparent", border: "none", color: "#fff", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: "600" }}
        >
          <ChevronLeft size={20} /> <span style={{ fontSize: isMobile ? "0.9rem" : "1rem" }}>Back to Collection</span>
        </button>
      </nav>

      <main style={{ padding: isMobile ? "100px 5% 40px" : "120px 5% 60px", maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(400px, 1fr))", gap: isMobile ? "30px" : "60px", alignItems: "start" }}>
          {/* Image/Video Section */}
          <motion.div 
            initial={{ opacity: 0, x: isMobile ? 0 : -30, y: isMobile ? 20 : 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ position: "relative", borderRadius: "24px", overflow: "hidden", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", height: isMobile ? "350px" : "600px", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <div style={{ position: "absolute", width: isMobile ? "150px" : "300px", height: isMobile ? "150px" : "300px", background: product.color, filter: "blur(100px)", opacity: 0.15 }} />
            {product.video ? (
              <video 
                src={product.video} 
                autoPlay 
                muted 
                loop 
                playsInline 
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <img 
                src={product.image} 
                alt={product.name} 
                style={{ width: "70%", height: "70%", objectFit: "contain", zIndex: 1 }}
              />
            )}
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : 30, y: isMobile ? 20 : 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.8rem" }}>
              <span style={{ padding: "4px 10px", borderRadius: "20px", background: `${product.color}20`, color: product.color, fontSize: "0.75rem", fontWeight: "700", border: `1px solid ${product.color}40` }}>
                {product.category.toUpperCase()}
              </span>
              {product.premium && (
                <span style={{ padding: "4px 10px", borderRadius: "20px", background: "linear-gradient(135deg, #fbbf24, #d97706)", color: "#000", fontSize: "0.75rem", fontWeight: "800" }}>
                  PREMIUM
                </span>
              )}
            </div>

            <h1 style={{ fontSize: isMobile ? "2.2rem" : "clamp(2.5rem, 5vw, 4rem)", fontWeight: "900", marginBottom: "0.8rem", lineHeight: 1.1 }}>
              {product.name}
            </h1>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontWeight: "700", color: "#888", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Heat Level:</span>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  {renderHeatLevel(product.heatLevel, "#ff3b30")}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "3px", color: "#fbbf24" }}>
                    <Star size={isMobile ? 16 : 18} fill="currentColor" />
                    <span style={{ fontWeight: "700", color: "#fff", fontSize: isMobile ? "1rem" : "1.2rem" }}>{averageRating}</span>
                  </div>
                  <span style={{ color: "#555", fontSize: "0.8rem" }}>({reviews.length})</span>
                </div>
                <div style={{ width: "1px", height: "15px", background: "rgba(255,255,255,0.1)" }} />
                <button 
                  onClick={() => setIsReviewModalOpen(true)}
                  style={{ background: "transparent", border: "none", color: "#ff3b30", fontWeight: "700", cursor: "pointer", fontSize: "0.8rem", textDecoration: "underline", display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <MessageSquarePlus size={14} /> Write a Review
                </button>
              </div>
            </div>


            <p style={{ fontSize: isMobile ? "1rem" : "1.2rem", color: "#ccc", lineHeight: 1.6, marginBottom: "2rem" }}>
              {product.description}
            </p>

            <div style={{ fontSize: isMobile ? "2.2rem" : "3rem", fontWeight: "900", marginBottom: "2rem", color: product.color }}>
              {product.price}
            </div>

            {/* Features Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "2.5rem" }}>
              {product.features?.map((f, i) => (
                <span key={i} style={{ padding: isMobile ? "8px 15px" : "10px 20px", borderRadius: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", fontSize: isMobile ? "0.8rem" : "0.9rem" }}>
                  {f}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "15px", alignItems: "center", flexDirection: isMobile ? "column" : "row" }}>
              <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.05)", borderRadius: "14px", padding: "6px", border: "1px solid rgba(255,255,255,0.1)", width: isMobile ? "100%" : "auto", justifyContent: isMobile ? "space-between" : "flex-start" }}>
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: "40px", height: "40px", borderRadius: "10px", border: "none", background: "transparent", color: "#fff", cursor: "pointer", fontSize: "1.2rem" }}
                >
                  -
                </button>
                <span style={{ width: "40px", textAlign: "center", fontWeight: "700" }}>{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ width: "40px", height: "40px", borderRadius: "10px", border: "none", background: "transparent", color: "#fff", cursor: "pointer", fontSize: "1.2rem" }}
                >
                  +
                </button>
              </div>

              <button 
                onClick={() => {
                  addToCart(product, quantity);
                  setIsCartOpen(true);
                }}
                className="btn btn-primary"
                style={{ flex: 1, width: isMobile ? "100%" : "auto", padding: "18px", borderRadius: "14px", fontSize: "1rem", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>
            </div>

            {/* Trust Badges */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                <ShieldCheck size={20} color={product.color} />
                <span style={{ fontSize: "0.7rem", color: "#666" }}>100% Natural</span>
              </div>
              <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                <Truck size={20} color={product.color} />
                <span style={{ fontSize: "0.7rem", color: "#666" }}>Fast Delivery</span>
              </div>
              <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                <Sparkles size={20} color={product.color} />
                <span style={{ fontSize: "0.7rem", color: "#666" }}>Small Batch</span>
              </div>

            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        {product.premium && (
          <div style={{ marginTop: isMobile ? "60px" : "100px" }}>
            <Reviews 
              productName={product.name} 
              color={product.color} 
              reviews={reviews}
              onWriteReview={() => setIsReviewModalOpen(true)}
            />
          </div>
        )}
      </main>
    </div>
  );
}
