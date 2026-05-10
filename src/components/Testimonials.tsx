"use client";

import React from "react";
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

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

        <motion.div
          className="carousel-container"
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="carousel-track">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <motion.div
                key={index}
                className="testimonial-card glass"
                style={{ width: "350px", flexShrink: 0 }}
                whileHover={{
                  y: -10,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
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
              </motion.div>
            ))}
          </div>
        </motion.div>

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
