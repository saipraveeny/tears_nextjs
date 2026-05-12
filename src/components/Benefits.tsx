"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Heart, Shield, Zap, Leaf, ChevronLeft, ChevronRight } from "lucide-react";

const Benefits = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const benefits = [
    {
      icon: <Heart />,
      title: "Wellness Beyond Heat",
      description:
        "Packed with antioxidants from real chili peppers and herbs, our sauces support cellular health and immunity.",
      color: "#ff3b30",
    },
    {
      icon: <Shield />,
      title: "Gut-Friendly",
      description:
        "With no emulsifiers or excessive vinegar, our balanced pH and clean spices promote healthy digestion.",
      color: "#ff6b61",
    },
    {
      icon: <Zap />,
      title: "Anti-Inflammatory",
      description:
        "Enjoy the benefits of capsaicin and natural ingredients that reduce internal inflammation.",
      color: "#ff8a80",
    },
    {
      icon: <Leaf />,
      title: "Clean & Natural",
      description:
        "First gourmet hot sauce brand that prioritizes both taste and health benefits.",
      color: "#ffab91",
    },
  ];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
    setScrollProgress(progress);

    // Calculate active index
    const cardWidth = scrollRef.current.querySelector(".modern-card-wrapper")?.clientWidth || 0;
    const gap = 40;
    const index = Math.round(scrollLeft / (cardWidth + gap));
    if (index !== activeIndex && index >= 0 && index < benefits.length) {
      setActiveIndex(index);
    }
  };

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.querySelector(".modern-card-wrapper")?.clientWidth || 0;
    const gap = 40;
    scrollRef.current.scrollTo({
      left: index * (cardWidth + gap),
      behavior: "smooth"
    });
  };

  useEffect(() => {
    handleScroll();
  }, []);

  return (
    <section id="benefits" className="benefits" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="section-title">
            Health <span className="text-gradient">Benefits</span>
          </h2>
          <p className="section-subtitle">
            More than just heat - experience wellness with every drop
          </p>
        </motion.div>

        <div className="modern-carousel-section">
          <div 
            className="modern-carousel-track" 
            ref={scrollRef}
            onScroll={handleScroll}
          >
            {benefits.map((benefit, index) => (
              <div 
                key={benefit.title}
                className={`modern-card-wrapper ${index === activeIndex ? 'active' : ''}`}
                onClick={() => scrollTo(index)}
              >
                <div className="modern-glass-card">
                  <div 
                    className="modern-icon-container"
                    style={{ "--icon-color": benefit.color } as any}
                  >
                    {benefit.icon}
                  </div>
                  <h3 className="modern-card-title">{benefit.title}</h3>
                  <p className="modern-card-description">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="carousel-controls">
            <div className="modern-progress-bar">
              <div 
                className="modern-progress-fill" 
                style={{ width: `${Math.max(5, scrollProgress)}%` }}
              />
            </div>

            <div className="modern-nav-buttons">
              <button 
                className="modern-nav-btn" 
                onClick={() => scrollTo(activeIndex - 1)}
                disabled={activeIndex === 0}
                aria-label="Previous benefit"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                className="modern-nav-btn" 
                onClick={() => scrollTo(activeIndex + 1)}
                disabled={activeIndex === benefits.length - 1}
                aria-label="Next benefit"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>

        <motion.div
          className="benefits-stats"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="stats-grid">
            <div className="stat-item">
              <motion.div
                className="stat-number"
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                100%
              </motion.div>
              <span className="stat-label">Natural Ingredients</span>
            </div>
            <div className="stat-item">
              <motion.div
                className="stat-number"
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                0
              </motion.div>
              <span className="stat-label">Artificial Additives</span>
            </div>
            <div className="stat-item">
              <motion.div
                className="stat-number"
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                24
              </motion.div>
              <span className="stat-label">Antioxidants</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="benefits-cta"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <p className="cta-text">
            Transform your menu today with Tears - the hot sauce that delivers
            on flavor and health
          </p>
          <motion.button
            className="btn btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Shop Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;
