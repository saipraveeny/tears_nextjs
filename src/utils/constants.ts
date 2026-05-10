/**
 * Application constants
 */

export const API_BASE = process.env.REACT_APP_API_BASE || "https://tears-api.vercel.app";

export const NAV_ITEMS = [
  { name: "Home", href: "#home" },
  { name: "Features", href: "#features" },
  { name: "Products", href: "#products" },
  { name: "Merchandise", href: "#merchandise" },
  { name: "Benefits", href: "#benefits" },
  { name: "Recipes", href: "#recipes" },
  { name: "Partner With Us", href: "partner" },
  { name: "Contact", href: "#contact" },
];

export const BUNDLE_PRODUCT = {
  id: "bundle-160",
  name: "Special Bundle: All 3 Variants + Tube",
  price: "₹160.00",
  description: "Get all 3 hot sauce variants and a tube for just ₹160!",
  qty: 1,
  isBundle: true,
};

export const PAYMENT_METHODS = {
  CARD: "card",
  UPI: "upi",
  COD: "cod",
};

export const MAX_POLLS = 100;
export const POLLS_FREQUENCY_IN_MS = 3000;
