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
      icon: <Heart className="benefit-icon" />,
      title: "Wellness Beyond Heat",
      description:
        "Packed with antioxidants from real chili peppers and herbs, our sauces support cellular health and immunity.",
      color: "#ff3b30",
    },
    {
      icon: <Shield className="benefit-icon" />,
      title: "Gut-Friendly",
      description:
        "With no emulsifiers or excessive vinegar, our balanced pH and clean spices promote healthy digestion.",
      color: "#ff6b61",
    },
    {
      icon: <Zap className="benefit-icon" />,
      title: "Anti-Inflammatory Properties",
      description:
        "Enjoy the benefits of capsaicin and natural ingredients that reduce internal inflammation.",
      color: "#ff8a80",
    },
    {
      icon: <Leaf className="benefit-icon" />,
      title: "Clean & Natural",
      description:
        "First gourmet hot sauce brand that prioritizes both taste and health benefits.",
      color: "#ffab91",
    },
  ];

  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const extendedBenefits = [...benefits, ...benefits, ...benefits, ...benefits];

  useEffect(() => {
    if (carouselRef.current) {
      const itemWidth = window.innerWidth > 768 ? 332 : 292;
      carouselRef.current.scrollTo({ left: benefits.length * itemWidth, behavior: "auto" });
    }
  }, [benefits.length]);

  const scrollPrev = () => {
    if (carouselRef.current) {
      const itemWidth = window.innerWidth > 768 ? 332 : 292;
      const index = Math.round(carouselRef.current.scrollLeft / itemWidth);
      if (index <= benefits.length) {
          const middleIndex = benefits.length * 2 + (index % benefits.length);
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
      if (index >= benefits.length * 3 - 1) {
          const middleIndex = benefits.length + (index % benefits.length);
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
      const realIndex = newIndex % benefits.length;
      if (realIndex !== activeIndex) {
        setActiveIndex(realIndex);
      }
    };
    
    const el = carouselRef.current;
    if (el) el.addEventListener("scroll", handleScroll);
    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, [activeIndex, benefits.length]);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      scrollNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <section id="benefits" className="benefits" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">
            Health <span className="text-gradient">Benefits</span>
          </h2>
          <p className="section-subtitle">
            More than just heat - experience wellness with every drop
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
            {extendedBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                className={`snap-item benefit-card glass ${index % benefits.length === activeIndex ? 'active' : ''}`}
                onClick={() => {
                  if (index % benefits.length !== activeIndex && carouselRef.current) {
                    const itemWidth = window.innerWidth > 768 ? 332 : 292;
                    carouselRef.current.scrollTo({ left: index * itemWidth, behavior: "smooth" });
                  }
                }}
              >
                <motion.div
                  className="benefit-icon-wrapper"
                  style={{ "--icon-color": benefit.color } as React.CSSProperties}
                >
                  {benefit.icon}
                </motion.div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </motion.div>
            ))}
          </div>

          <button className="carousel-nav-btn next" onClick={scrollNext}>
            <ChevronRight size={24} />
          </button>
        </div>

        <motion.div
          className="benefits-stats"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="stats-grid">
            <div className="stat-item">
              <motion.div
                className="stat-number"
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 1 }}
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
                transition={{ duration: 0.6, delay: 1.2 }}
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
                transition={{ duration: 0.6, delay: 1.4 }}
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
          transition={{ duration: 0.6, delay: 1.6 }}
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
              document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
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
