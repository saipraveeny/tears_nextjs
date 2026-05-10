"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const Testimonials = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const testimonials = [
    {
      name: "Chef Sarah Chen",
      role: "Executive Chef, Fusion Kitchen",
      rating: 5,
      text: "Tears has transformed our menu. The Wild variant adds incredible depth to our Asian fusion dishes. Our customers can't get enough!",
      avatar: "SC",
    },
    {
      name: "Marcus Rodriguez",
      role: "BBQ Pitmaster",
      rating: 5,
      text: "The Glitch variant is a game-changer for my smoked meats. Complex heat that doesn't overpower the natural flavors. Absolutely incredible.",
      avatar: "MR",
    },
    {
      name: "Dr. Emily Watson",
      role: "Nutritionist",
      rating: 5,
      text: "As a nutritionist, I love recommending Tears to my clients. Clean ingredients, no preservatives, and amazing health benefits. It's a win-win!",
      avatar: "EW",
    },
  ];

  const [items, setItems] = useState(testimonials);
  const [isHovered, setIsHovered] = useState(false);

  const scrollNext = () => {
    setItems((prev) => [...prev.slice(1), prev[0]]);
  };

  const scrollPrev = () => {
    setItems((prev) => [prev[prev.length - 1], ...prev.slice(0, -1)]);
  };

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(scrollNext, 4000);
    return () => clearInterval(interval);
  }, [isHovered, items]);

  const visibleItems = [items[items.length - 1], items[0], items[1]];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={`star ${i < rating ? "filled" : ""}`}
      />
    ));
  };

  return (
    <section className="testimonials" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">
            What <span className="text-gradient">Chefs Say</span>
          </h2>
          <p className="section-subtitle">
            Trusted by culinary professionals and nutritionists worldwide
          </p>
        </motion.div>

        <div 
          className="premium-carousel-container"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button className="carousel-nav-btn prev" onClick={scrollPrev}>
            <ChevronLeft size={24} />
          </button>

          <motion.div 
            className="premium-carousel-track"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, { offset }) => {
              if (offset.x < -50) scrollNext();
              else if (offset.x > 50) scrollPrev();
            }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {visibleItems.map((testimonial, index) => {
                const isActive = index === 1; 
                
                return (
                  <motion.div
                    layout
                    key={testimonial.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: isActive ? 1 : 0.3,
                      scale: isActive ? 1.1 : 0.85,
                      filter: isActive ? 'blur(0px)' : 'blur(8px)',
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`premium-card-wrapper ${isActive ? 'active' : 'inactive'}`}
                    onClick={() => {
                      if (index === 0) scrollPrev();
                      if (index === 2) scrollNext();
                    }}
                  >
                    <div className="testimonial-card glass">
                      <div className="testimonial-header">
                        <div className="testimonial-avatar">{testimonial.avatar}</div>
                        <div className="testimonial-info">
                          <h4 className="testimonial-name">{testimonial.name}</h4>
                          <p className="testimonial-role">{testimonial.role}</p>
                          <div className="testimonial-rating">
                            {renderStars(testimonial.rating)}
                          </div>
                        </div>
                        <Quote className="quote-icon" />
                      </div>
                      <p className="testimonial-text">{testimonial.text}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          <button className="carousel-nav-btn next" onClick={scrollNext}>
            <ChevronRight size={24} />
          </button>
        </div>

        <motion.div
          className="testimonials-cta"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="cta-text">
            Join thousands of satisfied customers and culinary professionals
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
