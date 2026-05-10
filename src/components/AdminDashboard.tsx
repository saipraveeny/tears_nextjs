"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert, RefreshCw, TrendingUp, Package, Users, DollarSign,
  ShoppingCart, BarChart3, MapPin, Clock, ArrowUpRight, ArrowDownRight,
  AlertTriangle, Activity, CreditCard, UserCog
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE } from '../utils/constants';
import { PendingPaymentsTab, UsersTab, OrdersWithActionsTable } from './AdminActions';
import './AdminDashboard.css';

/* ============================================================
   HIGHCHARTS DARK THEME — shared across all charts
   ============================================================ */
const HC_THEME = {
  chart: {
    backgroundColor: 'transparent',
    style: { fontFamily: 'Inter, sans-serif' },
  },
  title: { style: { color: '#ccc', fontSize: '14px', fontWeight: '700' } },
  subtitle: { style: { color: '#888' } },
  xAxis: {
    labels: { style: { color: '#888', fontSize: '11px' } },
    lineColor: 'rgba(255,255,255,0.06)',
    gridLineColor: 'rgba(255,255,255,0.04)',
    tickColor: 'rgba(255,255,255,0.06)',
  },
  yAxis: {
    labels: { style: { color: '#888', fontSize: '11px' } },
    gridLineColor: 'rgba(255,255,255,0.04)',
    title: { style: { color: '#888' } },
  },
  legend: {
    itemStyle: { color: '#aaa', fontWeight: '500' },
    itemHoverStyle: { color: '#fff' },
  },
  tooltip: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderColor: 'rgba(255,255,255,0.1)',
    style: { color: '#e0e0e0', fontSize: '12px' },
    borderRadius: 10,
    shadow: false,
  },
  plotOptions: {
    series: {
      animation: { duration: 1200 },
    },
  },
  credits: { enabled: false },
};

/* ============================================================
   HELPER: Animated Number Counter
   ============================================================ */
