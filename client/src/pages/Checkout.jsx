import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [loading, setLoading] = useState(false);

  // If cart is empty, redirect back to home.
  useEffect(() => {
    if (cart.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const discountApplies = user && user.hasUsedFirstDiscount === false;
  const finalTotal = discountApplies ? cartTotal * 0.5 : cartTotal;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address || !phone) return alert("Please fill in all delivery details.");

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/orders",
        {
          items: cart,
          total: finalTotal,
          address: `${address} (Phone: ${phone})`,
          paymentMethod
        },
        { headers: { token: user.token } }
      );
      
      if (res.data.hasUsedFirstDiscount) {
        user.hasUsedFirstDiscount = true;
      }

      navigate("/success", { state: { orderId: res.data.order._id } });
    } catch (err) {
      console.error("Checkout Error Payload:", err);
      alert("Failed to place order: " + (err.response?.data?.message || err.response?.data || err.message || "Unknown error"));
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px 0" }}>
      <h2 className="section-title">Checkout</h2>
      
      <div className="checkout-container">
        {/* Left Side - Form */}
        <div className="checkout-form-wrapper">
          <form className="checkout-form" onSubmit={handlePlaceOrder}>
            <h3>Delivery Details</h3>
            
            <div className="form-group">
              <label>Full Address</label>
              <textarea 
                className="form-input" 
                rows="3" 
                placeholder="123 Farm Lane, Apt 4B, City, Zip Code"
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="+1 234 567 8900"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required 
              />
            </div>

            <h3 style={{ marginTop: "30px", marginBottom: "16px" }}>Payment Method</h3>
            <div className="payment-options">
              <label className={`payment-label ${paymentMethod === "Credit Card" ? "selected" : ""}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="Credit Card" 
                  checked={paymentMethod === "Credit Card"} 
                  onChange={e => setPaymentMethod(e.target.value)} 
                />
                <span className="payment-text">Credit / Debit Card</span>
              </label>
              <label className={`payment-label ${paymentMethod === "Cash on Delivery" ? "selected" : ""}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="Cash on Delivery" 
                  checked={paymentMethod === "Cash on Delivery"} 
                  onChange={e => setPaymentMethod(e.target.value)} 
                />
                <span className="payment-text">Cash on Delivery</span>
              </label>
              <label className={`payment-label ${paymentMethod === "UPI" ? "selected" : ""}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="UPI" 
                  checked={paymentMethod === "UPI"} 
                  onChange={e => setPaymentMethod(e.target.value)} 
                />
                <span className="payment-text">UPI / Net Banking</span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary place-order-btn" disabled={loading || cart.length === 0}>
              {loading ? "Processing..." : `Place Order (₹${finalTotal})`}
            </button>
          </form>
        </div>

        {/* Right Side - Summary */}
        <div className="checkout-summary-wrapper">
          <div className="checkout-summary">
            <h3 style={{ marginBottom: "20px" }}>Order Summary</h3>
            
            <div className="summary-items">
              {cart.map(item => (
                <div key={item._id} className="summary-item">
                  <div className="summary-item-info">
                    <span className="summary-item-qty">{item.quantity}x</span>
                    <span className="summary-item-name">{item.name}</span>
                  </div>
                  <span className="summary-item-price">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span style={{ color: "var(--primary)" }}>Free</span>
              </div>
              
              {discountApplies && (
                <div className="summary-row discount-row">
                  <span>First-Time 50% Off 🎉</span>
                  <span>-₹{cartTotal * 0.5}</span>
                </div>
              )}
              
              <div className="summary-row final-total">
                <span>Total to Pay</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
