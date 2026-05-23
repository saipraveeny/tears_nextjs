"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Flame, ShieldAlert, Sparkles } from "lucide-react";
import "./Collabs.css";

interface Collab {
  name: string;
  src: string;
}

export default function Collabs() {
  const [collabs, setCollabs] = useState<Collab[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/collabs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCollabs(data.collabs);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load collabs:", err);
        setLoading(false);
      });
  }, []);

  const getCollabDetails = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("casa") || lower.includes("loco")) {
      return {
        tag: "Limited Batch",
        desc: "A fiery collaboration with Casa Loco, bringing authentic, smoke-kissed Mexican culinary heat to our premium sauce line.",
        themeColor: "#ff3b30"
      };
    }
    if (lower.includes("enugu")) {
      return {
        tag: "Street Fusion",
        desc: "Spicing up the legendary Enugu street-food experience with Tears' signature slow-burn mango-chili infusions.",
        themeColor: "#FFB300"
      };
    }
    if (lower.includes("kipling")) {
      return {
        tag: "Bistro Edition",
        desc: "Partnering with Kipling's premium bistro to deliver a sophisticated, amla-forward culinary sauce masterpiece.",
        themeColor: "#8B9B17"
      };
    }
    return {
      tag: "Collab Edition",
      desc: `A premium culinary collaboration with ${name}, pushing the boundaries of craft flavor and creative heat.`,
      themeColor: "#ff00ff"
    };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  // Duplicate items for a seamless marquee loop
  const marqueeItems = [...collabs, ...collabs, ...collabs, ...collabs];

  return (
    <div className="collabs-container">
      {/* Header */}
      <div className="collabs-header">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255, 59, 48, 0.1)", border: "1px solid rgba(255, 59, 48, 0.2)", padding: "6px 16px", borderRadius: "100px", color: "#ff3b30", fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px" }}
        >
          <Sparkles size={14} /> Custom Collaborations
        </motion.div>
        <motion.h1 
          className="collabs-title"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Tears Collaborations
        </motion.h1>
        <motion.p 
          className="collabs-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Partnering with world-class restaurants, street-food legends, and culinary creators to craft unforgettable, limited-run flavor profiles.
        </motion.p>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            style={{ width: "40px", height: "40px", border: "3px solid rgba(255,59,48,0.1)", borderTopColor: "#ff3b30", borderRadius: "50%" }}
          />
        </div>
      ) : (
        <>
          {/* Marquee Slider */}
          {collabs.length > 0 && (
            <div className="marquee-container">
              <div className="marquee-track">
                {marqueeItems.map((item, index) => (
                  <div key={index} className="marquee-item">
                    <img src={item.src} alt={item.name} className="marquee-img" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Collabs Cards Grid */}
          <motion.div 
            className="collabs-grid"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {collabs.map((collab) => {
              const details = getCollabDetails(collab.name);
              return (
                <motion.div 
                  key={collab.name}
                  className="collab-card"
                  variants={cardVariants}
                  whileHover={{ 
                    y: -10,
                    boxShadow: `0 20px 40px rgba(0, 0, 0, 0.6), 0 0 20px ${details.themeColor}1a`
                  }}
                  style={{
                    border: `1px solid rgba(255, 255, 255, 0.05)`
                  }}
                >
                  <div className="collab-logo-wrapper">
                    <motion.img 
                      src={collab.src} 
                      alt={collab.name} 
                      className="collab-logo"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className="collab-tag" style={{ color: details.themeColor, background: `${details.themeColor}10`, borderColor: `${details.themeColor}30` }}>
                    {details.tag}
                  </span>
                  <h2 className="collab-name">{collab.name}</h2>
                  <p className="collab-desc">{details.desc}</p>
                  
                  <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                    <motion.div 
                      style={{ color: details.themeColor, display: "flex", alignItems: "center", gap: "4px", fontSize: "0.85rem", fontWeight: "700" }}
                      whileHover={{ x: 3 }}
                    >
                      View Partnership <ArrowUpRight size={14} />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </>
      )}

      {/* CTA Section */}
      <motion.div 
        className="collabs-cta"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h3>Want to collaborate?</h3>
        <p>
          We are always looking to partner with brands, chefs, and tastemakers who share our passion for premium, mind-bending flavors. Let's create something unforgettable together.
        </p>
        <button 
          className="cta-button"
          onClick={() => window.location.href = "/partner"}
        >
          Pitch a Collaboration
        </button>
      </motion.div>
    </div>
  );
}
