"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

const recipe1 = "/assets/reciepes/1.jpeg";
const recipe2 = "/assets/reciepes/2.jpeg";
const recipe3 = "/assets/reciepes/3.jpeg";
const recipe4 = "/assets/reciepes/4.jpeg";
const recipe5 = "/assets/reciepes/5.jpeg";
const recipe6 = "/assets/reciepes/6.jpeg";

const Recipes = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);

  const recipes = [
    { image: recipe1 },
    { image: recipe2 },
    { image: recipe3 },
    { image: recipe4 },
    { image: recipe5 },
    { image: recipe6 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <section id="recipes" className="recipes">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">
            Premium <span className="text-gradient">Recipes</span>
          </h2>
        </motion.div>

        <motion.div
          className="recipes-gallery"
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {recipes.map((recipe, index) => (
            <motion.div
              key={index}
              className="recipe-image-wrapper"
              variants={imageVariants}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedRecipe(recipe.image)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={recipe.image}
                alt={`Recipe ${index + 1}`}
                className="recipe-gallery-image"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedRecipe && (
          <motion.div
            className="product-modal"
            style={{ zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRecipe(null)}
          >
            <motion.div
              className="modal-content"
              style={{ 
                background: "transparent", 
                border: "none", 
                boxShadow: "none", 
                padding: 0,
                width: "auto",
                maxWidth: "95vw"
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close"
                style={{ top: "-40px", right: "0px", background: "rgba(0,0,0,0.5)", color: "white" }}
                onClick={() => setSelectedRecipe(null)}
              >
                ×
              </button>
              <img
                src={selectedRecipe}
                alt="Zoomed Recipe"
                style={{ 
                  maxHeight: "85vh", 
                  maxWidth: "100%", 
                  borderRadius: "12px",
                  objectFit: "contain"
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Recipes;
