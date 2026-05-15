"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, User, LogOut, Package, Shield } from "lucide-react";
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

        <div className="nav-menu">
          {NAV_ITEMS.map((item, index) => (
            <motion.a
              key={item.name}
              href={item.href.startsWith("#") ? item.href : "/" + item.href}
              className="nav-link"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              onClick={(e) => handleNavClick(e, item)}
            >
              {item.name}
            </motion.a>
          ))}

          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '10px' }}>
              <motion.button
                className="cart-btn"
                onClick={onCartClick}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart size={24} />
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </motion.button>
              
              {currentUser ? (
               <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
               >
                   <motion.div
                     whileHover={{ scale: 1.05 }}
                     style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'linear-gradient(45deg, #ff3b30, #ff8a80)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
                   >
                     {currentUser.name ? currentUser.name[0].toUpperCase() : <User size={18} />}
                   </motion.div>
                   
                   <AnimatePresence>
                     {isDropdownOpen && (
                       <motion.div
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: 10 }}
                         style={{
                           position: 'absolute',
                           top: '100%',
                           right: 0,
                           background: 'rgba(20, 20, 20, 0.95)',
                           backdropFilter: 'blur(10px)',
                           border: '1px solid rgba(255,255,255,0.1)',
                           borderRadius: '12px',
                           padding: '10px 0',
                           minWidth: '150px',
                           marginTop: '10px',
                           zIndex: 100
                         }}
                       >
                         <div style={{ padding: '8px 20px', color: '#888', fontSize: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '5px' }}>
                           Hi, {currentUser.name?.split(' ')[0] || 'User'}
                         </div>
                          <button
                            onClick={() => { router.push('/profile'); setIsDropdownOpen(false); }}
                            style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', color: '#fff', padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}
                          >
                            <User size={16} /> Profile
                          </button>
                          <button
                            onClick={() => { router.push('/orders'); setIsDropdownOpen(false); }}
                            style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', color: '#fff', padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}
                          >
                            <Package size={16} /> My Orders
                          </button>
                          {currentUser.role === 'admin' && (
                            <button
                              onClick={() => { router.push('/admin-panel'); setIsDropdownOpen(false); }}
                              style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', color: '#ff9500', padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}
                            >
                              <Shield size={16} /> Admin Panel
                            </button>
                          )}
                          <button
                            onClick={() => { logout(); setIsDropdownOpen(false); }}
                            style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', color: '#ff3b30', padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '5px' }}
                          >
                            <LogOut size={16} /> Sign Out
                          </button>
                       </motion.div>
                     )}
                   </AnimatePresence>
               </div>
              ) : (
                <motion.button
                  className="btn btn-primary"
                  onClick={openAuthModal}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ padding: '8px 20px', fontSize: '14px' }}
                >
                  Sign In
                </motion.button>
              )}
            </div>
          )}
        </div>

        <div className="mobile-actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {isMobile && (
            <>
              <motion.button
                className="cart-btn"
                onClick={onCartClick}
                whileTap={{ scale: 0.95 }}
                style={{ 
                  margin: 0, 
                  padding: 0,
                  position: "relative"
                }}
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="cart-count" style={{ fontSize: 12, position: 'absolute', top: -8, right: -10 }}>
                    {cartCount}
                  </span>
                )}
              </motion.button>
            </>
          )}

          <motion.button
            className="mobile-menu-btn"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setIsDropdownOpen(false);
            }}
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? (
              <span style={{ fontSize: 24 }}>&#10005;</span>
            ) : (
              <span style={{ fontSize: 24 }}>&#9776;</span>
            )}
          </motion.button>
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
