"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Star, Quote } from "lucide-react";

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

  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!carouselRef.current) return;
      const { scrollLeft } = carouselRef.current;
      const itemWidth = window.innerWidth > 768 ? 300 + 32 : 280 + 16;
      const newIndex = Math.round(scrollLeft / itemWidth);
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < testimonials.length) {
        setActiveIndex(newIndex);
      }
    };
    
    const el = carouselRef.current;
    if (el) el.addEventListener("scroll", handleScroll);
    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, [activeIndex, testimonials.length]);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      if (carouselRef.current) {
        let nextIndex = activeIndex + 1;
        if (nextIndex >= testimonials.length) nextIndex = 0;
        
        const itemWidth = window.innerWidth > 768 ? 300 + 32 : 280 + 16;
        carouselRef.current.scrollTo({
          left: nextIndex * itemWidth,
          behavior: "smooth"
        });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [activeIndex, isHovered, testimonials.length]);

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
    <section className="testimonials">
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
          className="snap-carousel" 
          ref={carouselRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className={`snap-item testimonial-card glass ${index === activeIndex ? 'active' : ''}`}
            >
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
            </motion.div>
          ))}
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
