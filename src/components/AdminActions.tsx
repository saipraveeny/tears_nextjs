"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCw, Bell, Mail, CheckCircle, AlertTriangle,
  Send, X, UserCheck, Clock, MessageSquare
} from 'lucide-react';
import { API_BASE } from '../utils/constants';

/* ---- Toast Component ---- */
const Toast = ({ toast, onClose }) => (
  <AnimatePresence>
    {toast && (
      <motion.div
        className={`admin-toast ${toast.type}`}
        initial={{ opacity: 0, y: 30, x: 30 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: 30 }}
      >
        {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
        {toast.message}
      </motion.div>
    )}
  </AnimatePresence>
);

/* ---- Admin API call helper ---- */
const adminAction = async (action, payload = {}) => {
  const res = await fetch(`${API_BASE}/api/admin/actions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, payload }),
    credentials: 'include',
  });
  return res.json();
};

const formatDate = (d) => {
  const dt = new Date(d);
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

/* ============================================================
   PENDING PAYMENTS TAB
   ============================================================ */
export const PendingPaymentsTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [actionLoading, setActionLoading] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchPending = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminAction('fetchPendingOrders');
      setOrders(data.orders || []);
    } catch { showToast('Failed to fetch pending orders', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPending(); }, [fetchPending]);

  const handleRefreshStatus = async (orderIds) => {
    const ids = Array.isArray(orderIds) ? orderIds : [orderIds];
    const loadKey = ids.join(',');
    setActionLoading(prev => ({ ...prev, [loadKey]: true }));
    try {
      const data = await adminAction('refreshStatus', { orderIds: ids });
      const changed = data.results?.filter(r => r.changed).length || 0;
      showToast(`Checked ${ids.length} order(s). ${changed} updated.`);
      fetchPending();
    } catch { showToast('Status refresh failed', 'error'); }
    finally { setActionLoading(prev => ({ ...prev, [loadKey]: false })); }
  };

  const handleResend = async (orderId) => {
    setActionLoading(prev => ({ ...prev, [`notify-${orderId}`]: true }));
    try {
      const data = await adminAction('resendNotification', { orderId });
      showToast(data.message || 'Notification sent');
    } catch { showToast('Notification failed', 'error'); }
    finally { setActionLoading(prev => ({ ...prev, [`notify-${orderId}`]: false })); }
  };

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected(prev => prev.size === orders.length ? new Set() : new Set(orders.map(o => o.id)));
  };

  return (
    <div>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="admin-section-header">
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ccc', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="chart-icon"><Clock size={18} /></span>
          Pending & Initiated Orders ({orders.length})
        </h3>
        <div className="header-actions">
          <button className="admin-action-btn" onClick={fetchPending} disabled={loading}>
            <RefreshCw size={13} className={loading ? 'spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="admin-bulk-bar">
          <span>{selected.size} selected</span>
          <button className="admin-action-btn warning" onClick={() => handleRefreshStatus([...selected])}>
            <RefreshCw size={12} /> Refresh Status
          </button>
          <button className="admin-action-btn" onClick={() => setSelected(new Set())}>
            <X size={12} /> Clear
          </button>
        </div>
      )}

      <div className="admin-orders-section" style={{ marginTop: 0 }}>
        <div className="admin-orders-table-wrap">
          <table className="admin-orders-table">
            <thead>
              <tr>
                <th><input type="checkbox" className="admin-checkbox" checked={selected.size === orders.length && orders.length > 0} onChange={toggleAll} /></th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Products</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td><input type="checkbox" className="admin-checkbox" checked={selected.has(order.id)} onChange={() => toggleSelect(order.id)} /></td>
                  <td className="order-id">{order.id}</td>
                  <td>
                    <div className="customer-name">{order.customer.name}</div>
                    <div className="customer-email">{order.customer.email}</div>
                  </td>
                     <td className="product-list">{order.products?.map(p => `${p.name} x${p.qty}`).join(', ')}</td>
                  <td style={{ fontWeight: 700, color: '#fff' }}>₹{order.amount?.toLocaleString('en-IN')}</td>
                  <td><span className={`status-badge ${order.status?.toLowerCase()}`}>{order.status}</span></td>
                  <td style={{ color: '#888', fontSize: 12 }}>{formatDate(order.createdAt)}</td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    <button className="admin-action-btn warning" disabled={actionLoading[order.id]} onClick={() => handleRefreshStatus(order.id)}>
                      <RefreshCw size={11} /> Check
                    </button>
                    <button className="admin-action-btn" disabled={actionLoading[`notify-${order.id}`]} onClick={() => handleResend(order.id)}>
                      <Bell size={11} /> Notify
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && !loading && (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#666' }}>No pending orders 🎉</td></tr>
              )}
              {loading && (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#666' }}>Loading...</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   USERS TAB
   ============================================================ */
export const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [toast, setToast] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [promoImageUrl, setPromoImageUrl] = useState('');
  const [sending, setSending] = useState(false);
  const [channel, setChannel] = useState('EMAIL'); // 'EMAIL' or 'WHATSAPP'

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminAction('fetchUsers', { page, limit: 50, search: search || undefined });
      setUsers(data.users || []);
      setTotalPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch { showToast('Failed to fetch users', 'error'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const toggleSelect = (id) => {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const toggleAll = () => {
    setSelected(prev => prev.size === users.length ? new Set() : new Set(users.map(u => u.id)));
  };

  const handleBulkEmail = async () => {
    if (!emailMessage.trim()) return;
    setSending(true);
    try {
      const payload = { 
        message: emailMessage, 
        subject: emailSubject || undefined,
        imageUrl: promoImageUrl || undefined,
        channel: channel
      };
      if (selected.size > 0) payload.userIds = [...selected];
      const data = await adminAction('bulkNotify', payload);
      showToast(data.message || 'Notifications sent');
      setShowEmailModal(false);
      setEmailMessage('');
      setEmailSubject('');
      setPromoImageUrl('');
    } catch { showToast('Notification failed', 'error'); }
    finally { setSending(false); }
  };

  return (
    <div>
      <Toast toast={toast} />

      <div className="admin-section-header">
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ccc', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="chart-icon"><UserCheck size={18} /></span>
          Registered Users ({total})
        </h3>
        <div className="header-actions">
          <input
            className="admin-search"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="admin-action-btn primary" onClick={() => setShowEmailModal(true)}>
            <Bell size={13} /> {selected.size > 0 ? `Notify ${selected.size} Selected` : 'Broadcast to All'}
          </button>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="admin-bulk-bar">
          <span>{selected.size} users selected</span>
          <button className="admin-action-btn primary" onClick={() => setShowEmailModal(true)}>
            <Send size={12} /> Send Message to Selected
          </button>
          <button className="admin-action-btn" onClick={() => setSelected(new Set())}>
            <X size={12} /> Clear
          </button>
        </div>
      )}

      <div className="admin-orders-section" style={{ marginTop: 0 }}>
        <div className="admin-orders-table-wrap">
          <table className="admin-orders-table">
            <thead>
              <tr>
                <th><input type="checkbox" className="admin-checkbox" checked={selected.size === users.length && users.length > 0} onChange={toggleAll} /></th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Provider</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td><input type="checkbox" className="admin-checkbox" checked={selected.has(u.id)} onChange={() => toggleSelect(u.id)} /></td>
                  <td style={{ fontWeight: 600, color: '#e0e0e0' }}>{u.name}</td>
                  <td style={{ color: '#aaa' }}>{u.email}</td>
                  <td style={{ color: '#888' }}>{u.phone}</td>
                  <td><span className={`status-badge ${u.role === 'admin' ? 'completed' : 'initiated'}`}>{u.role}</span></td>
                  <td style={{ color: '#888', fontSize: 12 }}>{u.provider}</td>
                  <td style={{ color: '#888', fontSize: 12 }}>{formatDate(u.joined)}</td>
                </tr>
              ))}
              {users.length === 0 && !loading && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#666' }}>No users found</td></tr>
              )}
              {loading && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#666' }}>Loading...</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`admin-action-btn ${page === i + 1 ? 'primary' : ''}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bulk Email Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <motion.div
            className="admin-modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowEmailModal(false)}
          >
            <motion.div
              className="admin-modal"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h3>
                <Send size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                Broadcast Message
              </h3>

              <div className="channel-toggle" style={{ display: 'flex', gap: 10, margin: '20px 0' }}>
                <button 
                  className={`admin-action-btn ${channel === 'EMAIL' ? 'primary' : ''}`}
                  onClick={() => setChannel('EMAIL')}
                  style={{ flex: 1 }}
                >
                  <Mail size={14} /> Email
                </button>
                <button 
                  className={`admin-action-btn ${channel === 'WHATSAPP' ? 'success' : ''}`}
                  onClick={() => setChannel('WHATSAPP')}
                  style={{ flex: 1 }}
                >
                  <MessageSquare size={14} /> WhatsApp
                </button>
              </div>

              {channel === 'EMAIL' && (
                <div style={{ marginBottom: 16 }}>
                  <label>Subject / Title</label>
                  <input type="text" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} placeholder="e.g. New Collection Launch!" />
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label>Message {channel === 'WHATSAPP' && '(WhatsApp text)'}</label>
                <textarea
                  rows={channel === 'WHATSAPP' ? 4 : 6}
                  value={emailMessage}
                  onChange={e => setEmailMessage(e.target.value)}
                  placeholder="Write your message here..."
                />
                {channel === 'EMAIL' && (
                  <p style={{ fontSize: 10, color: '#666', marginTop: 4 }}>
                    Tip: You can use &lt;b&gt;bold&lt;/b&gt; tags for emphasis.
                  </p>
                )}
              </div>

              {channel === 'EMAIL' && (
                <div style={{ marginBottom: 16 }}>
                  <label>Promo Image URL (Optional)</label>
                  <input 
                    type="text" 
                    value={promoImageUrl} 
                    onChange={e => setPromoImageUrl(e.target.value)} 
                    placeholder="https://example.com/image.jpg" 
                  />
                </div>
              )}

              <p style={{ fontSize: 12, color: '#666', margin: '0 0 16px' }}>
                {selected.size > 0
                  ? `Sending ${channel} to ${selected.size} selected user(s).`
                  : `Sending ${channel} to ALL registered users.`}
              </p>

              <div className="admin-modal-actions">
                <button className="admin-action-btn" onClick={() => setShowEmailModal(false)}>Cancel</button>
                <button
                  className={`admin-action-btn ${channel === 'WHATSAPP' ? 'success' : 'primary'}`}
                  disabled={!emailMessage.trim() || sending}
                  onClick={handleBulkEmail}
                >
                  {sending ? 'Sending...' : `Send ${channel === 'EMAIL' ? 'Email' : 'WhatsApp'}`}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ============================================================
   ORDERS TAB — Enhanced with action buttons
   ============================================================ */
export const OrdersWithActionsTable = ({ orders = [] }) => {
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleResend = async (orderId) => {
    setActionLoading(prev => ({ ...prev, [orderId]: true }));
    try {
      const data = await adminAction('resendNotification', { orderId });
      showToast(data.message || 'Notification sent');
    } catch { showToast('Failed', 'error'); }
    finally { setActionLoading(prev => ({ ...prev, [orderId]: false })); }
  };

  const handleRefresh = async (orderId) => {
    setActionLoading(prev => ({ ...prev, [`r-${orderId}`]: true }));
    try {
      await adminAction('refreshStatus', { orderIds: [orderId] });
      showToast(`Status refreshed for ${orderId}`);
    } catch { showToast('Failed', 'error'); }
    finally { setActionLoading(prev => ({ ...prev, [`r-${orderId}`]: false })); }
  };

  return (
    <>
      <Toast toast={toast} />
      <table className="admin-orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Products</th>
            <th>Amount</th>
            <th>Status</th>
            <th>City</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, i) => (
            <motion.tr key={order.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
              <td className="order-id">{order.id}</td>
              <td>
                <div className="customer-name">{order.customer.name}</div>
                <div className="customer-email">{order.customer.email}</div>
              </td>
              <td className="product-list">{order.products?.map(p => `${p.name} x${p.qty}`).join(', ')}</td>
              <td style={{ fontWeight: 700, color: '#fff' }}>₹{order.amount?.toLocaleString('en-IN')}</td>
              <td><span className={`status-badge ${(order.status || '').toLowerCase()}`}>{order.status}</span></td>
              <td style={{ color: '#aaa' }}>{order.customer.city || '—'}</td>
              <td style={{ color: '#888', fontSize: 12 }}>{formatDate(order.date)}</td>
              <td style={{ display: 'flex', gap: 6 }}>
                <button className="admin-action-btn" disabled={actionLoading[`r-${order.id}`]} onClick={() => handleRefresh(order.id)}>
                  <RefreshCw size={11} />
                </button>
                <button className="admin-action-btn success" disabled={actionLoading[order.id]} onClick={() => handleResend(order.id)}>
                  <Bell size={11} />
                </button>
              </td>
            </motion.tr>
          ))}
          {orders.length === 0 && (
            <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#666' }}>No orders yet</td></tr>
          )}
        </tbody>
      </table>
    </>
  );
};
