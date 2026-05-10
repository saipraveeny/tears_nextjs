"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { User, Mail, Plus, Trash2, Home, Briefcase, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const { currentUser, updateProfile, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    addresses: []
  });
  const [message, setMessage] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    tag: "Home",
    street: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        phone: currentUser.phone || "",
        addresses: currentUser.addresses || []
      });
    }
  }, [currentUser]);

  if (loading) return <div className="loading">Loading Profile...</div>;
  if (!currentUser) {
    router.push("/");
    return null;
  }

  const handleSaveDetails = async () => {
    const res = await updateProfile({
      name: formData.name,
      phone: formData.phone
    });
    if (res.success) {
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);
    } else {
      setMessage({ type: "error", text: res.error || "Failed to update profile" });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAddAddress = async () => {
    const updatedAddresses = [...formData.addresses, { ...newAddress, isDefault: formData.addresses.length === 0 }];
    const res = await updateProfile({ addresses: updatedAddresses });
    if (res.success) {
      setShowAddressModal(false);
      setNewAddress({ tag: "Home", street: "", city: "", state: "", pincode: "", isDefault: false });
      setMessage({ type: "success", text: "Address added!" });
    } else {
      setMessage({ type: "error", text: res.error || "Failed to add address" });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteAddress = async (index) => {
    const updatedAddresses = formData.addresses.filter((_, i) => i !== index);
    const res = await updateProfile({ addresses: updatedAddresses });
    if (res.success) {
      setMessage({ type: "success", text: "Address removed" });
    }
  };

  const setAsDefault = async (index) => {
    const updatedAddresses = formData.addresses.map((addr, i) => ({
      ...addr,
      isDefault: i === index
    }));
    await updateProfile({ addresses: updatedAddresses });
  };

  const isProfileIncomplete = !currentUser.phone || !currentUser.addresses?.length;

  return (
    <motion.div 
      className="profile-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ padding: "100px 20px 60px", minHeight: "100vh", background: "#0a0a0a", color: "#fff" }}
    >
      <div className="profile-container" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="profile-header glass-strong"
          style={{ padding: "40px", borderRadius: "24px", marginBottom: "30px", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: "30px", flexWrap: "wrap" }}
        >
          <div className="profile-avatar" style={{ width: "100px", height: "100px", borderRadius: "50%", background: "linear-gradient(45deg, #ff3b30, #ff8a80)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", fontWeight: "bold", boxShadow: "0 10px 30px rgba(255,59,48,0.3)" }}>
            {currentUser.name ? currentUser.name[0].toUpperCase() : <User size={48} />}
          </div>
          <div className="profile-info">
            <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "800", letterSpacing: "-1px" }}>{currentUser.name || "User"}</h1>
            <p style={{ color: "#888", margin: "5px 0 0" }}>{currentUser.email}</p>
            {isProfileIncomplete && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ display: "flex", alignItems: "center", gap: "8px", color: "#ff9500", fontSize: "14px", marginTop: "10px", background: "rgba(255,149,0,0.1)", padding: "5px 12px", borderRadius: "20px", border: "1px solid rgba(255,149,0,0.2)" }}
              >
                <AlertCircle size={14} /> Please complete your profile
              </motion.div>
            )}
          </div>
        </motion.div>

        <div className="profile-tabs" style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
          <button 
            onClick={() => setActiveTab("details")}
            className={activeTab === "details" ? "tab-active" : "tab-inactive"}
            style={{ padding: "12px 24px", borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: "600", transition: "all 0.3s" }}
          >
            Details
          </button>
          <button 
            onClick={() => setActiveTab("addresses")}
            className={activeTab === "addresses" ? "tab-active" : "tab-inactive"}
            style={{ padding: "12px 24px", borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: "600", transition: "all 0.3s" }}
          >
            Addresses
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "details" ? (
            <motion.div 
              key="details"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="glass-strong"
              style={{ padding: "30px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0 }}>Personal Information</h3>
                <button 
                  onClick={() => isEditing ? handleSaveDetails() : setIsEditing(true)}
                  style={{ background: isEditing ? "#ff3b30" : "rgba(255,255,255,0.1)", color: "#fff", border: "none", padding: "8px 20px", borderRadius: "8px", cursor: "pointer" }}
                >
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </button>
              </div>

              <div className="form-grid" style={{ display: "grid", gap: "20px" }}>
                <div className="form-group">
                  <label style={{ display: "block", color: "#888", marginBottom: "8px", fontSize: "14px" }}>Full Name</label>
                  <div style={{ position: "relative" }}>
                    <User size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#555" }} />
                    <input 
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{ width: "100%", padding: "12px 12px 12px 40px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ display: "block", color: "#888", marginBottom: "8px", fontSize: "14px" }}>Email ID (Read-only)</label>
                  <div style={{ position: "relative" }}>
                    <Mail size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#555" }} />
                    <input 
                      disabled
                      value={currentUser.email}
                      style={{ width: "100%", padding: "12px 12px 12px 40px", borderRadius: "10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", color: "#888", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ display: "block", color: "#888", marginBottom: "8px", fontSize: "14px" }}>Mobile Number</label>
                  <div style={{ position: "relative", display: "flex" }}>
                    <span style={{ display: "flex", alignItems: "center", padding: "0 15px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRight: "none", borderRadius: "10px 0 0 10px", color: "#888" }}>+91</span>
                    <input 
                      disabled={!isEditing}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      placeholder="98765 43210"
                      style={{ width: "100%", padding: "12px", borderRadius: "0 10px 10px 0", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", boxSizing: "border-box" }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="addresses"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0 }}>My Addresses</h3>
                <button 
                  onClick={() => setShowAddressModal(true)}
                  style={{ background: "#ff3b30", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: "600" }}
                >
                  <Plus size={18} /> Add New
                </button>
              </div>

              <div style={{ display: "grid", gap: "15px" }}>
                {formData.addresses.length > 0 ? (
                  formData.addresses.map((addr, index) => (
                    <motion.div 
                      key={index}
                      className="glass-strong"
                      layout
                      style={{ padding: "20px", borderRadius: "16px", border: addr.isDefault ? "1px solid #ff3b30" : "1px solid rgba(255,255,255,0.1)", position: "relative" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                          {addr.tag === "Home" ? <Home size={18} color="#ff3b30" /> : <Briefcase size={18} color="#ff3b30" />}
                          <span style={{ fontWeight: "bold", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>{addr.tag}</span>
                          {addr.isDefault && <span style={{ background: "rgba(255,59,48,0.1)", color: "#ff3b30", fontSize: "10px", padding: "2px 8px", borderRadius: "10px", border: "1px solid rgba(255,59,48,0.2)" }}>DEFAULT</span>}
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                          {!addr.isDefault && (
                            <button onClick={() => setAsDefault(index)} style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer", fontSize: "12px" }}>Set Default</button>
                          )}
                          <button onClick={() => handleDeleteAddress(index)} style={{ background: "transparent", border: "none", color: "#ff3b30", cursor: "pointer" }}><Trash2 size={16} /></button>
                        </div>
                      </div>
                      <p style={{ margin: "5px 0", color: "#eee" }}>{addr.street}</p>
                      <p style={{ margin: 0, color: "#888", fontSize: "14px" }}>{addr.city}, {addr.state} - {addr.pincode}</p>
                    </motion.div>
                  ))
                ) : (
                  <div style={{ padding: "40px", textAlign: "center", color: "#555", border: "2px dashed rgba(255,255,255,0.05)", borderRadius: "20px" }}>
                    No addresses saved yet.
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Address Modal */}
      <AnimatePresence>
        {showAddressModal && (
          <div className="modal-overlay" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "20px" }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-strong"
              style={{ width: "min(500px, 100%)", padding: "30px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <h2 style={{ marginTop: 0 }}>Add New Address</h2>
              <div style={{ display: "grid", gap: "15px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", color: "#888" }}>Address Tag</label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {["Home", "Work", "Other"].map(tag => (
                      <button 
                        key={tag}
                        onClick={() => setNewAddress({ ...newAddress, tag })}
                        style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid", borderColor: newAddress.tag === tag ? "#ff3b30" : "rgba(255,255,255,0.1)", background: newAddress.tag === tag ? "rgba(255,59,48,0.1)" : "transparent", color: "#fff", cursor: "pointer" }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <input 
                  placeholder="Street Address"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", boxSizing: "border-box" }}
                />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <input 
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", boxSizing: "border-box" }}
                  />
                  <input 
                    placeholder="State"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", boxSizing: "border-box" }}
                  />
                </div>
                <input 
                  placeholder="Pincode"
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", boxSizing: "border-box" }}
                />
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button 
                    onClick={handleAddAddress}
                    style={{ flex: 2, background: "#ff3b30", color: "#fff", border: "none", padding: "12px", borderRadius: "12px", cursor: "pointer", fontWeight: "bold" }}
                  >
                    Save Address
                  </button>
                  <button 
                    onClick={() => setShowAddressModal(false)}
                    style={{ flex: 1, background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", padding: "12px", borderRadius: "12px", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Message */}
      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            style={{ position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)", padding: "15px 30px", borderRadius: "30px", background: message.type === "success" ? "#4cd964" : "#ff3b30", color: "#fff", fontWeight: "bold", boxShadow: "0 10px 20px rgba(0,0,0,0.3)", zIndex: 3000, display: "flex", alignItems: "center", gap: "10px" }}
          >
            {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .tab-active { background: #ff3b30; color: #fff; box-shadow: 0 4px 15px rgba(255,59,48,0.3); }
        .tab-inactive { background: rgba(255,255,255,0.05); color: #888; }
        .tab-inactive:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .form-input:focus { outline: none; border-color: #ff3b30 !important; background: rgba(255,255,255,0.08) !important; }
      `}</style>
    </motion.div>
  );
};

export default ProfilePage;
