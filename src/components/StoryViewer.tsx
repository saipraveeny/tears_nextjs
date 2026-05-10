"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import "../components/StoryViewer.css";

// Media asset paths
const video1 = "/assets/videos/1.mp4";
const video2 = "/assets/videos/2.mp4";
const video3 = "/assets/videos/3.mp4";
const image1 = "/assets/images/1.PNG";
const image2 = "/assets/images/2.PNG";
const image3 = "/assets/images/3.PNG";
const image4 = "/assets/images/4.PNG";
const image5 = "/assets/images/5.PNG";
const image6 = "/assets/images/6.PNG";

const StoryViewer = ({ onClose }) => {
  const isOpen = true; // Component is only rendered when open
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // Media items array (video first, then images)
  const mediaItems = [
    { type: "video", src: video1, duration: 30 },
    { type: "video", src: video2, duration: 30 },
    { type: "video", src: video3, duration: 30 },
    { type: "image", src: image1, duration: 5 },
    { type: "image", src: image2, duration: 5 },
    { type: "image", src: image3, duration: 5 },
    { type: "image", src: image4, duration: 5 },
    { type: "image", src: image5, duration: 5 },
    { type: "image", src: image6, duration: 5 },
  ];

  // Handle automatic progression
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    let timer;
    const currentItem = mediaItems[currentIndex];
    const duration = currentItem.duration * 1000;
    let startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        handleNext();
      }
    };

    requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(timer);
    };
    // @ts-ignore
    // eslint-disable-next-line no-use-before-define
  }, [currentIndex, isOpen, isPlaying, mediaItems]);

  // Reset progress when changing items
  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < mediaItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Render progress bars
  const renderProgressBars = () => {
    return (
      <div className="story-progress-container">
        {mediaItems.map((_, index) => (
          <div
            key={index}
            className="story-progress-bar-bg"
            onClick={() => setCurrentIndex(index)}
          >
            <motion.div
              className="story-progress-bar-fill"
              initial={{ width: 0 }}
              animate={{
                width:
                  index === currentIndex
                    ? `${progress}%`
                    : index < currentIndex
                      ? "100%"
                      : "0%",
              }}
              transition={{ ease: "linear" }}
            />
          </div>
        ))}
      </div>
    );
  };

  // Render current media item
  const renderMedia = () => {
    const currentItem = mediaItems[currentIndex];

    if (currentItem.type === "video") {
      return (
        <video
          src={currentItem.src}
          className="story-media"
          autoPlay={isPlaying}
          loop={false}
          muted={false}
          controls={false}
          playsInline
          ref={(el) => {
            if (el) {
              if (isPlaying) {
                el.play();
              } else {
                el.pause();
              }
            }
          }}
        />
      );
    } else {
      return (
        <img
          src={currentItem.src}
          className="story-media"
          alt={`Story ${currentIndex + 1}`}
        />
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="story-viewer-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="story-viewer-container"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 30 }}
          >
            {/* Close button */}
            <button className="story-close-btn" onClick={onClose}>
              <X size={24} />
            </button>

            {/* Progress bars */}
            {renderProgressBars()}

            {/* Media content */}
            <div className="story-content">
              {renderMedia()}

              {/* Navigation controls */}
              <div className="story-controls">
                <button
                  className="story-nav-btn story-prev-btn"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft size={40} />
                </button>

                <button
                  className="story-play-pause-btn"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>

                <button
                  className="story-nav-btn story-next-btn"
                  onClick={handleNext}
                >
                  <ChevronRight size={40} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StoryViewer;
