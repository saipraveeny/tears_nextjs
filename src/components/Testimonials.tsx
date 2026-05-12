"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
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
    if (index !== activeIndex && index >= 0 && index < testimonials.length) {
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

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={18}
        className={`star-modern ${i < rating ? "filled" : ""}`}
      />
    ));
  };

  useEffect(() => {
    handleScroll();
  }, []);

  return (
    <section className="testimonials" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="section-title">
            What <span className="text-gradient">Chefs Say</span>
          </h2>
          <p className="section-subtitle">
            Trusted by culinary professionals and nutritionists worldwide
          </p>
        </motion.div>

        <div className="modern-carousel-section">
          <div 
            className="modern-carousel-track" 
            ref={scrollRef}
            onScroll={handleScroll}
          >
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.name}
                className={`modern-card-wrapper ${index === activeIndex ? 'active' : ''}`}
                onClick={() => scrollTo(index)}
              >
                <div className="modern-glass-card">
                  <Quote className="quote-icon-modern" />
                  
                  <div className="testimonial-header-modern">
                    <div className="avatar-ring">
                      <div className="avatar-inner">
                        {testimonial.avatar}
                      </div>
                    </div>
                    <h4 className="testimonial-name-modern">{testimonial.name}</h4>
                    <p className="testimonial-role-modern">{testimonial.role}</p>
                  </div>

                  <div className="testimonial-rating-modern">
                    {renderStars(testimonial.rating)}
                  </div>

                  <p className="modern-card-description" style={{ fontStyle: 'italic' }}>
                    "{testimonial.text}"
                  </p>
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
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                className="modern-nav-btn" 
                onClick={() => scrollTo(activeIndex + 1)}
                disabled={activeIndex === testimonials.length - 1}
                aria-label="Next testimonial"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>

        <motion.div
          className="testimonials-cta"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
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
