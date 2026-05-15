"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BenefitStep = ({ benefit, index, progress }: { benefit: any; index: number; progress: any }) => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const xOffset = index % 2 === 0 ? -30 : 30;
  const x = useTransform(progress, [0, 1], [xOffset, -xOffset]);

  return (
    <div className={`wellness-step-modern ${index % 2 === 1 ? 'reverse' : ''}`} ref={ref}>
      <motion.div 
        className="wellness-image-side-modern"
        style={{ x }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <div className="wellness-visual-wrapper">
          <img src={benefit.image} alt={benefit.title} className="wellness-product-img" />
          <div className="wellness-glow-sphere" />
        </div>
      </motion.div>

      <motion.div 
        className="wellness-text-side-modern"
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="wellness-number-overlay">
          <span className="step-num">{index + 1}</span>
        </div>
        <h3 className="wellness-heading">{benefit.title}</h3>
        <p className="wellness-description-text">{benefit.description}</p>
        <div className="wellness-badge-group">
          {benefit.tags.map((tag: string) => (
            <span key={tag} className="wellness-pill">{tag}</span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const Benefits = () => {
  const containerRef = React.useRef(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const benefits = [
    {
      title: "Cellular Longevity",
      description: "Our bio-active capsaicin stimulates micro-circulation, delivering vital nutrients to your cells and supporting systemic longevity.",
      image: "/assets/premium/longevity.png",
      tags: ["Bio-Active", "Longevity", "Pure"],
    },
    {
      title: "Bio-Active Absorption",
      description: "Naturally fermented without harsh vinegars, our sauces nurture a healthy microbiome while delivering complex, multi-layered heat.",
      image: "/assets/premium/absorption.png",
      tags: ["Microbiome", "Gentle Heat", "Natural"],
    },
    {
      title: "Systemic Vitality",
      description: "Harness the thermogenic power of Tears to naturally boost metabolic rate and enhance physical energy levels throughout the day.",
      image: "/assets/premium/vitality.png",
      tags: ["Thermogenic", "Energy", "Focus"],
    },
  ];

  // Auto-scroll logic
  React.useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        const nextScroll = scrollLeft >= maxScroll ? 0 : scrollLeft + clientWidth;
        
        scrollRef.current.scrollTo({
          left: nextScroll,
          behavior: "smooth"
        });
      }
    }, 5000); // 5 seconds reading time for benefits

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const progress = (element.scrollLeft / (element.scrollWidth - element.clientWidth)) * 100;
    setScrollProgress(progress);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth,
        behavior: "smooth"
      });
    }
  };

  return (
    <section id="benefits" className="wellness-journey-modern section-light-accent" ref={containerRef}>
      <div className="container">
        <div className="wellness-header-modern">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="wellness-title-modern">Wellness <span className="text-accent-premium">Defined</span></h2>
          </motion.div>
        </div>

        {/* Benefits Timeline Carousel */}
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
            {benefits.map((benefit, index) => (
              <div key={benefit.title} className="timeline-card-wrapper" style={{ flex: '0 0 100%', maxWidth: '900px' }}>
                <BenefitStep 
                  benefit={benefit} 
                  index={index} 
                  progress={scrollYProgress}
                />
              </div>
            ))}
          </div>
          
          <div className="timeline-progress-bar" style={{ width: '60%', left: '20%' }}>
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

        <motion.div 
          className="wellness-footer-stats"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        >
          <div className="stats-glass-container">
            <div className="stat-box">
              <span className="stat-val">100%</span>
              <span className="stat-lbl">Botanical</span>
            </div>
            <div className="divider-line" />
            <div className="stat-box">
              <span className="stat-val">0</span>
              <span className="stat-lbl">Additives</span>
            </div>
            <div className="divider-line" />
            <div className="stat-box">
              <span className="stat-val">∞</span>
              <span className="stat-lbl">Excellence</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;
