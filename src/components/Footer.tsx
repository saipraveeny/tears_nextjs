"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Instagram, ArrowUpRight, Mail, MapPin, Globe } from "lucide-react";
import LegalModals from "./LegalModals";
import FAQ from "./FAQ";

interface FooterProps {
  logo?: string;
}

const Footer: React.FC<FooterProps> = ({ logo }) => {
  const currentYear = new Date().getFullYear();
  const [isFAQOpen, setIsFAQOpen] = useState(false);

  const footerData = {
    collections: [
      { name: "The Wild Edition", href: "#products" },
      { name: "The Glitch Edition", href: "#products" },
      { name: "The Green Edition", href: "#products" },
      { name: "Trio Pack", href: "#products" },
    ],
    merchandise: [
      { name: "Oversized Tees", href: "#merchandise" },
      { name: "Cinematic Hoodies", href: "#merchandise" },
      { name: "Limited Edition Caps", href: "#merchandise" },
    ],
    experience: [
      { name: "Pure Fermentation", href: "#features" },
      { name: "Gut Health Focus", href: "#benefits" },
      { name: "No Preservatives", href: "#features" },
      { name: "Cinematic Stories", href: "/our-story" },
    ],
    support: [
      { name: "Order Tracking", href: "/orders" },
      { name: "Bulk Orders", href: "#contact" },
      { name: "FAQs", href: "#", onClick: () => setIsFAQOpen(true) },
      { name: "Contact Us", href: "#contact" },
    ],
  };

  const handleLinkClick = (link: any, event: React.MouseEvent) => {
    if (link.onClick) {
      event.preventDefault();
      link.onClick();
    }
  };

  return (
    <footer className="cinematic-footer">
      <div className="footer-top-accent" />
      
      <div className="container">
        {/* Giant Brand Mark */}
        <div className="footer-hero-text">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 0.1, y: 0 }}
            transition={{ duration: 1 }}
          >
            TEARS
          </motion.h2>
        </div>

        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-column brand-column">
            <div className="footer-logo-container">
              {logo && <img src={logo} alt="Tears" className="footer-logo-img" />}
            </div>
            <p className="brand-description">
              Crafting premium, health-conscious hot sauces that redefine the culinary landscape. 
              Pure concentration. Zero fat. Infinite flavor.
            </p>
            <div className="footer-contact-info">
              <div className="info-item">
                <Mail size={16} /> <span>hello@tears.in</span>
              </div>
              <div className="info-item">
                <MapPin size={16} /> <span>Hyderabad, India</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="footer-column">
            <h4>Collections</h4>
            <ul className="footer-link-list">
              {footerData.collections.map((link, i) => (
                <li key={i}>
                  <a href={link.href} onClick={(e) => handleLinkClick(link, e)}>
                    {link.name} <ArrowUpRight size={12} className="hover-arrow" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column">
            <h4>Merchandise</h4>
            <ul className="footer-link-list">
              {footerData.merchandise.map((link, i) => (
                <li key={i}>
                  <a href={link.href} onClick={(e) => handleLinkClick(link, e)}>
                    {link.name} <ArrowUpRight size={12} className="hover-arrow" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column">
            <h4>Support</h4>
            <ul className="footer-link-list">
              {footerData.support.map((link, i) => (
                <li key={i}>
                  <a href={link.href} onClick={(e) => handleLinkClick(link, e)}>
                    {link.name} <ArrowUpRight size={12} className="hover-arrow" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter & Socials */}
        <div className="footer-middle">
         
          
          <div className="footer-social-box">
            <a href="https://www.instagram.com/tearshxd/" target="_blank" rel="noreferrer" className="social-pill">
              <Instagram size={24} />
              <span>@tearshxd</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-cinematic">
          <div className="bottom-left">
            <p>&copy; {currentYear} TEARS SAUCES PVT LTD.</p>
            <span className="gst-tag">GST: 36AAMCT1318F1ZF</span>
          </div>
          
          <div className="bottom-right">
            <div className="footer-legal-links">
              <LegalModals />
            </div>
            <div className="global-tag">
              <Globe size={14} /> <span>IND / GLOBAL</span>
            </div>
          </div>
        </div>
      </div>

      <FAQ isOpen={isFAQOpen} onClose={() => setIsFAQOpen(false)} />
    </footer>
  );
};

export default Footer;
