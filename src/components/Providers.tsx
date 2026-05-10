"use client";

import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/hooks/useCart";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  );
}
