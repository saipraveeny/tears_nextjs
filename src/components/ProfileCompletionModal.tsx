"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, X, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ProfileCompletionModal = () => {
  const { currentUser, updateProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [missingField, setMissingField] = useState<'phone' | 'email' | null>(null);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setIsOpen(false);
      return;
    }

    // Determine missing field with robust checks
    const hasEmail = currentUser.email && !currentUser.email.includes('temp_') && currentUser.email.length > 5;
    const hasPhone = currentUser.phone && currentUser.phone.trim().length >= 10;

    let missing: 'phone' | 'email' | null = null;
    
    // Only ask for phone if they have email but no valid phone
    if (hasEmail && !hasPhone) {
      missing = 'phone';
    } 
    // Only ask for email if they have phone but no valid email
    else if (hasPhone && !hasEmail) {
      missing = 'email';
    }

    if (!missing) {
      setIsOpen(false);
      return;
    }

    setMissingField(missing);

    // Regular Intervals logic: Check if shown recently in this session
    const lastShown = sessionStorage.getItem('profile_completion_last_shown');
    const now = Date.now();
    
    // Initial delay of 20 seconds, then every 5 minutes if still not updated
    const delay = lastShown ? 300000 : 20000; 

    const timer = setTimeout(() => {
      const lastShownTime = lastShown ? parseInt(lastShown) : 0;
      if (now - lastShownTime > 300000) { // 5 minutes
        setIsOpen(true);
        sessionStorage.setItem('profile_completion_last_shown', now.toString());
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) return;

    setLoading(true);
    setError('');

    try {
      const data = missingField === 'phone' ? { phone: value } : { email: value };
      const res = await updateProfile(data);
      
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          setSuccess(false);
          setValue('');
        }, 2000);
      } else {
        setError(res.error || 'Update failed. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (!missingField) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="profile-completion-overlay">
          <motion.div 
            className="profile-completion-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <button className="modal-close-btn" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>

            <div className="modal-content-inner">
              <div className="icon-badge">
                {missingField === 'phone' ? <Phone size={32} /> : <Mail size={32} />}
              </div>

              <h2>Complete Your Profile</h2>
              <p>
                {missingField === 'phone' 
                  ? "Help us keep you updated on your orders via WhatsApp and SMS." 
                  : "Enter your email to receive order confirmations and exclusive updates."}
              </p>

              {success ? (
                <motion.div 
                  className="success-feedback"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <CheckCircle size={40} color="#34c759" />
                  <span>Profile Updated!</span>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="input-group">
                    <label>{missingField === 'phone' ? 'Phone Number' : 'Email Address'}</label>
                    <input 
                      type={missingField === 'phone' ? 'tel' : 'email'} 
                      placeholder={missingField === 'phone' ? 'Enter 10-digit number' : 'your@email.com'}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      required
                      autoFocus
                    />
                    {error && <span className="error-text">{error}</span>}
                  </div>

                  <button className="submit-btn" disabled={loading}>
                    {loading ? 'Updating...' : (
                      <>
                        Save Changes <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                  
                  <button type="button" className="skip-btn" onClick={() => setIsOpen(false)}>
                    Maybe Later
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProfileCompletionModal;
