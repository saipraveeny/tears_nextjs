/**
 * Cart utility functions
 */

export const computeCartTotals = (cartItems) => {
  const productQty = cartItems.reduce((acc, item) => {
    const key = String(item.name).toLowerCase();
    acc[key] = (acc[key] || 0) + item.qty;
    return acc;
  }, {});

  // Existing Green-only promotion: ₹100 off per 3 Green bottles
  const greenCount = productQty["green (100ml)"] || productQty["green"] || 0;
  const greenSets = Math.floor(greenCount / 3);
  const greenDiscount = greenSets * 100;

  // New bundle promotion: ₹100 off if cart has Green + Wild + Glitch (once per full combo)
  const wildCount = productQty["wild (100ml)"] || productQty["wild"] || 0;
  const glitchCount = productQty["glitch (100ml)"] || productQty["glitch"] || 0;
  const bundleSets = Math.min(greenCount, wildCount, glitchCount);
  const bundleDiscount = bundleSets * 100;

  const discountAmount = greenDiscount + bundleDiscount;

  const totalBeforeDiscount = cartItems.reduce(
    (sum, item) =>
      sum + parseFloat(String(item.price).replace(/[^\d.]/g, "")) * item.qty,
    0,
  );

  const total = totalBeforeDiscount - discountAmount;
  return { total, discountAmount, totalBeforeDiscount };
};

export const formatCurrency = (amount) => {
  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const getProductImage = (productName, wildImg, glitchImg, greenImg) => {
  if (productName === "Wild (100ml)") return wildImg;
  if (productName === "Glitch (100ml)") return glitchImg;
  if (productName === "Green") return greenImg;
  return null;
};