const AnimatedNumber = ({ value, prefix = '', suffix = '', decimals = 0 }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const target = Number(value) || 0;
    const duration = 1200;
    const start = performance.now();
    const from = display;

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (target - from) * eased;
      setDisplay(current);
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };

    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const formatted = decimals > 0
    ? display.toFixed(decimals)
    : Math.round(display).toLocaleString('en-IN');

  return <span>{prefix}{formatted}{suffix}</span>;
};

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
const AdminDashboard = () => {
  const { currentUser, loading: authLoading, openAuthModal } = useAuth();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeTab, setActiveTab] = useState('analytics');

  // Chart refs
  const revenueTrendRef = useRef(null);
  const ordersTrendRef = useRef(null);
  const statusPieRef = useRef(null);
  const topProductsRef = useRef(null);
  const cityChartRef = useRef(null);
  const monthCompareRef = useRef(null);

  // Store chart instances for cleanup
  const chartInstances = useRef([]);

  /* ---- Fetch Data ---- */
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/api/admin/stats`, {
        credentials: 'include',
      });
      if (res.status === 401) {
        openAuthModal();
        return;
      }
      if (res.status === 403) {
        setError('forbidden');
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch stats');
      const json = await res.json();
      setData(json.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Admin stats error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [openAuthModal]);

  useEffect(() => {
    if (!authLoading && currentUser) {
      fetchStats();
    }
  }, [authLoading, currentUser, fetchStats]);

  // Auto-refresh every 60s
  useEffect(() => {
    if (!data) return;
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, [data, fetchStats]);

  /* ---- Render Charts ---- */
  useEffect(() => {
    if (!data || typeof window.Highcharts === 'undefined') return;

    const Highcharts = window.Highcharts;

    // Cleanup previous chart instances
    chartInstances.current.forEach((c) => { try { c.destroy(); } catch (_) {} });
    chartInstances.current = [];

    // 1. Revenue Trend (Area Spline)
    if (revenueTrendRef.current) {
      const dates = data.trends.daily.map((d) => d.date);
      const revenues = data.trends.daily.map((d) => d.revenue);
      const c = Highcharts.chart(revenueTrendRef.current, {
        ...HC_THEME,
        chart: { ...HC_THEME.chart, type: 'areaspline', height: 300 },
        title: { text: null },
        xAxis: { ...HC_THEME.xAxis, categories: dates.map((d) => { const dt = new Date(d); return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }); }) },
        yAxis: { ...HC_THEME.yAxis, title: { text: 'Revenue (₹)', style: { color: '#888' } } },
        tooltip: { ...HC_THEME.tooltip, pointFormat: '<b>₹{point.y:.2f}</b>' },
        series: [{
          name: 'Revenue',
          data: revenues,
          color: '#ff3b30',
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [[0, 'rgba(255, 59, 48, 0.3)'], [1, 'rgba(255, 59, 48, 0.02)']],
          },
          lineWidth: 3,
          marker: { radius: 4, fillColor: '#ff3b30', lineColor: '#fff', lineWidth: 1 },
        }],
        plotOptions: { ...HC_THEME.plotOptions },
        credits: { enabled: false },
      });
      chartInstances.current.push(c);
    }

    // 2. Orders Over Time (Column)
    if (ordersTrendRef.current) {
      const allDates = data.trends.allOrdersDaily.map((d) => d.date);
      const allOrders = data.trends.allOrdersDaily.map((d) => d.orders);
      const c = Highcharts.chart(ordersTrendRef.current, {
        ...HC_THEME,
        chart: { ...HC_THEME.chart, type: 'column', height: 300 },
        title: { text: null },
        xAxis: { ...HC_THEME.xAxis, categories: allDates.map((d) => { const dt = new Date(d); return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }); }) },
        yAxis: { ...HC_THEME.yAxis, title: { text: 'Orders', style: { color: '#888' } }, allowDecimals: false },
        tooltip: { ...HC_THEME.tooltip, pointFormat: '<b>{point.y} orders</b>' },
        series: [{
          name: 'Orders',
          data: allOrders,
          color: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [[0, '#ff9500'], [1, '#ff6b35']],
          },
          borderRadius: 6,
          borderWidth: 0,
        }],
        plotOptions: { column: { borderRadius: 6 }, ...HC_THEME.plotOptions },
        credits: { enabled: false },
      });
      chartInstances.current.push(c);
    }

    // 3. Status Distribution (Donut)
    if (statusPieRef.current) {
      const statusColors = {
        COMPLETED: '#34c759',
        FAILED: '#ff3b30',
        PENDING: '#ffcc00',
        INITIATED: '#5ac8fa',
        UNKNOWN: '#8e8e93',
      };
      const pieData = data.orders.statusDistribution.map((s) => ({
        name: s.status,
        y: s.count,
        color: statusColors[s.status] || '#8e8e93',
      }));
      const c = Highcharts.chart(statusPieRef.current, {
        ...HC_THEME,
        chart: { ...HC_THEME.chart, type: 'pie', height: 300 },
        title: { text: null },
        tooltip: { ...HC_THEME.tooltip, pointFormat: '<b>{point.y}</b> ({point.percentage:.1f}%)' },
        plotOptions: {
          pie: {
            innerSize: '60%',
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              format: '{point.name}: {point.y}',
              style: { color: '#aaa', fontSize: '11px', fontWeight: '500', textOutline: 'none' },
            },
          },
          ...HC_THEME.plotOptions,
        },
        series: [{ name: 'Orders', data: pieData }],
        credits: { enabled: false },
      });
      chartInstances.current.push(c);
    }

    // 4. Top Products (Horizontal Bar)
    if (topProductsRef.current) {
      const products = data.products.top;
      const c = Highcharts.chart(topProductsRef.current, {
        ...HC_THEME,
        chart: { ...HC_THEME.chart, type: 'bar', height: 300 },
        title: { text: null },
        xAxis: { ...HC_THEME.xAxis, categories: products.map((p) => p.name), lineWidth: 0 },
        yAxis: { ...HC_THEME.yAxis, title: { text: 'Units Sold', style: { color: '#888' } }, allowDecimals: false },
        tooltip: { ...HC_THEME.tooltip, pointFormat: '<b>{point.y} units</b> (₹{point.revenue:.0f} revenue)' },
        series: [{
          name: 'Sold',
          data: products.map((p) => ({ y: p.quantity, revenue: p.revenue })),
          color: {
            linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 },
            stops: [[0, '#ff2d55'], [1, '#ff6b88']],
          },
          borderRadius: 6,
          borderWidth: 0,
        }],
        plotOptions: { bar: { borderRadius: 6 }, ...HC_THEME.plotOptions },
        credits: { enabled: false },
      });
      chartInstances.current.push(c);
    }

    // 5. Orders by City (Bar)
    if (cityChartRef.current) {
      const cities = data.geography.cities;
      const c = Highcharts.chart(cityChartRef.current, {
        ...HC_THEME,
        chart: { ...HC_THEME.chart, type: 'bar', height: 300 },
        title: { text: null },
        xAxis: { ...HC_THEME.xAxis, categories: cities.map((c) => c.city), lineWidth: 0 },
        yAxis: { ...HC_THEME.yAxis, title: { text: 'Orders', style: { color: '#888' } }, allowDecimals: false },
        tooltip: { ...HC_THEME.tooltip, pointFormat: '<b>{point.y} orders</b>' },
        series: [{
          name: 'Orders',
          data: cities.map((c) => c.orders),
          color: {
            linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 },
            stops: [[0, '#5856d6'], [1, '#7c7aff']],
          },
          borderRadius: 6,
          borderWidth: 0,
        }],
        plotOptions: { bar: { borderRadius: 6 }, ...HC_THEME.plotOptions },
        credits: { enabled: false },
      });
      chartInstances.current.push(c);
    }

    // 6. Monthly Revenue Comparison
    if (monthCompareRef.current) {
      const thisMonth = data.revenue.thisMonth || 0;
      const prevMonth = data.revenue.prevMonth || 0;
      const now = new Date();
      const thisMonthName = now.toLocaleDateString('en-IN', { month: 'long' });
      const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const prevMonthName = prevDate.toLocaleDateString('en-IN', { month: 'long' });

      const c = Highcharts.chart(monthCompareRef.current, {
        ...HC_THEME,
        chart: { ...HC_THEME.chart, type: 'column', height: 300 },
        title: { text: null },
        xAxis: { ...HC_THEME.xAxis, categories: [prevMonthName, thisMonthName], lineWidth: 0 },
        yAxis: { ...HC_THEME.yAxis, title: { text: 'Revenue (₹)', style: { color: '#888' } } },
        tooltip: { ...HC_THEME.tooltip, pointFormat: '<b>₹{point.y:.2f}</b>' },
        series: [{
          name: 'Revenue',
          data: [
            { y: prevMonth, color: 'rgba(255, 255, 255, 0.15)' },
            { y: thisMonth, color: { linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 }, stops: [[0, '#34c759'], [1, '#2aa648']] } },
          ],
          borderRadius: 10,
          borderWidth: 0,
        }],
        plotOptions: { column: { borderRadius: 10, pointWidth: 60 }, ...HC_THEME.plotOptions },
        legend: { enabled: false },
        credits: { enabled: false },
      });
      chartInstances.current.push(c);
    }

    // Cleanup on unmount
    return () => {
      chartInstances.current.forEach((c) => { try { c.destroy(); } catch (_) {} });
      chartInstances.current = [];
    };
  }, [data]);

  /* ---- Render States ---- */

  // Auth loading
  if (authLoading) {
    return (
      <div className="admin-loading">
        <div className="pulse-ring" />
        <p>Checking authentication...</p>
      </div>
    );
  }

  // Not logged in
  if (!currentUser) {
    return (
      <div className="admin-access-denied">
        <motion.div className="denied-icon" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          <ShieldAlert size={40} />
        </motion.div>
        <h2>Authentication Required</h2>
        <p>Please sign in with your admin credentials to access the dashboard.</p>
        <motion.button className="back-btn" onClick={openAuthModal} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          Sign In
        </motion.button>
      </div>
    );
  }

  // Forbidden (not admin)
  if (error === 'forbidden' || (currentUser && currentUser.role !== 'admin')) {
    return (
      <div className="admin-access-denied">
        <motion.div className="denied-icon" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          <ShieldAlert size={40} />
        </motion.div>
        <h2>Access Denied</h2>
        <p>You don't have admin privileges. This dashboard is restricted to authorized administrators only.</p>
        <motion.button className="back-btn" onClick={() => router.push('/')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          Go Back Home
        </motion.button>
      </div>
    );
  }

  // Loading
  if (loading && !data) {
    return (
      <div className="admin-loading">
        <div className="pulse-ring" />
        <p>Loading dashboard analytics...</p>
      </div>
    );
  }

  // Error
  if (error && error !== 'forbidden') {
    return (
      <div className="admin-access-denied">
        <motion.div className="denied-icon" initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ borderColor: 'rgba(255, 204, 0, 0.3)', background: 'rgba(255, 204, 0, 0.1)' }}>
          <AlertTriangle size={40} color="#ffcc00" />
        </motion.div>
        <h2>Dashboard Error</h2>
        <p>{error}</p>
        <motion.button className="back-btn" onClick={fetchStats} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          Retry
        </motion.button>
      </div>
    );
  }

  if (!data) return null;

  /* ---- Trend calculations ---- */
  const revenueGrowth = data.revenue.prevMonth > 0
    ? ((data.revenue.thisMonth - data.revenue.prevMonth) / data.revenue.prevMonth * 100).toFixed(1)
    : data.revenue.thisMonth > 0 ? '100' : '0';
  const ordersGrowth = data.orders.prevMonth > 0
    ? ((data.orders.thisMonth - data.orders.prevMonth) / data.orders.prevMonth * 100).toFixed(1)
    : data.orders.thisMonth > 0 ? '100' : '0';

  /* ---- Main Dashboard ---- */
  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Activity size={24} style={{ marginRight: 8, verticalAlign: 'middle' }} />
          Command Center
        </motion.h1>
        <div className="admin-header-right">
          {lastUpdated && (
            <span className="admin-last-updated">
              <Clock size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
              Updated {lastUpdated.toLocaleTimeString('en-IN')}
            </span>
          )}
          <motion.button
            className={`admin-refresh-btn ${loading ? 'loading' : ''}`}
            onClick={fetchStats}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </motion.button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button className={`admin-tab ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
          <Activity size={15} /> Analytics
        </button>
        <button className={`admin-tab ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>
          <CreditCard size={15} /> Pending Payments
        </button>
        <button className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          <UserCog size={15} /> Users
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'pending' && <PendingPaymentsTab />}
        {activeTab === 'users' && <UsersTab />}

        {activeTab === 'analytics' && (
          <>
        {/* KPI Cards */}
        <motion.div
          className="admin-kpi-grid"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {[
            { label: 'Total Revenue', value: data.revenue.total, prefix: '₹', icon: <DollarSign size={20} />, sub: `This month: ₹${(data.revenue.thisMonth || 0).toLocaleString('en-IN')}` },
            { label: 'Total Orders', value: data.orders.total, icon: <ShoppingCart size={20} />, sub: `Completed: ${data.orders.completed}` },
            { label: "Today's Orders", value: data.orders.today, icon: <Package size={20} />, sub: `Revenue: ₹${(data.revenue.today || 0).toLocaleString('en-IN')}` },
            { label: 'Registered Users', value: data.users.total, icon: <Users size={20} />, sub: `New this month: ${data.users.newThisMonth}` },
            { label: 'Avg Order Value', value: data.revenue.avgOrderValue, prefix: '₹', decimals: 2, icon: <TrendingUp size={20} />, sub: `${Number(revenueGrowth) >= 0 ? '+' : ''}${revenueGrowth}% vs last month`, trend: Number(revenueGrowth) >= 0 ? 'up' : 'down' },
            { label: 'Monthly Orders', value: data.orders.thisMonth, icon: <BarChart3 size={20} />, sub: `${Number(ordersGrowth) >= 0 ? '+' : ''}${ordersGrowth}% vs last month`, trend: Number(ordersGrowth) >= 0 ? 'up' : 'down' },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              className="admin-kpi-card"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              <div className="kpi-icon">{kpi.icon}</div>
              <div className="kpi-label">{kpi.label}</div>
              <div className="kpi-value">
                <AnimatedNumber value={kpi.value} prefix={kpi.prefix || ''} decimals={kpi.decimals || 0} />
              </div>
              <div className="kpi-sub">
                {kpi.trend === 'up' && <ArrowUpRight size={14} className="trend-up" />}
                {kpi.trend === 'down' && <ArrowDownRight size={14} className="trend-down" />}
                {kpi.sub}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Row 1 */}
        <div className="admin-charts-grid">
          <motion.div className="admin-chart-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h3>
              <span className="chart-icon"><TrendingUp size={18} /></span>
              Revenue Trend (Last 30 Days)
            </h3>
            <div className="chart-container" ref={revenueTrendRef} />
          </motion.div>

          <motion.div className="admin-chart-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h3>
              <span className="chart-icon"><BarChart3 size={18} /></span>
              Orders Over Time
            </h3>
            <div className="chart-container" ref={ordersTrendRef} />
          </motion.div>

          <motion.div className="admin-chart-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <h3>
              <span className="chart-icon"><Activity size={18} /></span>
              Order Status Distribution
            </h3>
            <div className="chart-container" ref={statusPieRef} />
          </motion.div>

          <motion.div className="admin-chart-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <h3>
              <span className="chart-icon"><Package size={18} /></span>
              Top Products Sold
            </h3>
            <div className="chart-container" ref={topProductsRef} />
          </motion.div>

          <motion.div className="admin-chart-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <h3>
              <span className="chart-icon"><MapPin size={18} /></span>
              Orders by City
            </h3>
            <div className="chart-container" ref={cityChartRef} />
          </motion.div>

          <motion.div className="admin-chart-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <h3>
              <span className="chart-icon"><DollarSign size={18} /></span>
              Monthly Revenue Comparison
            </h3>
            <div className="chart-container" ref={monthCompareRef} />
          </motion.div>
        </div>

        {/* Recent Orders Table — with action buttons */}
        <motion.div
          className="admin-orders-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h3>
            <span className="chart-icon"><Clock size={18} /></span>
            Recent Orders
          </h3>
          <div className="admin-orders-table-wrap">
            <OrdersWithActionsTable orders={data.recentOrders} />
          </div>
        </motion.div>
        </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
