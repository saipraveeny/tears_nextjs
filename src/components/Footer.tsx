"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import LegalModals from "./LegalModals";
import FAQ from "./FAQ";

interface FooterProps {
  logo?: string;
}

const Footer: React.FC<FooterProps> = ({ logo }) => {
  const currentYear = new Date().getFullYear();
  const [isFAQOpen, setIsFAQOpen] = useState(false);

  const footerLinks = {
    products: [
      { name: "Wild (100ml)", href: "#products" },
      { name: "Glitch (100ml)", href: "#products" },
      { name: "Green", href: "#products" },
    ],
    company: [
      { name: "About Us", href: "/about-us" },
      { name: "Our Story", href: "/our-story" },
    ],
    support: [
      { name: "Contact", href: "#contact" },
      { name: "FAQ", href: "#", onClick: () => setIsFAQOpen(true) },
    ],
  };

  const socialLinks = [
    {
      icon: <Instagram size={20} />,
      href: "https://www.instagram.com/tearshxd/",
      label: "Instagram",
    },
  ];

  // Handle link click with onClick if available
  const handleLinkClick = (link: any, event: React.MouseEvent) => {
    if (link.onClick) {
      event.preventDefault();
      link.onClick();
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <motion.div
            className="footer-brand"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="footer-logo">
              {logo ? (
                <img
                  src={logo}
                  alt="Tears Logo"
                  className="logo-img"
                  style={{ height: "2rem", marginRight: "0.5rem" }}
                />
              ) : null}
            </div>
            <p className="footer-tagline">
              Hot Sauce that Heals. Elevate your culinary experience with
              premium, health-conscious sauces.
            </p>
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="social-link"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="footer-links"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="footer-section">
              <h4>Products</h4>
              <ul>
                {footerLinks.products.map((link, index) => (
                  <li key={index}>
                    <a href={link.href}>{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a href={link.href}>{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      onClick={(e) => handleLinkClick(link, e)}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="footer-bottom-content">
            <p>
              &copy; {currentYear} TEARS SAUCES PVT LTD. All rights reserved.
            </p>
            <p>GST : 36AAMCT1318F1ZF</p>
            <div className="footer-legal">
              <LegalModals />
            </div>
          </div>
        </motion.div>
      </div>
      <FAQ isOpen={isFAQOpen} onClose={() => setIsFAQOpen(false)} />
    </footer>
  );
};

export default Footer;
