import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);
  const [orderId, setOrderId] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");

  useEffect(() => {
    // If user somehow accesses /success without buying, redirect them to home
    if (!location.state || !location.state.orderId) {
      navigate("/");
    } else {
      setOrderId(location.state.orderId);
      
      // Calculate delivery time 10 minutes from now
      const date = new Date(Date.now() + 10 * 60000);
      const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setDeliveryTime(`Today by ${formattedTime}`);

      clearCart();
    }
  }, [location, navigate, clearCart]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "75vh" }}>
      <div className="card" style={{ padding: "50px", textAlign: "center", maxWidth: "500px", width: "100%", position: "relative", overflow: "hidden" }}>
        
        {/* Animated Checkmark Simulation */}
        <div style={{ 
          width: "100px", height: "100px", borderRadius: "50%", background: "var(--primary-light)",
          display: "flex", justifyContent: "center", alignItems: "center", margin: "0 auto 30px auto",
          boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)"
        }}>
          <span style={{ fontSize: "50px", color: "var(--white)", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}>
            ✓
          </span>
        </div>

        <h1 style={{ fontSize: "36px", color: "var(--primary-dark)", marginBottom: "16px" }}>Thank You!</h1>
        <h2 style={{ fontSize: "20px", color: "var(--secondary)", marginBottom: "20px" }}>Order Placed Successfully</h2>
        
        <p style={{ fontSize: "16px", color: "var(--text-light)", lineHeight: "1.6", marginBottom: "30px" }}>
          We have beautifully securely packaged your items. Your order 
          <strong style={{ color: "var(--primary)", display: "block", fontSize: "18px", marginTop: "10px" }}>
            #{orderId.slice(-8).toUpperCase()}
          </strong> 
          is currently being prepared!
        </p>

        <div style={{ background: "var(--bg-body)", padding: "16px", borderRadius: "8px", marginBottom: "30px" }}>
          <p style={{ margin: 0, fontWeight: "600", color: "var(--gray-500)" }}>
            ⚡ Estimated Delivery: <span style={{ color: "var(--primary)" }}>{deliveryTime}</span>
          </p>
        </div>

        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <button 
            className="btn btn-secondary" 
            style={{ flex: 1, minWidth: "160px" }}
            onClick={() => navigate("/profile")}
          >
            Track Order
          </button>
          <button 
            className="btn btn-primary" 
            style={{ flex: 1, minWidth: "160px" }}
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;
