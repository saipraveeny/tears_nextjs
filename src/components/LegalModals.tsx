"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const LegalModals = () => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | null>(null);

  const closeModal = () => setActiveModal(null);

  const PrivacyPolicy = () => (
    <div className="legal-modal-content">
      <h2>Privacy Policy</h2>
      <p className="effective-date">
        Effective Date: {new Date().toLocaleDateString()}
      </p>

      <section>
        <h3>1. Introduction</h3>
        <p>
          Welcome to Tears Hot Sauces ("Company", "we", "our", or "us"). We
          respect your privacy and are committed to protecting your personal
          information. This Privacy Policy explains how we collect, use, and
          safeguard your information when you visit our website or interact with
          our products and services.
        </p>
        <p>
          By using our website, you agree to the terms of this Privacy Policy.
        </p>
      </section>
      <section>
        <h3>2. Information We Collect</h3>
        <p>We may collect the following types of information:</p>

        <h4>a. Personal Information</h4>
        <p>
          When you contact us, place an order, or sign up for updates, we may
          collect:
        </p>
        <ul>
          <li>Name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Billing and shipping address</li>
        </ul>

        <h4>b. Non-Personal Information</h4>
        <p>When you browse our website, we may collect:</p>
        <ul>
          <li>IP address</li>
          <li>Browser type</li>
          <li>Device information</li>
          <li>
            Cookies and analytics data (through tools like Google Analytics)
          </li>
        </ul>
      </section>

      <section>
        <h3>3. How We Use Your Information</h3>
        <p>We use your information to:</p>
        <ul>
          <li>Process and fulfill your orders</li>
          <li>Communicate about products, offers, and updates</li>
          <li>Improve website performance and user experience</li>
          <li>Comply with legal obligations</li>
        </ul>
        <p>
          We do not sell, rent, or trade your personal information to third
          parties.
        </p>
      </section>

      <section>
        <h3>4. Cookies and Tracking Technologies</h3>
        <p>We use cookies to:</p>
        <ul>
          <li>Improve website functionality</li>
          <li>Analyze site traffic and user behavior</li>
          <li>Personalize user experience</li>
        </ul>
        <p>
          You can disable cookies through your browser settings, but some
          features of the site may not function properly.
        </p>
      </section>

      <section>
        <h3>5. Data Retention</h3>
        <p>We retain personal information only as long as necessary to:</p>
        <ul>
          <li>Fulfill the purpose it was collected for</li>
          <li>Meet legal and regulatory requirements</li>
        </ul>
      </section>

      <section>
        <h3>6. Data Security</h3>
        <p>
          We use industry-standard measures (SSL encryption, secure servers) to
          protect your information. However, no online transmission is 100%
          secure, and you use our services at your own risk.
        </p>
      </section>

      <section>
        <h3>7. Your Rights (Under Indian Law)</h3>
        <p>
          Under the Digital Personal Data Protection Act, 2023, you have the
          right to:
        </p>
        <ul>
          <li>Access, correct, or delete your personal data</li>
          <li>Withdraw consent at any time</li>
          <li>Lodge complaints with the Data Protection Board of India</li>
        </ul>
        <p>To exercise these rights, contact us at: 📧 tearshxd@gmail.com</p>
      </section>

      <section>
        <h3>8. Third-Party Services</h3>
        <p>
          We may use third-party tools (like payment gateways or analytics
          services). These services are governed by their own privacy policies.
          We encourage you to review them before use.
        </p>
      </section>

      <section>
        <h3>9. Updates to This Policy</h3>
        <p>
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page with the updated "Effective Date."
        </p>
      </section>

      <section>
        <h3>10. Contact Us</h3>
        <p>
          If you have questions about this Privacy Policy or our data practices:
        </p>
        <div className="contact-info">
          <p>
            📍 Tears Hot Sauces
            <br />
            Hyderabad, Telangana, India
          </p>
          <p>📧 tearshxd@gmail.com</p>
        </div>
      </section>
    </div>
  );

  const TermsOfService = () => (
    <div className="legal-modal-content">
      <h2>Terms of Service</h2>
      <p className="effective-date">
        Effective Date: {new Date().toLocaleDateString()}
      </p>

      <section>
        <h3>1. Acceptance of Terms</h3>
        <p>
          By accessing or using our website or purchasing our products, you
          agree to be bound by these Terms of Service ("Terms"). If you do not
          agree, please do not use our website.
        </p>
      </section>

      <section>
        <h3>2. Eligibility</h3>
        <p>
          You must be at least 18 years old to make purchases or submit
          information through our website.
        </p>
      </section>

      <section>
        <h3>3. Product Information</h3>
        <p>
          We make every effort to display accurate product details. However:
        </p>
        <ul>
          <li>
            Actual product colors, packaging, or flavor intensity may vary.
          </li>
          <li>
            We reserve the right to discontinue or modify products at any time
            without notice.
          </li>
        </ul>
      </section>

      <section>
        <h3>4. Orders and Payments</h3>
        <ul>
          <li>Orders are subject to availability and acceptance.</li>
          <li>
            Prices are listed in Indian Rupees (₹) and are inclusive/exclusive
            of applicable taxes (as stated).
          </li>
          <li>
            We use secure third-party payment gateways (e.g., Razorpay, Stripe)
            for transactions.
          </li>
        </ul>
      </section>

      <section>
        <h3>5. Shipping and Delivery</h3>
        <ul>
          <li>Orders are shipped within India.</li>
          <li>
            Delivery times may vary depending on location and courier services.
          </li>
          <li>Orders will be delivered within 3-4 business days</li>
          <li>
            We are not liable for delays beyond our control (e.g., courier
            delays, natural calamities).
          </li>
        </ul>
      </section>

      <section>
        <h3>6. Return and Refund Policy</h3>
        <p>
          Due to the nature of food products, we do not accept returns once
          opened. However, refunds or replacements are offered for:
        </p>
        <ul>
          <li>
            Damaged or incorrect items - will be refunding your money within 7-8
            working days{" "}
          </li>
          <li>
            Except for Cash On Delivery transaction, refund, if any, shall be
            made at the same Issuing Bank from where Transaction Price was
            received, or through any other method available on the Platform, as
            chosen by You. Refund will be credited to original payment method
            within 7-8 business days
          </li>
          <li>
            No replacements/return/exchange are accepted for this products.
          </li>
          <li>Defective packaging</li>
        </ul>
        <p>
          Please contact us within 48 hours of delivery with proof
          (images/videos) at
          <strong> tearshxd@gmail.com</strong>.
        </p>
      </section>

      <section>
        <h3>7. Intellectual Property</h3>
        <p>
          All trademarks, logos, content, product names, and website materials
          belong to Tears Hot Sauces. You may not copy, distribute, or reproduce
          any content without prior written permission.
        </p>
      </section>

      <section>
        <h3>8. Limitation of Liability</h3>
        <p>
          Tears Hot Sauces shall not be liable for any indirect, incidental, or
          consequential damages arising from:
        </p>
        <ul>
          <li>Use or inability to use our products or website</li>
          <li>
            Allergic reactions or health effects (please check ingredient lists
            before consumption)
          </li>
        </ul>
      </section>

      <section>
        <h3>9. Governing Law and Jurisdiction</h3>
        <p>
          These Terms shall be governed by and interpreted in accordance with
          the laws of India. Any disputes shall be subject to the exclusive
          jurisdiction of the courts in Hyderabad, Telangana.
        </p>
      </section>

      <section>
        <h3>10. Changes to Terms</h3>
        <p>
          We may update these Terms from time to time. Updates will be posted on
          this page with a new effective date.
        </p>
      </section>

      <section>
        <h3>11. Contact Us</h3>
        <p>For any queries regarding these Terms:</p>
        <div className="contact-info">
          <p>
            📍 TEARS SAUCES PVT LTD
            <br />
            TEARS SAUCES PRIVATE LIMITED, H NO 19-94 A, SARK GARDEN VILLAS, SREE
            NILAYAM, MOKILA , Mokila , Shankarpalle, Rangareddy,
            Telangana-501203
          </p>
          <p>📧 tearshxd@gmail.com</p>
        </div>
      </section>
    </div>
  );

  return (
    <>
      {/* Privacy Policy Link */}
      <button className="legal-link" onClick={() => setActiveModal("privacy")}>
        Privacy Policy
      </button>

      {/* Terms of Service Link */}
      <button className="legal-link" onClick={() => setActiveModal("terms")}>
        Terms of Service
      </button>

      {/* Modal */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            className="legal-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="legal-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="legal-modal-close" onClick={closeModal}>
                <X size={24} />
              </button>

              <div className="legal-modal-body">
                {activeModal === "privacy" && <PrivacyPolicy />}
                {activeModal === "terms" && <TermsOfService />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LegalModals;
