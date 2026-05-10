"use client";

import React from "react";
import { motion } from "framer-motion";
import "./OurStory.css";

const OurStory = () => {
  const chefs = [
    {
      name: "Malladi Sruthvik",
      role: "Co-Founder & Chef",
      bio: "a culinary professional with a Master’s degree from Birmingham University, UK, refined his skills in the high-pressure kitchens of Michelin-starred restaurants, where every detail mattered from the sharpness of the knife to the subtlety of heat. His global exposure shaped a philosophy rooted in balance, integrity, and respect for ingredients, inspiring him to bring fine-dining techniques into everyday flavors.",
    },
    {
      name: "Yadavalli Pavan Prasanth",
      role: "Co-Founder & Chef",
      bio: "on the other hand, found his inspiration closer to home through India’s diverse food cultures and his experiences working across Hyderabad’s dynamic culinary scene and the Andaman & Nicobar Islands. His deep understanding of local produce, spice behavior, and traditional cooking techniques adds an earthy authenticity to the brand’s flavor identity.",
    },
  ];

  return (
    <div className="our-story-container">
      <motion.div
        className="story-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>Our Story</h1>
        <div className="header-underline"></div>
      </motion.div>

      <div className="story-content">
        <motion.section
          className="chefs-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2>The Chefs Behind TEARS</h2>

          <div className="chefs-grid">
            {chefs.map((chef, index) => (
              <motion.div
                key={index}
                className="chef-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
              >
                <div className={`chef-image chef-image-${index + 1}`}>
                  <div className="image-gradient"></div>
                </div>
                <div className="chef-info">
                  <h3>{chef.name}</h3>
                  <span className="chef-role">{chef.role}</span>
                  <p>{chef.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="chefs-footer">
            Together, they blend precision and passion Sruthvik’s technical
            finesse with Pavan’s grounded approach creating a brand that doesn’t
            just make sauces, but crafts experiences. Their shared foundation at
            IHM Shri Shakti continues to guide them, reminding them that true
            flavor isn’t manufactured it’s cultivated, nurtured, and earned.
          </p>
        </motion.section>

        <motion.section
          className="beyond-section"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2>Beyond the Bottle</h2>
          <p>
            TEARS is more than a condiment it’s a culinary companion designed to
            elevate every kind of dish and every kind of cook. Whether it’s a
            home kitchen experiment or a professional chef’s plating, our sauces
            adapt effortlessly, enhancing flavor without overpowering it.
          </p>
          <p>
            Each variant is carefully developed to serve multiple purposes as a
            drizzle, dip, stir-fry base, marinade, or coating embodying
            versatility in every sense. From smoky notes to tangy bursts and
            umami depth, every sauce tells its own story through texture and
            aroma. Our process doesn’t end with flavor, it begins with purpose.
            By using local produce, seasonal fruits, and traditional methods
            like lacto-fermentation and steaming, we ensure that every bottle of
            TEARS is alive with character a living expression of the ingredients
            and the land they come from.
          </p>
          <p>
            Every bottle is a limited batch, made with intent and attention, not
            mass production. We believe that flavor should move people that it
            should have emotion, memory, and depth. That’s what TEARS represents
            a feeling, a craft, and a connection between nature,
            heat, and heart.
          </p>
        </motion.section>
      </div>

      <motion.div
        className="story-cta"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <a href="/about-us" className="cta-button">
          Learn About Us
        </a>
        <a href="/#products" className="cta-button secondary">
          Explore Products
        </a>
      </motion.div>
    </div>
  );
};

export default OurStory;
