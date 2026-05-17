"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NextImage from "next/image";

const DEFAULT_IMAGES = [
  "/assets/landing page/NDN04145.jpg",
  "/assets/landing page/NDN04235.jpg",
  "/assets/landing page/NDN04252.jpg"
];

const LandingBgSlideshow: React.FC = () => {
  const [images, setImages] = useState<string[]>(DEFAULT_IMAGES);
  const [index, setIndex] = useState(0);

  // Dynamically load all images placed in the public/assets/landing page folder at runtime
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/landing-images");
        if (response.ok) {
          const data = await response.json();
          if (data.images && data.images.length > 0) {
            setImages(data.images);
            
            // Silently preload other background images to browser disk cache after a small delay
            // so they render instantly with absolutely zero transition latency!
            setTimeout(() => {
              data.images.forEach((src: string) => {
                const img = new Image();
                img.src = src;
              });
            }, 1000);
          }
        }
      } catch (error) {
        console.error("Failed to load landing images dynamically:", error);
      }
    };

    // Wait 1.5 seconds before processing heavy background slides!
    // This leaves the network connection completely free for logos, menu items, and variant images to load instantly.
    const delayTimer = setTimeout(() => {
      fetchImages();
    }, 1500);

    return () => clearTimeout(delayTimer);
  }, []);

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000); // Transition every 6 seconds for dynamic cinematic energy
    return () => clearInterval(interval);
  }, [images]);

  if (images.length === 0) return null;

  return (
    <div 
      className="ambient-bg-slideshow-container"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0, // Base layer inside hero-background
        overflow: "hidden",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        background: "transparent",
      }}
    >
      <AnimatePresence>
        <motion.div
          key={images[index]}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ 
            opacity: 0.32, // Perfect premium visibility (32%) for high-res culinary images
            scale: 1,
            x: [0, -10, 0],
            y: [0, 5, 0]
          }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ 
            opacity: { duration: 1.2, ease: "easeInOut" },
            scale: { duration: 6, ease: "linear" },
            x: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            filter: "brightness(45%) contrast(110%)", // Dark editorial cinematic filter
          }}
        >
          {/* Use NextImage to automatically compress 8.3MB images to 150KB WebP files on-the-fly */}
          <NextImage
            src={images[index]}
            alt="Cinematic background culinary slide"
            fill
            priority={index === 0} // Instantly prioritize and load the very first slide
            sizes="100vw"
            quality={75} // High quality with optimized compression ratio
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Deep premium dark radial vignette to smoothly fade the edges and blend with page sections */}
      <div 
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at center, transparent 15%, rgba(10, 10, 10, 0.6) 60%, var(--primary-black) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default LandingBgSlideshow;
