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
  const extendedFeatures = [...features, ...features, ...features, ...features];

  useEffect(() => {
    if (carouselRef.current) {
      const itemWidth = window.innerWidth > 768 ? 332 : 292;
      carouselRef.current.scrollTo({ left: features.length * itemWidth, behavior: "auto" });
    }
  }, [features.length]);

  const scrollPrev = () => {
    if (carouselRef.current) {
      const itemWidth = window.innerWidth > 768 ? 332 : 292;
      const index = Math.round(carouselRef.current.scrollLeft / itemWidth);
      if (index <= features.length) {
          const middleIndex = features.length * 2 + (index % features.length);
          carouselRef.current.scrollTo({ left: middleIndex * itemWidth, behavior: "auto" });
          setTimeout(() => {
            carouselRef.current?.scrollBy({ left: -itemWidth, behavior: "smooth" });
          }, 50);
      } else {
        carouselRef.current.scrollBy({ left: -itemWidth, behavior: "smooth" });
      }
    }
  };

  const scrollNext = () => {
    if (carouselRef.current) {
      const itemWidth = window.innerWidth > 768 ? 332 : 292;
      const index = Math.round(carouselRef.current.scrollLeft / itemWidth);
      if (index >= features.length * 3 - 1) {
          const middleIndex = features.length + (index % features.length);
          carouselRef.current.scrollTo({ left: middleIndex * itemWidth, behavior: "auto" });
          setTimeout(() => {
            carouselRef.current?.scrollBy({ left: itemWidth, behavior: "smooth" });
          }, 50);
      } else {
        carouselRef.current.scrollBy({ left: itemWidth, behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!carouselRef.current) return;
      const { scrollLeft } = carouselRef.current;
      const itemWidth = window.innerWidth > 768 ? 332 : 292;
      const newIndex = Math.round(scrollLeft / itemWidth);
      const realIndex = newIndex % features.length;
      if (realIndex !== activeIndex) {
        setActiveIndex(realIndex);
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
      scrollNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <section id="features" className="features" ref={ref}>
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
            {extendedFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className={`snap-item feature-card glass ${index % features.length === activeIndex ? 'active' : ''}`}
                onClick={() => {
                  if (index % features.length !== activeIndex && carouselRef.current) {
                    const itemWidth = window.innerWidth > 768 ? 332 : 292;
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
