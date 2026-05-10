"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      setSubmitStatus("error");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Using FormSubmit.io - free service that sends form data via email
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("company", formData.company || "Not specified");
      formDataToSend.append("message", formData.message);
      formDataToSend.append(
        "_subject",
        `New Contact Form Submission from ${formData.name}`,
      );
      formDataToSend.append("_replyto", formData.email);
      formDataToSend.append("_next", window.location.href);

      // Send to FormSubmit.io which will forward to tearshxd@gmail.com
      const response = await fetch("https://formsubmit.co/tearshxd@gmail.com", {
        method: "POST",
        body: formDataToSend,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          company: "",
          message: "",
        });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="contact-icon" />,
      title: "Email",
      value: "tearshxd@gmail.com",
      link: "mailto:tearshxd@gmail.com",
    },
    {
      icon: <Phone className="contact-icon" />,
      title: "Phone",
      value: "+91 8897452072",
      link: "tel:+91 8897452072",
    },
    {
      icon: <MapPin className="contact-icon" />,
      title: "Address",
      value: `TEARS SAUCES PRIVATE LIMITED
            ,H NO 19-94 A, SARK GARDEN VILLAS, SREE
            NILAYAM, MOKILA , Mokila , Shankarpalle,
            Rangareddy, Telangana-501203`,
      link: "#",
    },
  ];

  return (
    <section id="contact" className="contact">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">
            Get in <span className="text-gradient">Touch</span>
          </h2>
          <p className="section-subtitle">
            Ready to revolutionize your culinary experience? Let's talk.
          </p>
        </motion.div>

        <div className="contact-content">
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3>Let's Start a Conversation</h3>
            <p>
              Whether you're a restaurant owner, chef, or distributor, we're
              here to help you bring the Tears experience to your customers.
            </p>

            <div className="contact-details">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={index}
                  href={info.link}
                  className="contact-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  whileHover={{ x: 10 }}
                >
                  <div className="contact-icon-wrapper">{info.icon}</div>
                  <div className="contact-text">
                    <h4>{info.title}</h4>
                    <p>{info.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="contact-form-container"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <form className="contact-form glass" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="company">Company / Restaurant</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="form-textarea"
                  placeholder="Tell us about your needs..."
                />
              </div>

              {/* Status Messages */}
              {submitStatus === "success" && (
                <motion.div
                  className="form-success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background:
                      "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
                    color: "white",
                    padding: "1rem",
                    borderRadius: "var(--border-radius)",
                    marginBottom: "1rem",
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 10 }}>
                      <CheckCircle2 size={24} color="#ffffff" />
                    </motion.div>
                    <span>Message sent successfully! We'll get back to you soon.</span>
                  </div>
                </motion.div>
              )}

              {submitStatus === "error" && (
                <motion.div
                  className="form-error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background:
                      "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    color: "white",
                    padding: "1rem",
                    borderRadius: "var(--border-radius)",
                    marginBottom: "1rem",
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <motion.div animate={{ rotate: [0, -10, 10, -10, 10, 0] }} transition={{ duration: 0.5 }}>
                      <AlertCircle size={24} color="#ffffff" />
                    </motion.div>
                    <span>Please fill in all required fields with valid information.</span>
                  </div>
                </motion.div>
              )}

              <motion.button
                type="submit"
                className="btn btn-primary submit-btn"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                style={{
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                }}
              >
                <Send size={20} />
                {isSubmitting ? "Sending..." : "Send Message"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
