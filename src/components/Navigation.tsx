"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, User, LogOut, Package, Shield, Menu, X } from "lucide-react";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../hooks/useCart";
import { NAV_ITEMS } from "../utils/constants";

interface NavigationProps {
  logo?: string;
}

const Navigation: React.FC<NavigationProps> = ({ logo }) => {
  const { currentUser, openAuthModal, logout } = useAuth();
  const { cart, setIsCartOpen } = useCart();
  
  const cartCount = cart.reduce((total, item) => total + item.qty, 0);
  const onCartClick = () => setIsCartOpen(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const router = useRouter();
  const pathname = usePathname();

  const handleNavClick = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    setIsDropdownOpen(false);

    const isHashLink = item.href.startsWith("#");
    
    if (isHashLink) {
      if (pathname === "/") {
        e.preventDefault();
        const id = item.href.replace("#", "");
        const el = document.getElementById(id);
        if (el) {
          setTimeout(() => {
            const offset = 80;
            const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
              top: elementPosition - offset,
              behavior: "smooth"
            });
            window.history.pushState(null, "", item.href);
          }, 50);
        }
      } else {
        router.push("/" + item.href);
      }
    } else {
      router.push("/" + item.href);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`navbar ${scrollY > 50 ? "navbar-scrolled" : ""}`}
    >
      <div className="nav-container">
        <motion.div
          className="nav-logo"
          onClick={() => {
            if (pathname === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              router.push("/");
            }
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={logo} alt="Tears Logo" className="logo-img" />
        </motion.div>

        <div className="nav-actions">
          {/* Desktop Links (Hidden on Mobile) */}
          <div className="desktop-nav-links">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.name}
                href={item.href.startsWith("#") ? item.href : "/" + item.href}
                className="nav-link"
                onClick={(e) => handleNavClick(e, item)}
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="action-buttons-group">
            {/* Cart Button (Always Visible) */}
            <motion.button
              className="cart-btn"
              onClick={onCartClick}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </motion.button>

            {/* User Profile / Auth (Always Visible) */}
            {currentUser ? (
              <div className="user-profile-dropdown-wrapper"
                   onMouseEnter={() => !isMobile && setIsDropdownOpen(true)}
                   onMouseLeave={() => !isMobile && setIsDropdownOpen(false)}
              >
                <motion.div
                  className="user-avatar-wrapper"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="profile-progress-svg" viewBox="0 0 36 36">
                    <path
                      className="profile-progress-bg"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="profile-progress-bar"
                      strokeDasharray={`${
                        (!currentUser.email || currentUser.email.includes('temp_') || !currentUser.phone) 
                        ? '75, 100' 
                        : '100, 100'
                      }`}
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="user-avatar">
                    {currentUser.name ? currentUser.name[0].toUpperCase() : <User size={18} />}
                  </div>
                </motion.div>
                
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      className="dropdown-menu"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <div className="dropdown-header">
                        Hi, {currentUser.name?.split(' ')[0] || 'User'}
                      </div>
                      <button onClick={() => { router.push('/profile'); setIsDropdownOpen(false); }}>
                        <User size={16} /> Profile
                      </button>
                      <button onClick={() => { router.push('/orders'); setIsDropdownOpen(false); }}>
                        <Package size={16} /> My Orders
                      </button>
                      {currentUser.role === 'admin' && (
                        <button className="admin-link" onClick={() => { router.push('/admin-panel'); setIsDropdownOpen(false); }}>
                          <Shield size={16} /> Admin Panel
                        </button>
                      )}
                      <button className="logout-link" onClick={() => { logout(); setIsDropdownOpen(false); }}>
                        <LogOut size={16} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                className="login-btn-header"
                onClick={openAuthModal}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <User size={22} className="mobile-only-icon" />
                <span className="desktop-only-text">Sign In</span>
              </motion.button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}

            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {NAV_ITEMS.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href.startsWith("#") ? item.href : "/" + item.href}
                className="mobile-nav-link"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={(e) => {
                  handleNavClick(e, item);
                }}
              >
                {item.name}
              </motion.a>
            ))}
            
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '10px 20px' }}></div>
            
            {currentUser ? (
               <div style={{ background: 'rgba(255,255,255,0.02)', margin: '10px 15px', borderRadius: '12px', padding: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                 <div style={{ padding: '5px 10px', color: '#888', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#ff3b30', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '12px' }}>
                     {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                   </div>
                   Hi, {currentUser.name?.split(' ')[0] || 'User'}
                 </div>
                  <button 
                    className="mobile-nav-link" 
                    onClick={() => { router.push('/profile'); setIsMenuOpen(false); }} 
                    style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', color: '#fff', fontSize: '16px', padding: '12px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}
                  >
                    <User size={18} /> My Profile
                  </button>
                  <button 
                    className="mobile-nav-link" 
                    onClick={() => { router.push('/orders'); setIsMenuOpen(false); }} 
                    style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', color: '#fff', fontSize: '16px', padding: '12px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}
                  >
                    <Package size={18} /> My Orders
                  </button>
                 {currentUser.role === 'admin' && (
                   <button 
                     className="mobile-nav-link" 
                     onClick={() => { router.push('/admin-panel'); setIsMenuOpen(false); }} 
                     style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', color: '#ff9500', fontSize: '16px', padding: '12px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}
                   >
                     <Shield size={18} /> Admin Panel
                   </button>
                 )}
                 <button 
                   className="mobile-nav-link" 
                   onClick={() => { logout(); setIsMenuOpen(false); }} 
                   style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', color: '#ff3b30', fontSize: '16px', padding: '12px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}
                 >
                   <LogOut size={18} /> Sign Out
                 </button>
               </div>
            ) : (
               <div style={{ padding: '10px 15px' }}>
                 <button 
                   className="btn btn-primary" 
                   onClick={() => { openAuthModal(); setIsMenuOpen(false); }} 
                   style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '8px' }}
                 >
                   <User size={18} /> Sign In / Create Account
                 </button>
               </div>
            )}
            
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navigation;
