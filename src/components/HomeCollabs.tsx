"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Flame } from "lucide-react";
import "./HomeCollabs.css";

interface Collab {
  name: string;
  src: string;
}

export default function HomeCollabs() {
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
        console.error("Failed to load collabs for home:", err);
        setLoading(false);
      });
  }, []);

  const getThemeColor = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("casa") || lower.includes("loco")) return "#ff3b30";
    if (lower.includes("enugu")) return "#FFB300";
    if (lower.includes("kipling")) return "#8B9B17";
    return "#ff00ff";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  if (loading) return null;
  if (collabs.length === 0) return null;

  return (
    <section className="home-collabs-section">
      <div className="home-collabs-container">
        {/* Header */}
        <div className="home-collabs-header">
          <span className="home-collabs-tag">Tears Network</span>
          <h2 className="home-collabs-title">Exclusive Collaborations</h2>
          <p className="home-collabs-subtitle">
            Crafting unique, limited-batch flavor infusions with elite culinary chefs, bistros, and culinary creators.
          </p>
        </div>

        {/* Different UX style: dynamic flex grid list of logos with individual spring hover spotlights */}
        <motion.div 
          className="home-collabs-showcase"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {collabs.map((collab) => {
            const glowColor = getThemeColor(collab.name);
            return (
              <motion.div
                key={collab.name}
                className="home-collab-logo-card"
                variants={cardVariants}
                onClick={() => window.location.href = "/collabs"}
                whileHover={{
                  y: -5,
                  borderColor: `${glowColor}60`,
                  boxShadow: `0 15px 30px rgba(0, 0, 0, 0.4), 0 0 15px ${glowColor}20`
                }}
              >
                <img src={collab.src} alt={collab.name} className="home-collab-img" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Redirection link */}
        <div className="home-collabs-btn-wrapper">
          <motion.button
            className="home-collabs-btn"
            onClick={() => window.location.href = "/collabs"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Collaborations <ArrowRight size={16} />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
