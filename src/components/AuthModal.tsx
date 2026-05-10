"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, Lock, ArrowLeft, KeyRound, CheckCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE } from '../utils/constants';

const AuthModal = () => {
  const { authModalOpen, closeAuthModal, login } = useAuth();
  
  // 'login' | 'signup' | 'otp' | 'forgot' | 'reset-success'
  const [activeTab, setActiveTab] = useState('login');
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' | 'phone'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Forgot password states
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetCodeSent, setResetCodeSent] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setResetEmail(sessionStorage.getItem('resetEmail') || '');
      setResetCodeSent(sessionStorage.getItem('resetCodeSent') === 'true');
    }
  }, []);

  // Handlers
  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user);
      } else {
        setError(data.error);
      }
    } catch (e) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const endpoint = activeTab === 'signup' ? '/api/auth/signup' : '/api/auth/login';
      const body = activeTab === 'signup' ? { name, identifier: email, password } : { identifier: email, password };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user);
      } else {
        // If signup says account exists, auto-try login with same credentials
        if (activeTab === 'signup' && res.status === 400 && data.error?.toLowerCase().includes('already exists')) {
          const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: email, password }),
            credentials: 'include'
          });
          const loginData = await loginRes.json();
          if (loginRes.ok) {
            login(loginData.user);
          } else {
            setError("Account exists but password doesn't match. Try logging in or use 'Forgot Password'.");
          }
        } else {
          setError(data.error);
        }
      }
    } catch (e) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Auto-prefix +91 for Indian numbers if no country code starts with +
    let formattedPhone = phone.trim();
    if (formattedPhone && !formattedPhone.startsWith('+')) {
      formattedPhone = '+91' + formattedPhone;
      setPhone(formattedPhone);
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        if (data.mockCode) {
          // Dev Mode: Show alert since Twilio is not configured
          alert(`[DEVELOPER MODE] Your OTP is: ${data.mockCode}`);
        }
      } else {
        setError(data.error);
      }
    } catch (e) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otp }),
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user);
      } else {
        setError(data.error);
      }
    } catch (e) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  // --- Forgot Password Handlers ---
  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setResetCodeSent(true);
        sessionStorage.setItem('resetCodeSent', 'true');
        sessionStorage.setItem('resetEmail', resetEmail);
        setSuccessMsg('Reset code sent! Check your email inbox.');
        if (data.devCode) {
          alert(`[DEVELOPER MODE] Your reset code is: ${data.devCode}`);
        }
      } else {
        setError(data.error);
      }
    } catch (e) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, code: resetCode.trim(), newPassword }),
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        // Auto-login on successful reset
        if (data.user) {
          login(data.user);
          sessionStorage.removeItem('resetEmail');
          sessionStorage.removeItem('resetCodeSent');
        } else {
          setActiveTab('reset-success');
          sessionStorage.removeItem('resetEmail');
          sessionStorage.removeItem('resetCodeSent');
        }
      } else {
        setError(data.error);
      }
    } catch (e) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const goToForgotPassword = () => {
    setActiveTab('forgot');
    setError(null);
    setSuccessMsg(null);
    setResetEmail(email || ''); // Pre-fill with login email if available
    setResetCode('');
    setNewPassword('');
    setConfirmPassword('');
    setResetCodeSent(false);
  };

  const goBackToLogin = () => {
    setActiveTab('login');
    setLoginMethod('email');
    setError(null);
    setSuccessMsg(null);
    setResetCodeSent(false);
  };

  // --- Modal title ---
  const getTitle = () => {
    switch (activeTab) {
      case 'signup': return 'Create Account';
      case 'forgot': return 'Reset Password';
      case 'reset-success': return 'Password Updated!';
      default:
        return loginMethod === 'phone' ? 'Login via OTP' : 'Enter the Heat';
    }
  };

  // --- Common input style ---
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '15px 15px 15px 45px',
    background: 'rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    color: '#fff',
    boxSizing: 'border-box',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const inputStylePlain: React.CSSProperties = { ...inputStyle, paddingLeft: 15 };

  const btnStyle: React.CSSProperties = {
    padding: '15px',
    background: '#ff3b30',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: loading ? 'not-allowed' : 'pointer',
    fontWeight: 600,
    fontSize: 16,
    opacity: loading ? 0.7 : 1,
    width: '100%',
  };

  return (
    <AnimatePresence>
      {authModalOpen && (
        <motion.div
          className="faq-overlay"
          style={{ zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="faq-modal glass-strong"
            style={{ maxWidth: 450, width: '100%', padding: '30px', maxHeight: '90vh', overflowY: 'auto' }}
            initial={{ y: 50, scale: 0.95, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 50, scale: 0.95, opacity: 0 }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {!loading && (activeTab === 'forgot' || activeTab === 'reset-success') && (
                  <button
                    onClick={goBackToLogin}
                    style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.7, padding: 0, display: 'flex' }}
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
                <h2 style={{ fontSize: 24, margin: 0, background: 'linear-gradient(45deg, #ff3b30, #ff8a80)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {getTitle()}
                </h2>
              </div>
              {!loading && (
                <button 
                  onClick={closeAuthModal} 
                  style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.7 }}
                >
                  <X size={24} />
                </button>
              )}
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 25 }}>
                <div style={{ position: 'relative', width: 60, height: 60 }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    style={{ 
                      position: 'absolute',
                      width: '100%', 
                      height: '100%', 
                      border: '2px solid rgba(255,59,48,0.1)', 
                      borderTopColor: '#ff3b30', 
                      borderRadius: '50%',
                      boxShadow: '0 0 15px rgba(255, 59, 48, 0.2)'
                    }}
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                    style={{ 
                      position: 'absolute',
                      top: '15%',
                      left: '15%',
                      width: '70%', 
                      height: '70%', 
                      border: '2px solid rgba(255,255,255,0.05)', 
                      borderBottomColor: 'rgba(255,255,255,0.4)', 
                      borderRadius: '50%' 
                    }}
                  />
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{ textAlign: 'center' }}
                >
                  <p style={{ color: '#fff', fontSize: 16, fontWeight: 600, margin: '0 0 5px 0' }}>Authenticating</p>
                  <p style={{ color: '#888', fontSize: 13, margin: 0 }}>Please wait while we secure your session...</p>
                </motion.div>
              </div>
            ) : (
              <>
            {/* Error */}
            {error && (
              <div style={{ padding: '10px 15px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', borderRadius: 8, marginBottom: 20, color: '#fca5a5', fontSize: 14 }}>
                {error}
              </div>
            )}

            {/* Success */}
            {successMsg && (
              <div style={{ padding: '10px 15px', background: 'rgba(52, 199, 89, 0.15)', border: '1px solid rgba(52, 199, 89, 0.4)', borderRadius: 8, marginBottom: 20, color: '#34c759', fontSize: 14 }}>
                {successMsg}
              </div>
            )}

            {/* ========== FORGOT PASSWORD FLOW ========== */}
            {activeTab === 'forgot' && (
              <form onSubmit={resetCodeSent ? handleResetPassword : handleSendResetCode} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                
                {/* Step 1: Enter email */}
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', top: '50%', left: 15, transform: 'translateY(-50%)', opacity: 0.5, color: '#fff' }} />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    disabled={resetCodeSent}
                    style={{ ...inputStyle, opacity: resetCodeSent ? 0.5 : 1 }}
                  />
                </div>

                {/* Step 2: Enter code + new password (shown after code is sent) */}
                {resetCodeSent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 15 }}
                  >
                    <div style={{ position: 'relative' }}>
                      <KeyRound size={18} style={{ position: 'absolute', top: '50%', left: 15, transform: 'translateY(-50%)', opacity: 0.5, color: '#fff' }} />
                      <input
                        type="text"
                        placeholder="6-Digit Reset Code"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value)}
                        maxLength={6}
                        required
                        style={inputStyle}
                        autoFocus
                      />
                    </div>

                    <div style={{ position: 'relative' }}>
                      <Lock size={18} style={{ position: 'absolute', top: '50%', left: 15, transform: 'translateY(-50%)', opacity: 0.5, color: '#fff' }} />
                      <input
                        type="password"
                        placeholder="New Password (min 8 chars)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={8}
                        style={inputStyle}
                      />
                    </div>

                    <div style={{ position: 'relative' }}>
                      <Lock size={18} style={{ position: 'absolute', top: '50%', left: 15, transform: 'translateY(-50%)', opacity: 0.5, color: '#fff' }} />
                      <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={inputStyle}
                      />
                    </div>
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  style={btnStyle}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? 'Processing...' : resetCodeSent ? 'Reset Password' : 'Send Reset Code'}
                </motion.button>

                {resetCodeSent && (
                  <button
                    type="button"
                    onClick={() => { setResetCodeSent(false); setSuccessMsg(null); }}
                    style={{ background: 'transparent', border: 'none', color: '#ff8a80', cursor: 'pointer', fontSize: 13, textAlign: 'center', padding: 5 }}
                  >
                    Didn't receive code? Send again
                  </button>
                )}
              </form>
            )}

            {/* ========== RESET SUCCESS ========== */}
            {activeTab === 'reset-success' && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(52, 199, 89, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '2px solid rgba(52, 199, 89, 0.4)' }}>
                  <CheckCircle size={30} color="#34c759" />
                </div>
                <p style={{ color: '#ccc', fontSize: 15, marginBottom: 20 }}>
                  Your password has been updated successfully. You can now log in with your new password.
                </p>
                <motion.button
                  onClick={goBackToLogin}
                  style={btnStyle}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Back to Login
                </motion.button>
              </div>
            )}

            {/* ========== LOGIN/SIGNUP FLOWS ========== */}
            {(activeTab === 'login' || activeTab === 'signup') && (
              <>
                {/* Method tabs */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                  <button 
                    onClick={() => setLoginMethod('email')}
                    style={{ flex: 1, padding: 10, background: loginMethod === 'email' ? 'rgba(255,255,255,0.1)' : 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, color: '#fff', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    Email / Phone
                  </button>
                  {/* <button 
                    onClick={() => setLoginMethod('phone')}
                    style={{ flex: 1, padding: 10, background: loginMethod === 'phone' ? 'rgba(255,255,255,0.1)' : 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, color: '#fff', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    Phone (OTP)
                  </button> */}
                </div>

                {loginMethod === 'phone' ? (
                  <form onSubmit={otpSent ? handleVerifyOTP : handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                    <div style={{ position: 'relative' }}>
                      <Phone size={18} style={{ position: 'absolute', top: '50%', left: 15, transform: 'translateY(-50%)', opacity: 0.5, color: '#fff' }} />
                      <input
                        type="tel"
                        placeholder="Mobile Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={otpSent}
                        style={inputStyle}
                      />
                    </div>
                    {otpSent && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                        <div style={{ position: 'relative' }}>
                          <Lock size={18} style={{ position: 'absolute', top: '50%', left: 15, transform: 'translateY(-50%)', opacity: 0.5, color: '#fff' }} />
                          <input
                            type="text"
                            placeholder="6-Digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            style={inputStyle}
                          />
                        </div>
                      </motion.div>
                    )}
                    <motion.button 
                      type="submit" 
                      disabled={loading}
                      style={btnStyle}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? 'Processing...' : otpSent ? 'Verify OTP' : 'Send OTP'}
                    </motion.button>
                  </form>
                ) : (
                  <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                    {activeTab === 'signup' && (
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          style={inputStylePlain}
                        />
                      </div>
                    )}
                    <div style={{ position: 'relative' }}>
                      <Mail size={18} style={{ position: 'absolute', top: '50%', left: 15, transform: 'translateY(-50%)', opacity: 0.5, color: '#fff' }} />
                      <input
                        type="text"
                        placeholder="Email Address or Mobile Number"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={inputStyle}
                      />
                    </div>
                    <div style={{ position: 'relative' }}>
                      <Lock size={18} style={{ position: 'absolute', top: '50%', left: 15, transform: 'translateY(-50%)', opacity: 0.5, color: '#fff' }} />
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={inputStyle}
                      />
                    </div>

                    {/* Forgot Password Link — only on login tab */}
                    {activeTab === 'login' && (
                      <div style={{ textAlign: 'right', marginTop: -5 }}>
                        <button
                          type="button"
                          onClick={goToForgotPassword}
                          style={{ background: 'transparent', border: 'none', color: '#ff8a80', cursor: 'pointer', fontSize: 13, padding: 0, fontWeight: 500 }}
                        >
                          Forgot Password?
                        </button>
                      </div>
                    )}

                    <motion.button 
                      type="submit" 
                      disabled={loading}
                      style={btnStyle}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? 'Processing...' : activeTab === 'signup' ? 'Create Account' : 'Sign In'}
                    </motion.button>
                  </form>
                )}

                {/* OR divider */}
                <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', opacity: 0.5 }}>
                  <div style={{ flex: 1, height: 1, background: '#fff' }}></div>
                  <span style={{ margin: '0 10px', fontSize: 12 }}>OR</span>
                  <div style={{ flex: 1, height: 1, background: '#fff' }}></div>
                </div>

                {/* Google Login */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                   <GoogleLogin
                     onSuccess={handleGoogleSuccess}
                     onError={() => setError('Google Login Failed')}
                     theme="filled_black"
                     shape="pill"
                   />
                </div>

                {/* Toggle Login/Signup */}
                <div style={{ marginTop: 25, marginBottom: 20, textAlign: 'center', fontSize: 14, opacity: 0.8 }}>
                  {activeTab === 'login' ? (
                    <span>New to Tears? <button onClick={() => {setActiveTab('signup'); setLoginMethod('email'); setError(null); }} style={{ background: 'none', border: 'none', color: '#ff3b30', fontWeight: 'bold', cursor: 'pointer' }}>Sign up</button></span>
                  ) : (
                    <span>Already have an account? <button onClick={() => { setActiveTab('login'); setLoginMethod('email'); setError(null); }} style={{ background: 'none', border: 'none', color: '#ff3b30', fontWeight: 'bold', cursor: 'pointer' }}>Log in</button></span>
                  )}
                </div>
              </>
            )}
          </>
        )}

        <style>{`
          .faq-modal::-webkit-scrollbar {
            width: 5px;
          }
          .faq-modal::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.2);
          }
          .faq-modal::-webkit-scrollbar-thumb {
            background: rgba(255,59,48,0.5);
            border-radius: 10px;
          }
        `}</style>
      </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
