"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, MessageSquare, Phone, Clock, Send, CheckCircle2, ArrowRight, Building, Coffee, Hotel, ChevronDown } from "lucide-react";
import { API_BASE } from "../utils/constants";

const BUSINESS_TYPES = ["Restaurant", "Cafe", "Hotel", "Resort", "Distribution", "Other"];

const PartnerWithUs = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "Restaurant",
    contactName: "",
    contactNumber: "",
    email: "",
    message: "",
    bestTime: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    console.log("Submitting to:", `${API_BASE}/api/partner`);

    try {
      const response = await fetch(`${API_BASE}/api/partner`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        mode: 'cors',
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to submit inquiry");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again later.");
      console.error("Inquiry Error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a", padding: "20px" }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-strong"
          style={{ padding: "60px 40px", borderRadius: "32px", textAlign: "center", maxWidth: "600px", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div style={{ width: "100px", height: "100px", background: "rgba(255,59,48,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 30px", color: "#ff3b30" }}>
            <CheckCircle2 size={60} />
          </div>
          <h2 style={{ fontSize: "40px", fontWeight: "900", marginBottom: "20px", color: "#fff", fontFamily: 'Outfit' }}>Proposal Received</h2>
          <p style={{ color: "#888", fontSize: "18px", lineHeight: "1.6", marginBottom: "40px" }}>
            Thank you for your interest in partnering with TEARS. Our B2B partnership team will review your details and reach out to you within 24-48 hours.
          </p>
          <button className="btn btn-primary" onClick={() => window.location.href = "/"} style={{ width: "100%", padding: "18px", fontSize: "18px" }}>Return to Home</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", paddingTop: "120px", paddingBottom: "100px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "inline-block", background: "rgba(255,59,48,0.1)", color: "#ff3b30", padding: "8px 20px", borderRadius: "50px", fontSize: "14px", fontWeight: "800", letterSpacing: "2px", marginBottom: "20px", textTransform: "uppercase" }}
          >
            B2B & Partnerships
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: "clamp(40px, 8vw, 72px)", fontWeight: "900", letterSpacing: "-3px", marginBottom: "20px", lineHeight: "0.9", fontFamily: 'Outfit' }}
          >
            SCALE THE <span style={{ color: "#ff3b30" }}>HEAT</span> <br/>WITH TEARS.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: "20px", color: "#888", maxWidth: "700px", margin: "0 auto", lineHeight: "1.6" }}
          >
            Join our network of premium restaurants, hotels, and cafes. Elevate your menu with the world's most cinematic hot sauce.
          </motion.p>
        </div>

        <div className="partner-grid" style={{ display: "grid", gap: "40px", alignItems: "start" }}>
          {/* Info Side */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="glass-strong" style={{ padding: "40px", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <h2 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "40px", fontFamily: 'Outfit' }}>Why Partner with us?</h2>
              
              <div style={{ display: "grid", gap: "30px" }}>
                {[
                  { icon: <Building size={24} />, title: "Premium Supply", desc: "Reliable, high-volume supply chain for your establishment." },
                  { icon: <Coffee size={24} />, title: "Custom Blends", desc: "Co-create exclusive flavors tailored for your signature dishes." },
                  { icon: <CheckCircle2 size={24} />, title: "Brand Synergy", desc: "Leverage the TEARS cinematic brand to attract spice enthusiasts." }
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "20px" }}>
                    <div style={{ width: "50px", height: "50px", background: "rgba(255,59,48,0.1)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: "#ff3b30", flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 style={{ margin: "0 0 5px 0", fontSize: "18px", fontWeight: "700" }}>{item.title}</h4>
                      <p style={{ margin: 0, color: "#888", fontSize: "14px", lineHeight: "1.5" }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "60px", padding: "30px", background: "#000", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <p style={{ margin: 0, fontSize: "14px", color: "#888", fontStyle: "italic" }}>
                  "Integrating TEARS into our signature wings was the best decision we made this season. Our customers can't get enough of the cinematic heat."
                </p>
                <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#333" }} />
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "700" }}>Marco Rossi</div>
                    <div style={{ fontSize: "12px", color: "#555" }}>Executive Chef, The Firehouse</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "25px" }}>
              <div className="partner-form-grid" style={{ display: "grid", gap: "25px" }}>
                <div className="form-group">
                  <label style={{ display: "block", color: "#888", fontSize: "12px", textTransform: "uppercase", fontWeight: "700", marginBottom: "10px", letterSpacing: "1px" }}>Establishment Name</label>
                  <input 
                    required
                    placeholder="e.g. Red Velvet Cafe"
                    value={formData.businessName}
                    onChange={e => setFormData({...formData, businessName: e.target.value})}
                    style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", padding: "18px", borderRadius: "16px", color: "#fff", fontSize: "16px", boxSizing: "border-box" }}
                  />
                </div>
                <div className="form-group" style={{ position: "relative" }} ref={dropdownRef}>
                  <label style={{ display: "block", color: "#888", fontSize: "12px", textTransform: "uppercase", fontWeight: "700", marginBottom: "10px", letterSpacing: "1px" }}>Business Type</label>
                  <div 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", padding: "18px", borderRadius: "16px", color: "#fff", fontSize: "16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", boxSizing: "border-box" }}
                  >
                    {formData.businessType}
                    <motion.div animate={{ rotate: isDropdownOpen ? 180 : 0 }}><ChevronDown size={18} /></motion.div>
                  </div>
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", marginTop: "10px", zIndex: 100, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
                      >
                        {BUSINESS_TYPES.map((type) => (
                          <div 
                            key={type}
                            onClick={() => { setFormData({...formData, businessType: type}); setIsDropdownOpen(false); }}
                            style={{ padding: "15px 20px", cursor: "pointer", color: formData.businessType === type ? "#ff3b30" : "#fff", background: formData.businessType === type ? "rgba(255,59,48,0.1)" : "transparent", transition: "all 0.2s" }}
                            onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.05)"}
                            onMouseLeave={(e) => e.target.style.background = formData.businessType === type ? "rgba(255,59,48,0.1)" : "transparent"}
                          >
                            {type}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="partner-form-grid" style={{ display: "grid", gap: "25px" }}>
                <div className="form-group">
                  <label style={{ display: "block", color: "#888", fontSize: "12px", textTransform: "uppercase", fontWeight: "700", marginBottom: "10px", letterSpacing: "1px" }}>Contact Person</label>
                  <input 
                    required
                    placeholder="Full Name"
                    value={formData.contactName}
                    onChange={e => setFormData({...formData, contactName: e.target.value})}
                    style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", padding: "18px", borderRadius: "16px", color: "#fff", fontSize: "16px", boxSizing: "border-box" }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ display: "block", color: "#888", fontSize: "12px", textTransform: "uppercase", fontWeight: "700", marginBottom: "10px", letterSpacing: "1px" }}>Contact Number</label>
                  <input 
                    required
                    placeholder="+91 98765 43210"
                    value={formData.contactNumber}
                    onChange={e => setFormData({...formData, contactNumber: e.target.value})}
                    style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", padding: "18px", borderRadius: "16px", color: "#fff", fontSize: "16px", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label style={{ display: "block", color: "#888", fontSize: "12px", textTransform: "uppercase", fontWeight: "700", marginBottom: "10px", letterSpacing: "1px" }}>Work Email Address</label>
                <input 
                  required
                  type="email"
                  placeholder="name@business.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", padding: "18px", borderRadius: "16px", color: "#fff", fontSize: "16px" }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: "block", color: "#888", fontSize: "12px", textTransform: "uppercase", fontWeight: "700", marginBottom: "10px", letterSpacing: "1px" }}>Collaboration Details</label>
                <textarea 
                  required
                  placeholder="Tell us about your business and how you'd like to collaborate..."
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", padding: "18px", borderRadius: "16px", color: "#fff", fontSize: "16px", resize: "none", boxSizing: "border-box" }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: "block", color: "#888", fontSize: "12px", textTransform: "uppercase", fontWeight: "700", marginBottom: "10px", letterSpacing: "1px" }}>Best Time to Connect (Optional)</label>
                <input 
                  placeholder="e.g. Weekdays, 2 PM - 5 PM"
                  value={formData.bestTime}
                  onChange={e => setFormData({...formData, bestTime: e.target.value})}
                  style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", padding: "18px", borderRadius: "16px", color: "#fff", fontSize: "16px" }}
                />
              </div>

              {error && <div style={{ color: "#ff3b30", fontSize: "14px", fontWeight: "600" }}>{error}</div>}

              <motion.button 
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-primary"
                style={{ width: "100%", padding: "20px", borderRadius: "16px", fontSize: "18px", fontWeight: "900", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginTop: "10px" }}
              >
                {submitting ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: "20px", height: "20px", border: "3px solid #fff", borderTopColor: "transparent", borderRadius: "50%" }} />
                ) : <>Submit Partnership Proposal <ArrowRight size={20} /></>}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
      <style>{`
        .partner-grid { grid-template-columns: 1fr 1.2fr; }
        .partner-form-grid { grid-template-columns: 1fr 1fr; }
        @media (max-width: 900px) {
          .partner-grid { grid-template-columns: 1fr; }
          .partner-form-grid { grid-template-columns: 1fr; }
          .partner-header h1 { font-size: 48px !important; }
        }
        input, textarea { box-sizing: border-box; }
      `}</style>
    </div>
  );
};

export default PartnerWithUs;
