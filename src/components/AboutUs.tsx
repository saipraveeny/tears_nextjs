"use client";

import React from "react";
import { motion } from "framer-motion";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <motion.div
        className="about-us-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>About Us</h1>
        <div className="header-underline"></div>
      </motion.div>

      <div className="about-us-content">
        <motion.section
          className="story-section"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2>A Story Born from Flavor, Fire.</h2>
          <p>
            TEARS is a natural hot sauce brand born from the collaboration of
            two culinary professionals who share a deep belief that spice is not
            merely heat it’s emotion, memory, and craft. Every bottle embodies
            their culinary philosophy: pure, seasonal, and created with
            precision and intention.
          </p>
          <p>
            Rooted in a commitment to nature and authenticity, TEARS follows a
            seasonal approach to flavor producing four unique variants each
            season, inspired by the changing climate, harvest cycles, and
            regional ingredients. Across the year, this results in twelve
            exclusive flavors, each celebrating the freshness and individuality
            of its season. To preserve quality and exclusivity, each variant is
            produced in a limited batch of just 1,000 bottles. This ensures not
            only consistent freshness but also a traceable and artisanal
            production process where every batch tells a story of its own. Our
            sauces are 100% natural, crafted without artificial colors,
            stabilizers, or preservatives. Every bottle is made using locally
            sourced ingredients, slow-cooked and balanced to achieve depth,
            aroma, and clean heat.
          </p>
          <p>
            Designed to be versatile and adaptive, TEARS hot sauces complement a
            wide range of culinary applications. They can be used as dips, in
            stir-fries, marinades, salad dressings, glazes, or as coatings for
            fried and grilled dishes adding character to everyday meals and
            elevating fine dining creations alike.
          </p>
          <p>
            At TEARS, we believe in celebrating flavor in its truest form
            honest, bold, and rooted in nature’s rhythm.
          </p>
        </motion.section>

        <motion.div
          className="about-image"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="image-container">
            <div className="image-overlay"></div>
          </div>
        </motion.div>

        <motion.section
          className="craft-section"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2>The Craft Behind the Heat</h2>
          <p>
            At TEARS, we celebrate fermentation as an art form. Using the
            ancient technique of lacto-fermentation, our chilies and produce
            develop complex, layered flavors that are both bold and nuanced.
            Alongside this, select seasonal variants are crafted through gentle
            steaming, preserving their natural sweetness and aroma.
          </p>
          <p>
            We create four variants for every season, resulting in twelve
            limited-edition sauces each year—each crafted in small batches of
            just 1,000 bottles. Every drop captures the season's freshest
            produce, sourced locally to honor the farmers and landscapes that
            shape our flavors.
          </p>
        </motion.section>
      </div>

      <motion.div
        className="about-cta"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <a href="/our-story" className="cta-button">
          Discover Our Story
        </a>
      </motion.div>
    </div>
  );
};

export default AboutUs;
