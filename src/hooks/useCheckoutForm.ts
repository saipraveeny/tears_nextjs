import { useState } from "react";

/**
 * Custom hook for checkout form management
 */
export const useCheckoutForm = () => {
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "upi",
    cardNumber: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const handleCheckoutChange = (field, value) =>
    setCheckoutForm((prev) => ({ ...prev, [field]: value }));

  const handleInputKeyDown = (e) => {
    if (e.key !== "Enter") return;
    if (e.target.tagName === "TEXTAREA") return;
    e.preventDefault();
    const form = e.target.form;
    if (!form) return;
    const controls = Array.from(form.elements).filter((el) => {
      if (el.disabled) return false;
      if (el.type === "hidden") return false;
      return /INPUT|TEXTAREA|SELECT|BUTTON/.test(el.tagName);
    });
    const idx = controls.indexOf(e.target);
    for (let i = idx + 1; i < controls.length; i++) {
      const next = controls[i];
      if (next && typeof next.focus === "function") {
        next.focus();
        return;
      }
    }
  };

  const validateCheckoutForm = () => {
    const errs = {};
    if (!checkoutForm.name.trim()) errs.name = "Name is required";
    if (!/^\d{10}$/.test(checkoutForm.phone.replace(/\s+/g, "")))
      errs.phone = "Enter a valid 10-digit mobile number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkoutForm.email))
      errs.email = "Enter valid email";
    if (!checkoutForm.address.trim()) errs.address = "Address is required";
    if (!checkoutForm.city.trim()) errs.city = "City is required";
    if (!checkoutForm.state.trim()) errs.state = "State is required";
    if (!checkoutForm.pincode.trim()) errs.pincode = "Pincode is required";
    else if (!/^\d{5,6}$/.test(checkoutForm.pincode.trim())) errs.pincode = "Enter valid pincode";
    if (checkoutForm.paymentMethod === "card") {
      if (!/^\d{12,19}$/.test(checkoutForm.cardNumber.replace(/\s+/g, "")))
        errs.cardNumber = "Enter valid card number";
    }
    return errs;
  };

  return {
    checkoutForm,
    formErrors,
    submitting,
    orderSuccess,
    setCheckoutForm,
    setFormErrors,
    setSubmitting,
    setOrderSuccess,
    handleCheckoutChange,
    handleInputKeyDown,
    validateCheckoutForm,
  };
};
