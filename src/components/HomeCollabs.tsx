"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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

  if (loading) return null;
  if (collabs.length === 0) return null;

  // Duplicate items 4 times for seamless continuous marquee loop
  const marqueeItems = [...collabs, ...collabs, ...collabs, ...collabs];

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

        {/* Dynamic Infinite Marquee Scroll (No Boxes, Full Color, Larger Logos) */}
        <div 
          className="home-marquee-container"
          onClick={() => window.location.href = "/collabs"}
        >
          <div className="home-marquee-track">
            {marqueeItems.map((item, index) => (
              <div key={index} className="home-marquee-item">
                <img 
                  src={item.src} 
                  alt={item.name} 
                  className="home-marquee-img" 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Redirection button */}
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
