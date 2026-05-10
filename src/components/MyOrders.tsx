"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE } from "../utils/constants";
import { useAuth } from "../contexts/AuthContext";
import Loader from "./Loader";
import { ArrowLeft, Clock, MapPin, Package, CreditCard, User, CheckCircle, XCircle } from "lucide-react";

const MyOrders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/user/orders`, {
          method: 'GET',
          credentials: 'include', 
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setOrders(data.orders || []);
          }
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [currentUser]);

  if (loading) return <Loader />;

  return (
    <div style={{ minHeight: "100vh", paddingTop: "120px", paddingBottom: "80px", background: "#0a0a0a", color: "#fff" }}>
      <div className="section-container" style={{ maxWidth: "800px", margin: "0 auto", position: "relative" }}>
        
        <AnimatePresence mode="wait">
          {!selectedOrder ? (
            <motion.div
              key="orders-list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="section-title">My Orders</h1>
              
              {!currentUser ? (
                <div style={{ textAlign: "center", padding: "40px", background: "rgba(255,255,255,0.02)", borderRadius: "16px" }}>
                  <h2>Please sign in to view your orders.</h2>
                </div>
              ) : orders.length === 0 ? (
                <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                   style={{ textAlign: "center", padding: "60px 40px", background: "rgba(255,255,255,0.02)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <h2 style={{ fontSize: "24px", marginBottom: "15px", color: "rgba(255,255,255,0.8)" }}>No orders yet</h2>
                  <p style={{ color: "rgba(255,255,255,0.5)" }}>When you purchase hot sauce, your history will appear automatically!</p>
                </motion.div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {orders.map((order, index) => (
                    <motion.div 
                      key={order.merchantOrderId || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      style={{ 
                        background: "rgba(255,255,255,0.03)", 
                        border: "1px solid rgba(255,255,255,0.1)", 
                        borderRadius: "16px", 
                        padding: "25px",
                        backdropFilter: "blur(10px)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "15px"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "15px", marginBottom: "5px" }}>
                        <div>
                          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "1px" }}>Order ID</span>
                          <h3 style={{ fontSize: "16px", margin: "5px 0 0 0" }}>{order.merchantOrderId}</h3>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "1px" }}>Status</span>
                          <div style={{ 
                            marginTop: "5px",
                            padding: "4px 12px", 
                            borderRadius: "20px", 
                            fontSize: "12px", 
                            fontWeight: "bold",
                            background: order.status === "COMPLETED" ? "rgba(48, 209, 88, 0.2)" : order.status === "FAILED" ? "rgba(255, 59, 48, 0.2)" : "rgba(255, 159, 10, 0.2)",
                            color: order.status === "COMPLETED" ? "#30d158" : order.status === "FAILED" ? "#ff3b30" : "#ff9f0a"
                          }}>
                            {order.status}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                         {order.products && order.products.slice(0, 2).map((item, i) => (
                           <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "rgba(255,255,255,0.8)", fontSize: "14px" }}>
                             <span>{item.quantity}x {item.name} {item.size ? `(${item.size})` : ''}</span>
                           </div>
                         ))}
                         {order.products?.length > 2 && <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>+{order.products.length - 2} more items</div>}
                      </div>
                      
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "15px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                        <div style={{ fontWeight: "bold" }}>
                          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginRight: "8px", fontWeight: "normal" }}>Total</span>
                          <span style={{ color: "#ff3b30", fontSize: "18px" }}>₹{order.amount}</span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedOrder(order)}
                          style={{
                            background: "transparent",
                            border: "1px solid rgba(255,255,255,0.2)",
                            color: "#fff",
                            padding: "8px 16px",
                            borderRadius: "20px",
                            fontSize: "14px",
                            cursor: "pointer",
                            transition: "background 0.3s"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                          View Details
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="order-details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              style={{ padding: "10px" }}
            >
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(255,255,255,0.7)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  marginBottom: "30px",
                  fontSize: "16px",
                  padding: 0
                }}
              >
                <ArrowLeft size={20} /> Back to Orders
              </button>
              
              <div style={{ 
                background: "rgba(255,255,255,0.02)", 
                border: "1px solid rgba(255,255,255,0.05)", 
                borderRadius: "24px", 
                overflow: "hidden"
              }}>
                {/* Header */}
                <div style={{ padding: "30px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "15px" }}>
                    <div>
                      <h2 style={{ margin: "0 0 10px 0", fontSize: "24px" }}>Order #{selectedOrder.merchantOrderId}</h2>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>
                        <Clock size={14} />
                        {new Date(selectedOrder.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ 
                      padding: "6px 16px", 
                      borderRadius: "20px", 
                      fontSize: "14px", 
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      background: selectedOrder.status === "COMPLETED" ? "rgba(48, 209, 88, 0.2)" : selectedOrder.status === "FAILED" ? "rgba(255, 59, 48, 0.2)" : "rgba(255, 159, 10, 0.2)",
                      color: selectedOrder.status === "COMPLETED" ? "#30d158" : selectedOrder.status === "FAILED" ? "#ff3b30" : "#ff9f0a"
                    }}>
                      {selectedOrder.status === "COMPLETED" ? <CheckCircle size={16} /> : selectedOrder.status === "FAILED" ? <XCircle size={16} /> : <Clock size={16} />}
                      {selectedOrder.status}
                    </div>
                  </div>
                </div>

                <div style={{ padding: "30px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" }}>
                  {/* Left Column - Items */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <h3 style={{ display: "flex", alignItems: "center", gap: "10px", margin: 0, fontSize: "18px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px" }}>
                      <Package size={20} color="#ff3b30" /> Items Ordered
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                      {selectedOrder.products?.map((item, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.03)", padding: "15px", borderRadius: "12px" }}>
                          <div>
                            <div style={{ fontWeight: "bold", fontSize: "16px" }}>{item.name}</div>
                            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginTop: "4px" }}>
                              Qty: {item.quantity} {item.size ? `| Size: ${item.size}` : ''}
                            </div>
                          </div>
                          <div style={{ fontWeight: "bold" }}>₹{item.amount}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div style={{ background: "rgba(255,255,255,0.02)", padding: "20px", borderRadius: "16px", marginTop: "10px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", color: "rgba(255,255,255,0.7)" }}>
                        <span>Subtotal</span>
                        <span>₹{selectedOrder.amount}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", color: "rgba(255,255,255,0.7)" }}>
                        <span>Shipping</span>
                        <span>₹0.00</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "15px", borderTop: "1px solid rgba(255,255,255,0.1)", fontWeight: "bold", fontSize: "18px" }}>
                        <span>Total Paid</span>
                        <span style={{ color: "#ff3b30" }}>₹{selectedOrder.amount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Details */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                    
                    <div>
                      <h3 style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 15px 0", fontSize: "18px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px" }}>
                        <User size={20} color="#ff3b30" /> Customer Details
                      </h3>
                      <div style={{ background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                        <div><strong style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", display: "block", marginBottom: "2px" }}>Name</strong> {selectedOrder.user?.name || "N/A"}</div>
                        <div><strong style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", display: "block", marginBottom: "2px" }}>Email</strong> {selectedOrder.user?.email || "N/A"}</div>
                        <div><strong style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", display: "block", marginBottom: "2px" }}>Phone</strong> {selectedOrder.user?.phone || "N/A"}</div>
                      </div>
                    </div>

                    <div>
                      <h3 style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 15px 0", fontSize: "18px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px" }}>
                        <MapPin size={20} color="#ff3b30" /> Shipping Address
                      </h3>
                      <div style={{ background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "16px", lineHeight: "1.6" }}>
                        {selectedOrder.user?.address || "No address provided"}
                      </div>
                    </div>

                    <div>
                      <h3 style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 15px 0", fontSize: "18px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px" }}>
                        <CreditCard size={20} color="#ff3b30" /> Payment Info
                      </h3>
                      <div style={{ background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                        <div><strong style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", display: "block", marginBottom: "2px" }}>Transaction ID</strong> {selectedOrder.transactionId || "Pending/N/A"}</div>
                        <div><strong style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", display: "block", marginBottom: "2px" }}>Gateway</strong> PhonePe</div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyOrders;
