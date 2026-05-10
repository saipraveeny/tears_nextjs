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
  
  // 3 sets for a seamless loop
  const displayFeatures = [...features, ...features, ...features];
  const itemWidth = typeof window !== 'undefined' && window.innerWidth > 768 ? 332 : 292;

  useEffect(() => {
    // Start in the middle
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: features.length * itemWidth, behavior: "auto" });
    }
  }, []);

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft } = carouselRef.current;
    
    // Silent teleport
    if (scrollLeft <= 50) {
      carouselRef.current.scrollTo({ left: features.length * itemWidth + scrollLeft, behavior: "auto" });
    } else if (scrollLeft >= (features.length * 2) * itemWidth) {
      carouselRef.current.scrollTo({ left: features.length * itemWidth + (scrollLeft % itemWidth), behavior: "auto" });
    }

    const newIndex = Math.round(scrollLeft / itemWidth) % features.length;
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  const scrollPrev = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -itemWidth, behavior: "smooth" });
    }
  };

  const scrollNext = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: itemWidth, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(scrollNext, 4000);
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
            onScroll={handleScroll}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {displayFeatures.map((feature, index) => {
              const isActive = index % features.length === activeIndex;
              const isPrev = (index % features.length) === (activeIndex - 1 + features.length) % features.length;
              const isNext = (index % features.length) === (activeIndex + 1) % features.length;

              return (
                <motion.div
                  key={index}
                  className="snap-item"
                  initial={false}
                >
                  <div className={`feature-card glass ${isActive ? 'active' : ''}`}
                       style={{
                         transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                         transform: `scale(${isActive ? 1 : 0.85}) rotateY(${isActive ? 0 : (isNext ? -15 : 15)}deg)`,
                         opacity: isActive ? 1 : 0.5,
                         filter: `blur(${isActive ? 0 : 2}px)`,
                         zIndex: isActive ? 10 : 1
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
                  </div>
                </motion.div>
              );
            })}
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
