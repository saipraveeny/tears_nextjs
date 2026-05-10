import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE } from '../utils/constants';

interface AuthContextType {
  currentUser: any;
  loading: boolean;
  login: (user: any) => void;
  logout: () => Promise<void>;
  requireAuth: (callback: () => void) => void;
  authModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  updateProfile: (profileData: any) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalCallback, setAuthModalCallback] = useState(null);

  const checkUserSession = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/user/profile`, {
        // Required for cookies to be sent
        // credentials: "omit" -- actually we run local so we need to ensure proxy or credentials are sent:
        // Wait, for same-origin dev server we might not need anything, but if different origin, need `credentials: 'include'`
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserSession();
  }, []);

  const login = (user) => {
    setCurrentUser(user);
    if (authModalCallback) authModalCallback();
    setAuthModalOpen(false);
    setAuthModalCallback(null);
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST', credentials: 'include' });
      setCurrentUser(null);
    } catch(e) {
      console.error(e);
    }
  };

  const requireAuth = (callback) => {
    if (currentUser) {
      callback();
    } else {
      setAuthModalCallback(() => callback);
      setAuthModalOpen(true);
    }
  };

  const openAuthModal = () => setAuthModalOpen(true);
  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setAuthModalCallback(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await fetch(`${API_BASE}/api/user/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        return { success: true };
      } else {
        const data = await res.json();
        return { success: false, error: data.error };
      }
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      loading,
      login,
      logout,
      requireAuth,
      authModalOpen,
      openAuthModal,
      closeAuthModal,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
