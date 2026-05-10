import { PaymentForm } from "../PaymentForm/PaymentForm";
import { useState } from "react";

const Cart = () => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handleCheckoutClick = () => {
    setShowPaymentForm(true);
  };

  return (
    <div className="cart-container">
      {/* ...existing cart items code... */}

      <button className="checkout-button" onClick={handleCheckoutClick}>
        Proceed to Checkout
      </button>

      {showPaymentForm && (
        <PaymentForm onClose={() => setShowPaymentForm(false)} />
      )}
    </div>
  );
};

export default Cart;
