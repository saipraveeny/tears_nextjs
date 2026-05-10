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

  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // 3 sets for infinite loop
  const displayTestimonials = [...testimonials, ...testimonials, ...testimonials];
  const itemWidth = typeof window !== 'undefined' && window.innerWidth > 768 ? 332 : 292;

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: testimonials.length * itemWidth, behavior: "auto" });
    }
  }, []);

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft } = carouselRef.current;
    
    // Teleport logic
    if (scrollLeft <= 50) {
      carouselRef.current.scrollTo({ left: testimonials.length * itemWidth + scrollLeft, behavior: "auto" });
    } else if (scrollLeft >= (testimonials.length * 2) * itemWidth) {
      carouselRef.current.scrollTo({ left: testimonials.length * itemWidth + (scrollLeft % itemWidth), behavior: "auto" });
    }

    const newIndex = Math.round(scrollLeft / itemWidth) % testimonials.length;
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
            {displayTestimonials.map((testimonial, index) => {
              const isActive = index % testimonials.length === activeIndex;
              const isNext = (index % testimonials.length) === (activeIndex + 1) % testimonials.length;

              return (
                <motion.div
                  key={index}
                  className="snap-item"
                  initial={false}
                >
                  <div className={`testimonial-card glass ${isActive ? 'active' : ''}`}
                       style={{
                         transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                         transform: `scale(${isActive ? 1 : 0.85}) rotateY(${isActive ? 0 : (isNext ? -15 : 15)}deg)`,
                         opacity: isActive ? 1 : 0.5,
                         filter: `blur(${isActive ? 0 : 2}px)`,
                         zIndex: isActive ? 10 : 1
                       }}
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
