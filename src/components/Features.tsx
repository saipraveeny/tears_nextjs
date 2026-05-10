"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Zap, Leaf, Droplets, Shield } from "lucide-react";

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

        <div className="carousel-container" ref={ref}>
          <div className="carousel-track">
            {[...features, ...features].map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card glass"
                style={{ width: "300px", flexShrink: 0 }}
                whileHover={{
                  y: -10,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
                }}
              >
                <motion.div
                  className="feature-icon-wrapper"
                  style={{ "--icon-color": feature.color } as any}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
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
