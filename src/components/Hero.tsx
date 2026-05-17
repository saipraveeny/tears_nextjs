"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
const heroWild = "/assets/hero_wild.png";
const heroGlitch = "/assets/hero_glitch.png";
const heroGreen = "/assets/green.png";
const heroSpike = "/assets/spike.PNG";
const heroAlt = "/assets/alt.PNG";
import StoryViewer from "./StoryViewer";
import LandingBgSlideshow from "./LandingBgSlideshow";

const heroImages = [
  { src: heroWild, alt: "Wild Variant" },
  { src: heroGlitch, alt: "Glitch Variant" },
  { src: heroGreen, alt: "Green Variant" },
  { src: heroSpike, alt: "Spike Variant" },
  { src: heroAlt, alt: "ALT Variant" },
];

interface HeroProps {
  logo?: string;
}

const Hero: React.FC<HeroProps> = ({ logo }) => {
  const [current, setCurrent] = useState(0);
  const [storyViewerOpen, setStoryViewerOpen] = useState(false);
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="hero">
      <div className="hero-background">
        <LandingBgSlideshow />
        <div className="hero-glow"></div>
        <div className="hero-particles">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      <div className="container" style={{ position: "relative" }}>
        <div className="hero-content">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {logo ? (
                <img
                  src={logo}
                  alt="Tears Logo"
                  className="badge-logo-img"
                  style={{ height: "1.5rem", marginRight: "0.5rem" }}
                />
              ) : null}
              <span>Premium Hot Sauce</span>
            </motion.div>

            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Tears.
              <span className="hero-subtitle">Hot Sauce that Heals</span>
            </motion.h1>

            <motion.div
              className="hero-description"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              We are a natural hot sauce brand dedicated to delivering bold,
              authentic flavors through the traditional art of
              lacto-fermentation. Our mission is to craft clean, premium sauces
              that celebrate seasonality, sustainability, and purity.
            </motion.div>

            {/* Mobile Visual - placed between text and buttons */}
            <motion.div 
              className="hero-mobile-visual"
              style={{ 
                opacity,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%'
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={heroImages[current].src}
                  src={heroImages[current].src}
                  alt={heroImages[current].alt}
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    rotate: 0,
                    y: [0, -10, 0]
                  }}
                  exit={{ opacity: 0, scale: 1.1, rotate: 5 }}
                  transition={{ 
                    opacity: { duration: 0.5 },
                    y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="mobile-product-img"
                />
              </AnimatePresence>
            </motion.div>

            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <motion.button
                className="btn btn-primary hero-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const productsSection = document.getElementById("products");
                  if (productsSection) {
                    productsSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Explore Products
                <ArrowRight size={20} />
              </motion.button>

              <motion.button
                className="btn btn-secondary hero-btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStoryViewerOpen(true)}
              >
                <Play size={20} />
                Watch Story
              </motion.button>
            </motion.div>

            <motion.div
              className="hero-stats"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <div className="stat">
                <span className="stat-number">5</span>
                <span className="stat-label">Bold Variants</span>
              </div>
              <div className="stat">
                <span className="stat-number">0</span>
                <span className="stat-label">Preservatives</span>
              </div>
              <div className="stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">Natural</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Large, right-side, gradient-masked hero image */}
          <motion.div 
            className="hero-visual-side"
            style={{ y: y1, opacity }} // Parallax and Fade effect
          >
            <div className="hero-variant-slider">
              <AnimatePresence mode="wait">
                <motion.img
                  key={heroImages[current].src}
                  src={heroImages[current].src}
                  alt={heroImages[current].alt}
                  className="hero-variant-image"
                  initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    rotate: 0,
                    y: [0, -15, 0], // Floating effect
                  }}
                  exit={{ opacity: 0, scale: 1.1, rotate: 5 }}
                  transition={{ 
                    opacity: { duration: 0.7 },
                    scale: { duration: 0.7 },
                    rotate: { duration: 0.7 },
                    y: { 
                      duration: 4, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }
                  }}
                />
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {storyViewerOpen && (
        <StoryViewer onClose={() => setStoryViewerOpen(false)} />
      )}
    </section>
  );
};

export default Hero;
