"use client";

import React from "react";
import AdminDashboard from "@/components/AdminDashboard";

export default function AdminPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000", color: "#fff", paddingTop: "80px" }}>
      <AdminDashboard />
    </div>
  );
}
