"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Zap, Leaf, Droplets, Shield, ChevronLeft, ChevronRight } from "lucide-react";

const Features = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: <Zap />,
      title: "Zero Fat",
      description:
        "Enjoy guilt-free indulgence with no oils or unhealthy additives, perfect for modern dietary trends like keto and paleo.",
      color: "#ff3b30",
    },
    {
      icon: <Shield />,
      title: "Zero Preservatives",
      description:
        "Our expert formulation ensures clean-label appeal with naturally preserved ingredients.",
      color: "#ff6b61",
    },
    {
      icon: <Droplets />,
      title: "Zero Water",
      description:
        "Experience intense flavor and longer shelf life with pure ingredient concentration.",
      color: "#ff8a80",
    },
    {
      icon: <Leaf />,
      title: "All-Natural Spice Blends",
      description:
        "Crafted from real chillies, herbs, and spices, our sauces deliver heat and depth without sacrificing quality.",
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
    const gap = 40; // 2.5rem gap
    const index = Math.round(scrollLeft / (cardWidth + gap));
    if (index !== activeIndex && index >= 0 && index < features.length) {
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

  // Sync scroll on mount
  useEffect(() => {
    handleScroll();
  }, []);

  return (
    <section id="features" className="features" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="section-title">
            Why Choose <span className="text-gradient">Tears.</span>
          </h2>
          <p className="section-subtitle">
            Revolutionary hot sauce that prioritizes both taste and health
          </p>
        </motion.div>

        <div className="modern-carousel-section">
          <div 
            className="modern-carousel-track" 
            ref={scrollRef}
            onScroll={handleScroll}
          >
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className={`modern-card-wrapper ${index === activeIndex ? 'active' : ''}`}
                onClick={() => scrollTo(index)}
              >
                <div className="modern-glass-card">
                  <div 
                    className="modern-icon-container"
                    style={{ "--icon-color": feature.color } as any}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="modern-card-title">{feature.title}</h3>
                  <p className="modern-card-description">{feature.description}</p>
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
                aria-label="Previous feature"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                className="modern-nav-btn" 
                onClick={() => scrollTo(activeIndex + 1)}
                disabled={activeIndex === features.length - 1}
                aria-label="Next feature"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>

        <motion.div
          className="features-cta"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p className="cta-text">
            Experience the perfect blend of culinary depth and wellness benefits
          </p>
          <motion.button
            className="btn btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const productsSection = document.getElementById("products");
              if (productsSection) {
                productsSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Discover Our Variants
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
