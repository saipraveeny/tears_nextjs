"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, User, Calendar, MessageSquarePlus } from "lucide-react";

export interface Review {
  id: number | string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewsProps {
  productName: string;
  color: string;
  reviews: Review[];
  onWriteReview: () => void;
}

const Reviews: React.FC<ReviewsProps> = ({ productName, color, reviews, onWriteReview }) => {
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="reviews-section" style={{ marginTop: "4rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <h2 style={{ fontSize: "2.5rem", fontWeight: "900", margin: 0 }}>
            Customer <span style={{ color }}>Reviews</span>
          </h2>
          <p style={{ color: "#888", marginTop: "5px" }}>Real feedback from real heat enthusiasts.</p>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ display: "flex", color: "#fbbf24", justifyContent: "flex-end", marginBottom: "4px" }}>
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={20} 
                  fill={i < Math.round(Number(averageRating)) ? "currentColor" : "none"} 
                  stroke="currentColor" 
                />
              ))}
            </div>
            <span style={{ fontWeight: "900", fontSize: "1.5rem" }}>{averageRating}<span style={{ fontSize: "1rem", color: "#555", fontWeight: "400" }}>/5</span></span>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#666" }}>Based on {reviews.length} reviews</p>
          </div>
          
          <button 
            onClick={onWriteReview}
            style={{ 
              padding: "12px 24px", 
              borderRadius: "12px", 
              background: color, 
              color: "#fff", 
              border: "none", 
              fontWeight: "700", 
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center", 
              gap: "8px",
              boxShadow: `0 8px 20px ${color}40`
            }}
          >
            <MessageSquarePlus size={18} /> Write Review
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gap: "1.5rem" }}>
        {reviews.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", background: "rgba(255,255,255,0.02)", borderRadius: "24px", border: "1px dashed rgba(255,255,255,0.1)" }}>
            <p style={{ color: "#555", fontSize: "1.2rem" }}>No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          reviews.slice().reverse().map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-strong"
              style={{ 
                padding: "2rem", 
                borderRadius: "24px", 
                border: `1px solid ${color}10`,
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: color }} />
              
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${color}20` }}>
                    <User size={22} color={color} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontWeight: "700", fontSize: "1.1rem" }}>{review.user}</h4>
                    <div style={{ display: "flex", color: "#fbbf24", gap: "2px", marginTop: "2px" }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" />
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#555", fontSize: "0.85rem", fontWeight: "600" }}>
                  <Calendar size={14} />
                  {review.date}
                </div>
              </div>
              
              <p style={{ margin: 0, color: "#aaa", lineHeight: 1.7, fontSize: "1.05rem", fontStyle: "italic" }}>
                "{review.comment}"
              </p>
            </motion.div>
          ))
        )}
      </div>
      
      {reviews.length > 0 && (
        <button 
          onClick={onWriteReview}
          style={{ 
            marginTop: "2.5rem", 
            width: "100%", 
            padding: "1.2rem", 
            borderRadius: "16px", 
            background: "transparent", 
            border: `2px dashed ${color}30`, 
            color: color, 
            fontWeight: "800",
            cursor: "pointer",
            transition: "all 0.3s",
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = `${color}05`;
            e.currentTarget.style.borderColor = color;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = `${color}30`;
          }}
        >
          Add Your Review
        </button>
      )}
    </div>
  );
};

export default Reviews;
