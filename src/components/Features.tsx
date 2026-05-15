"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Sparkles, ShieldCheck, Heart, Wind, ChevronLeft, ChevronRight } from "lucide-react";

const FeatureCard = ({ feature, index }: { feature: any; index: number }) => {
  return (
    <motion.div
      className="premium-feature-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
    >
      <div className="premium-card-blur" />
      <div className="premium-card-content">
        <div className="premium-icon-box">
          <img src={feature.image} alt={feature.title} className="premium-feature-img" />
        </div>
        <h3 className="premium-card-title">{feature.title}</h3>
        <p className="premium-card-desc">{feature.description}</p>
      </div>
      <div className="premium-card-shimmer" />
    </motion.div>
  );
};

const Features = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  const features = [
    {
      image: "/assets/premium/essence.png",
      title: "Pure Essence",
      description: "Zero water dilution. We deliver the absolute concentration of our hand-picked chilies and botanical herbs.",
    },
    {
      image: "/assets/premium/integrity.png",
      title: "Natural Integrity",
      description: "Lacto-fermented for months to achieve natural stability without a single drop of artificial preservatives.",
    },
    {
      image: "/assets/premium/health.png",
      title: "Health First",
      description: "A functional gourmet experience. Zero fat, keto-friendly, and packed with bio-available antioxidants.",
    },
    {
      image: "/assets/premium/dilution.png",
      title: "Zero Dilution",
      description: "No emulsifiers or thickening agents. Just the clean, crisp texture of nature's finest ingredients.",
    },
  ];

  // Auto-scroll logic
  React.useEffect(() => {
    if (!inView || isPaused) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        const nextScroll = scrollLeft >= maxScroll ? 0 : scrollLeft + (scrollWidth / features.length);
        
        scrollRef.current.scrollTo({
          left: nextScroll,
          behavior: "smooth"
        });
      }
    }, 4000); // 4 seconds reading time

    return () => clearInterval(interval);
  }, [inView, isPaused, features.length]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const progress = (element.scrollLeft / (element.scrollWidth - element.clientWidth)) * 100;
    setScrollProgress(progress);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <section id="features" className="premium-features-section" ref={ref}>
      <div className="container">
        <motion.div
          className="premium-header"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <span className="premium-tagline">Crafted for the Connoisseur</span>
          <h2 className="premium-title">The <span className="text-highlight">Tears</span> Standard</h2>
        </motion.div>

        <div 
          className="timeline-carousel-container"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <button className="carousel-nav-btn prev" onClick={() => scroll('left')}>
            <ChevronLeft size={24} />
          </button>
          <button className="carousel-nav-btn next" onClick={() => scroll('right')}>
            <ChevronRight size={24} />
          </button>

          <div className="timeline-track" onScroll={handleScroll} ref={scrollRef}>
            {features.map((feature, index) => (
              <div key={feature.title} className="timeline-card-wrapper">
                <FeatureCard feature={feature} index={index} />
              </div>
            ))}
          </div>
          
          <div className="timeline-progress-bar">
            <div 
              className="timeline-progress-fill" 
              style={{ width: `${scrollProgress}%` }} 
            />
            <div 
              className="timeline-dot" 
              style={{ left: `${scrollProgress}%` }} 
            />
          </div>
        </div>
      </div>

      <div className="premium-bg-accents">
        <div className="accent-circle c1" />
        <div className="accent-circle c2" />
      </div>
    </section>
  );
};

export default Features;
