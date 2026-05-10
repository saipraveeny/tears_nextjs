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
      icon: <Zap className="feature-icon" />,
      title: "Zero Fat",
      description:
        "Enjoy guilt-free indulgence with no oils or unhealthy additives, perfect for modern dietary trends like keto and paleo.",
      color: "#ff3b30",
    },
    {
      icon: <Shield className="feature-icon" />,
      title: "Zero Preservatives",
      description:
        "Our expert formulation ensures clean-label appeal with naturally preserved ingredients.",
      color: "#ff6b61",
    },
    {
      icon: <Droplets className="feature-icon" />,
      title: "Zero Water",
      description:
        "Experience intense flavor and longer shelf life with pure ingredient concentration.",
      color: "#ff8a80",
    },
    {
      icon: <Leaf className="feature-icon" />,
      title: "All-Natural Spice Blends",
      description:
        "Crafted from real chillies, herbs, and spices, our sauces deliver heat and depth without sacrificing quality.",
      color: "#ffab91",
    },
  ];

  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const scrollPrev = () => {
    if (carouselRef.current) {
      const itemWidth = window.innerWidth > 768 ? 332 : 292;
      carouselRef.current.scrollBy({ left: -itemWidth, behavior: "smooth" });
    }
  };

  const scrollNext = () => {
    if (carouselRef.current) {
      const itemWidth = window.innerWidth > 768 ? 332 : 292;
      carouselRef.current.scrollBy({ left: itemWidth, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!carouselRef.current) return;
      const { scrollLeft } = carouselRef.current;
      const itemWidth = window.innerWidth > 768 ? 300 + 32 : 280 + 16;
      const newIndex = Math.round(scrollLeft / itemWidth);
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < features.length) {
        setActiveIndex(newIndex);
      }
    };
    
    const el = carouselRef.current;
    if (el) el.addEventListener("scroll", handleScroll);
    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, [activeIndex, features.length]);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      if (carouselRef.current) {
        let nextIndex = activeIndex + 1;
        if (nextIndex >= features.length) nextIndex = 0;
        
        const itemWidth = window.innerWidth > 768 ? 300 + 32 : 280 + 16;
        carouselRef.current.scrollTo({
          left: nextIndex * itemWidth,
          behavior: "smooth"
        });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [activeIndex, isHovered, features.length]);

  return (
    <section id="features" className="features">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">
            Why Choose <span className="text-gradient">Tears.</span>
          </h2>
          <p className="section-subtitle">
            Revolutionary hot sauce that prioritizes both taste and health
          </p>
        </motion.div>

        <div className="carousel-wrapper">
          <button className="carousel-nav-btn prev" onClick={scrollPrev}>
            <ChevronLeft size={24} />
          </button>
          
          <div 
            className="snap-carousel" 
            ref={carouselRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`snap-item feature-card glass ${index === activeIndex ? 'active' : ''}`}
                onClick={() => {
                  if (index !== activeIndex && carouselRef.current) {
                    const itemWidth = window.innerWidth > 768 ? 300 + 32 : 280 + 12;
                    carouselRef.current.scrollTo({ left: index * itemWidth, behavior: "smooth" });
                  }
                }}
              >
                <motion.div
                  className="feature-icon-wrapper"
                  style={{ "--icon-color": feature.color } as any}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <button className="carousel-nav-btn next" onClick={scrollNext}>
            <ChevronRight size={24} />
          </button>
        </div>

        <motion.div
          className="features-cta"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
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
