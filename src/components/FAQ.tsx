"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp, Search, Flame, Zap, Leaf, CheckCircle2, Truck } from 'lucide-react';
import './FAQ.css';

interface FAQProps {
  isOpen: boolean;
  onClose: () => void;
}

const FAQ: React.FC<FAQProps> = ({ isOpen, onClose }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  
  // FAQ data
  const faqData = [
    {
      question: "What makes Tears Hot Sauces different from other hot sauces?",
      answer: "Tears is crafted with zero fat, zero preservatives, and zero water — using only natural, high-quality ingredients. Our sauces are gut-friendly, rich in antioxidants, and made for those who love real spice without compromising health."
    },
    {
      question: "What are the different flavors or variants available?",
      answer: (
        <div className="faq-answer-complex">
          <p>We currently offer three signature flavors:</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
            <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}><Flame size={18} color="#ef4444" /></motion.div>
            <span><strong>Wild</strong> – Bold, earthy, smoky heat perfect for grilled or BBQ dishes.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}><Zap size={18} color="#eab308" /></motion.div>
            <span><strong>Glitch</strong> – A quirky, tangy blend with a modern twist, ideal for burgers, wraps, and sandwiches.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2 }}><Leaf size={18} color="#22c55e" /></motion.div>
            <span><strong>Green</strong> – Fresh blend sauce with hints of coriander and pepper. Fiery and tantalizing on your tongue. Use as marinates or make a dressing — also lip-smacking with fried food.</span>
          </div>
        </div>
      )
    },
    {
      question: "Are your sauces 100% natural?",
      answer: "Yes. Every bottle of Tears Hot Sauce is made with 100% natural ingredients — no artificial colors, preservatives, or flavor enhancers. We use real chilies, herbs, and spices for authentic heat and taste."
    },
    {
      question: "Are your sauces suitable for vegetarians or vegans?",
      answer: (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 10 }}><CheckCircle2 size={18} color="#22c55e" /></motion.div>
          <span>Absolutely!<br/>All Tears sauces are 100% vegetarian and vegan-friendly, containing no animal products, dairy, or gelatin.</span>
        </div>
      )
    },
    {
      question: "Are Tears sauces safe for people with dietary restrictions?",
      answer: "Our sauces contain no gluten, no preservatives, no artificial sugars, and are low in calories and fat-free. However, we recommend checking the ingredient list if you have allergies to specific spices or peppers."
    },
    {
      question: "How spicy are your sauces?",
      answer: "Each variant has a unique spice profile:\n\nWild – Medium heat with smoky undertones\n\nGlitch – Hot and tangy\n\nGreen – Medium-hot with refreshing, herby notes of coriander and pepper\n\nYou can choose based on your spice tolerance or use small portions to build heat gradually."
    },
    {
      question: "How can I use Tears Hot Sauces?",
      answer: "Our sauces are multi-purpose — perfect as:\n\nMarinades for BBQ or grills\n\nDips for fries, wings, and rolls\n\nFlavor enhancers for soups, pastas, or Asian dishes\n\nMixers for spicy cocktails and mocktails\n\nDressings or drizzle sauces for salads and fried food"
    },
    {
      question: "Do Tears Hot Sauces contain vinegar or water?",
      answer: "No. Our recipes are crafted with zero water and minimal natural acids, giving a richer, thicker, and more concentrated flavor that lasts longer and enhances every bite."
    },
    {
      question: "How long does a bottle last after opening?",
      answer: "Each bottle lasts up to 6 months after opening when stored in a cool, dry place or refrigerated. Since there are no preservatives, refrigeration is recommended for freshness."
    },
    {
      question: "Do you deliver across India?",
      answer: (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}><Truck size={18} color="#3b82f6" /></motion.div>
          <span>Yes!<br/>We ship all over India through trusted courier partners. You'll receive a tracking link once your order is dispatched.</span>
        </div>
      )
    },
    {
      question: "How long does delivery take?",
      answer: "Typically, orders are delivered within:\n\n2–5 business days for metro cities\n\n5–8 business days for other regions\n\nDelays may occur due to public holidays or courier issues, but we'll keep you informed throughout."
    },
    {
      question: "What if I receive a damaged or wrong product?",
      answer: "We're sorry if that happens! Please share pictures or a short video of the damaged/incorrect item to tearshxd@gmail.com within 48 hours of delivery. We'll arrange a quick replacement or refund."
    },
    {
      question: "Do you take bulk or B2B orders for restaurants and cafés?",
      answer: "Yes. We partner with cafés, fine-dining restaurants, food chains, and BBQ joints for bulk or customized orders. Email us at tearshxd@gmail.com with your requirements, and our team will get back within 24 hours."
    },
    {
      question: "Do you offer custom heat levels or private-label sauces?",
      answer: "Yes, for B2B collaborations or events, we can create custom spice blends, private labels, or restaurant-exclusive sauces. Reach out via tearshxd@gmail.com to discuss your concept."
    },
    {
      question: "Where can I buy Tears Hot Sauces offline?",
      answer: "We're currently partnering with select cafés, BBQ restaurants, and gourmet stores in Hyderabad. A store locator will be available soon. Stay tuned to our social pages for updates."
    },
    {
      question: "How can I stay updated on new releases or offers?",
      answer: "Follow us on Instagram, Facebook, or X (Twitter) @tearshotsauce, and subscribe to our email list for exclusive discounts, launch updates, and spicy recipes."
    }
  ];

  // Filter FAQs based on search term
  const filteredFAQs = faqData.filter(faq => {
    const questionMatch = faq.question.toLowerCase().includes(searchTerm.toLowerCase());
    const answerMatch = typeof faq.answer === 'string' 
      ? faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      : false; // For JSX answers, we skip text search or rely on question
    return questionMatch || answerMatch;
  });

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Toggle FAQ item
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="faq-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="faq-modal"
            ref={modalRef}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
          >
            <div className="faq-header">
              <h2>Frequently Asked Questions</h2>
              <button className="faq-close-btn" onClick={onClose}>
                <X size={24} />
              </button>
            </div>
            
            <div className="faq-search">
              <Search size={20} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search questions..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="faq-content">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq, index) => (
                  <motion.div 
                    key={index}
                    className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div 
                      className="faq-question"
                      onClick={() => toggleFAQ(index)}
                    >
                      <h3>{faq.question}</h3>
                      {activeIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                    
                    <AnimatePresence>
                      {activeIndex === index && (
                        <motion.div 
                          className="faq-answer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="faq-answer-content">
                            {typeof faq.answer === 'string' ? (
                              <p>
                                {(faq.answer as string).split('\n\n').map((paragraph, i) => (
                                  <React.Fragment key={i}>
                                    {paragraph}
                                    {i < (faq.answer as string).split('\n\n').length - 1 && <br />}
                                  </React.Fragment>
                                ))}
                              </p>
                            ) : (
                              faq.answer
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              ) : (
                <div className="faq-no-results">
                  <p>No results found for "{searchTerm}"</p>
                  <button onClick={() => setSearchTerm('')}>Clear search</button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FAQ;
