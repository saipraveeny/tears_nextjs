"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { computeCartTotals, formatCurrency } from "../utils/cartUtils";
import { PAYMENT_METHODS } from "../utils/constants";
import { MapPin, CreditCard, Wallet, Home, Briefcase, Plus, CheckCircle2 } from "lucide-react";

const CheckoutPage = ({
  currentUser,
  cart,
  checkoutForm,
  formErrors,
  submitting,
  orderSuccess,
  onFormChange,
  onInputKeyDown,
  onSubmit,
}) => {
  const { total, discountAmount } = computeCartTotals(cart);
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);

  const handleSelectAddress = (addr) => {
    onFormChange("address", addr.street);
    onFormChange("city", addr.city);
    onFormChange("state", addr.state);
    onFormChange("pincode", addr.pincode);
    setShowSavedAddresses(false);
  };

  if (orderSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="checkout-page" 
        style={{ padding: "100px 20px", display: "flex", justifyContent: "center" }}
      >
        <div className="glass-strong" style={{ padding: "40px", borderRadius: "24px", textAlign: "center", maxWidth: "500px", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ width: "80px", height: "80px", background: "rgba(76,217,100,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "#4cd964" }}>
            <CheckCircle2 size={48} />
          </div>
          <h2 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "10px" }}>Order Confirmed!</h2>
          <p style={{ color: "#888", marginBottom: "30px" }}>Your tears are on their way. Get ready for the heat!</p>
          
          <div style={{ background: "rgba(255,255,255,0.05)", padding: "20px", borderRadius: "16px", marginBottom: "30px", textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ color: "#888" }}>Order ID:</span>
              <span style={{ fontWeight: "600" }}>#{orderSuccess.id}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#888" }}>Total Paid:</span>
              <span style={{ fontWeight: "800", color: "#ff3b30" }}>{formatCurrency(orderSuccess.total)}</span>
            </div>
          </div>
          
          <button className="btn btn-primary" onClick={() => window.location.href = "/"} style={{ width: "100%" }}>Return Home</button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="checkout-page" style={{ padding: "100px 20px 60px", minHeight: "100vh", background: "#0a0a0a" }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: "1000px", margin: "0 auto" }}
      >
        <div className="checkout-header" style={{ marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
          <h1 style={{ color: "#fff", fontSize: "clamp(28px, 5vw, 36px)", fontWeight: "900", margin: 0, letterSpacing: "-1.5px" }}>Secure Checkout</h1>
          <button className="btn btn-secondary" onClick={() => window.history.back()}>Continue Shopping</button>
        </div>

        <div className="checkout-layout" style={{ gap: "40px" }}>
          {/* Form Section */}
          <div className="checkout-form-section">
            <form onSubmit={onSubmit}>
              <div className="glass-strong" style={{ padding: "30px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "30px" }}>
                <h3 style={{ color: "#fff", marginTop: 0, marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <MapPin size={20} color="#ff3b30" /> Shipping Details
                </h3>

                {currentUser && currentUser.addresses?.length > 0 && (
                  <div style={{ marginBottom: "25px" }}>
                    <button 
                      type="button"
                      onClick={() => setShowSavedAddresses(!showSavedAddresses)}
                      style={{ background: "rgba(255,59,48,0.1)", color: "#ff3b30", border: "1px solid rgba(255,59,48,0.2)", padding: "10px 20px", borderRadius: "12px", cursor: "pointer", fontWeight: "600", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}
                    >
                      {showSavedAddresses ? "Hide Saved Addresses" : "Use Saved Address"}
                    </button>
                    
                    <AnimatePresence>
                      {showSavedAddresses && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          style={{ overflow: "hidden", marginTop: "15px" }}
                        >
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
                            {currentUser.addresses.map((addr, i) => (
                              <motion.div 
                                key={i}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSelectAddress(addr)}
                                style={{ padding: "15px", borderRadius: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", cursor: "pointer", transition: "all 0.2s" }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                                  {addr.tag === "Home" && <Home size={14} color="#ff3b30" />}
                                  {addr.tag === "Work" && <Briefcase size={14} color="#ff3b30" />}
                                  {addr.tag !== "Home" && addr.tag !== "Work" && <MapPin size={14} color="#ff3b30" />}
                                  <span style={{ fontWeight: "700", fontSize: "12px", textTransform: "uppercase" }}>{addr.tag}</span>
                                </div>
                                <p style={{ fontSize: "12px", color: "#888", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{addr.street}</p>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                <div className="checkout-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
                  <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", color: "#888", fontSize: "13px", marginBottom: "8px" }}>Full Name</label>
                    <input 
                      value={checkoutForm.name}
                      onChange={(e) => onFormChange("name", e.target.value)}
                      required
                      placeholder="John Doe"
                      className="form-input"
                      style={{ width: "100%", padding: "14px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", boxSizing: "border-box", fontSize: "15px" }}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ display: "block", color: "#888", fontSize: "13px", marginBottom: "8px" }}>Phone</label>
                    <div style={{ display: "flex" }}>
                      <span style={{ display: "flex", alignItems: "center", padding: "0 15px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRight: "none", borderRadius: "12px 0 0 12px", color: "#888", fontSize: "14px" }}>+91</span>
                      <input 
                        value={checkoutForm.phone}
                        onChange={(e) => onFormChange("phone", e.target.value.replace(/\D/g, '').slice(0, 10))}
                        required
                        placeholder="98765 43210"
                        className="form-input"
                        style={{ width: "100%", padding: "14px", borderRadius: "0 12px 12px 0", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", boxSizing: "border-box", fontSize: "15px" }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label style={{ display: "block", color: "#888", fontSize: "13px", marginBottom: "8px" }}>Email</label>
                    <input 
                      value={checkoutForm.email}
                      readOnly={!!currentUser}
                      required
                      placeholder="john@example.com"
                      className="form-input"
                      style={{ width: "100%", padding: "14px", borderRadius: "12px", background: currentUser ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: currentUser ? "#666" : "#fff", boxSizing: "border-box", fontSize: "15px" }}
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <label style={{ display: "block", color: "#888", fontSize: "13px", marginBottom: "8px" }}>Street Address</label>
                    <textarea 
                      value={checkoutForm.address}
                      onChange={(e) => onFormChange("address", e.target.value)}
                      required
                      placeholder="House No, Building, Street Name"
                      rows={2}
                      className="form-input"
                      style={{ width: "100%", padding: "14px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", boxSizing: "border-box", fontSize: "15px", resize: "none" }}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ display: "block", color: "#888", fontSize: "13px", marginBottom: "8px" }}>City</label>
                    <input 
                      value={checkoutForm.city}
                      onChange={(e) => onFormChange("city", e.target.value)}
                      required
                      placeholder="City"
                      className="form-input"
                      style={{ width: "100%", padding: "14px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", boxSizing: "border-box", fontSize: "15px" }}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ display: "block", color: "#888", fontSize: "13px", marginBottom: "8px" }}>State</label>
                    <input 
                      value={checkoutForm.state}
                      onChange={(e) => onFormChange("state", e.target.value)}
                      required
                      placeholder="State"
                      className="form-input"
                      style={{ width: "100%", padding: "14px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", boxSizing: "border-box", fontSize: "15px" }}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ display: "block", color: "#888", fontSize: "13px", marginBottom: "8px" }}>Pincode</label>
                    <input 
                      value={checkoutForm.pincode}
                      onChange={(e) => onFormChange("pincode", e.target.value)}
                      required
                      placeholder="560001"
                      maxLength={6}
                      className="form-input"
                      style={{ width: "100%", padding: "14px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", boxSizing: "border-box", fontSize: "15px" }}
                    />
                  </div>
                </div>
              </div>

              <div className="glass-strong" style={{ padding: "30px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <h3 style={{ color: "#fff", marginTop: 0, marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <Wallet size={20} color="#ff3b30" /> Payment Method
                </h3>
                
                <div style={{ display: "grid", gap: "12px" }}>
                  <div 
                    onClick={() => onFormChange("paymentMethod", PAYMENT_METHODS.UPI)}
                    style={{ padding: "20px", borderRadius: "16px", background: checkoutForm.paymentMethod === PAYMENT_METHODS.UPI ? "rgba(255,59,48,0.1)" : "rgba(255,255,255,0.03)", border: "1px solid", borderColor: checkoutForm.paymentMethod === PAYMENT_METHODS.UPI ? "#ff3b30" : "rgba(255,255,255,0.1)", cursor: "pointer", display: "flex", alignItems: "center", gap: "15px", transition: "all 0.3s" }}
                  >
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid", borderColor: checkoutForm.paymentMethod === PAYMENT_METHODS.UPI ? "#ff3b30" : "#555", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {checkoutForm.paymentMethod === PAYMENT_METHODS.UPI && <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff3b30" }} />}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: "700", color: "#fff" }}>UPI Transfer</p>
                      <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>PhonePe, GPay, Paytm, etc.</p>
                    </div>
                  </div>

                  <div 
                    style={{ padding: "20px", borderRadius: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", cursor: "not-allowed", display: "flex", alignItems: "center", gap: "15px", opacity: 0.5 }}
                  >
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid #333" }} />
                    <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: "700", color: "#fff" }}>Credit / Debit Card</p>
                        <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>Currently Unavailable</p>
                      </div>
                      <CreditCard size={20} color="#333" />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Summary Section */}
          <div className="checkout-summary-section">
            <div className="glass-strong" style={{ padding: "30px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.1)", position: "sticky", top: "100px" }}>
              <h3 style={{ color: "#fff", marginTop: 0, marginBottom: "25px" }}>Order Summary</h3>
              
              <div className="cart-items-preview" style={{ marginBottom: "25px", display: "grid", gap: "15px" }}>
                {cart.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "15px" }}>
                    <div style={{ width: "60px", height: "60px", background: "rgba(255,255,255,0.05)", borderRadius: "12px", overflow: "hidden" }}>
                      <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: "700", fontSize: "14px", color: "#fff" }}>{item.name}</p>
                      <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>Qty: {item.qty} • {item.size}</p>
                    </div>
                    <div style={{ fontWeight: "700", fontSize: "14px", color: "#fff" }}>{item.price}</div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "20px", marginBottom: "25px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ color: "#888" }}>Subtotal</span>
                  <span style={{ color: "#fff" }}>{formatCurrency(total + discountAmount)}</span>
                </div>
                {discountAmount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", color: "#4cd964" }}>
                    <span>Discount</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ color: "#888" }}>Shipping</span>
                  <span style={{ color: "#4cd964" }}>FREE</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", fontSize: "20px", fontWeight: "900", color: "#fff" }}>
                  <span>Total</span>
                  <span style={{ color: "#ff3b30" }}>{formatCurrency(total)}</span>
                </div>
              </div>

              <motion.button 
                className="btn btn-primary" 
                onClick={onSubmit}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={submitting}
                style={{ width: "100%", padding: "18px", borderRadius: "16px", fontSize: "18px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
              >
                {submitting ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: "20px", height: "20px", border: "3px solid #fff", borderTopColor: "transparent", borderRadius: "50%" }} />
                    Processing...
                  </>
                ) : (
                  <>Complete Payment • {formatCurrency(total)}</>
                )}
              </motion.button>
              
              <p style={{ textAlign: "center", color: "#555", fontSize: "11px", marginTop: "15px" }}>
                By completing your purchase, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      
      <style>{`
        .form-input:focus { outline: none; border-color: #ff3b30 !important; background: rgba(255,255,255,0.1) !important; }
        .checkout-layout { display: grid; grid-template-columns: 1.2fr 0.8fr; }
        @media (max-width: 900px) {
          .checkout-layout { grid-template-columns: 1fr; }
          .checkout-grid { grid-template-columns: 1fr !important; }
          .checkout-page { padding: 80px 15px 40px !important; }
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;
