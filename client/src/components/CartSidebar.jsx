import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CartSidebar = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    isSidebarOpen,
    toggleSidebar,
    clearCart
  } = useContext(CartContext);
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      toggleSidebar();
      navigate('/login');
      return;
    }
    toggleSidebar();
    navigate('/checkout');
  };

  return (
    <>
      <div 
        className={`cart-overlay ${isSidebarOpen ? 'open' : ''}`}
        onClick={toggleSidebar}
      />
      <div className={`cart-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-cart" onClick={toggleSidebar}>✕</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-state">
              <h3>Cart is empty</h3>
              <p>Looks like you haven't added anything yet.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-img">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-details">
                  <div className="cart-item-title">{item.name}</div>
                  <div className="cart-item-price">₹{item.price}</div>
                  <div className="cart-item-actions">
                    <button 
                      className="qty-btn"
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    >-</button>
                    <span>{item.quantity}</span>
                    <button 
                      className="qty-btn"
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    >+</button>
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromCart(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            {user && user.hasUsedFirstDiscount === false && (
              <div className="cart-discount-badge" style={{ background: '#ecfdf5', color: '#059669', padding: '8px', borderRadius: '4px', marginBottom: '10px', fontSize: '14px', textAlign: 'center', fontWeight: 'bold' }}>
                🎉 First-Time 50% Off Applied!
              </div>
            )}
            <div className="cart-total">
              <span>Total</span>
              <span>
                {user && user.hasUsedFirstDiscount === false ? (
                  <>
                    <span style={{ textDecoration: 'line-through', color: '#94a3b8', marginRight: '10px' }}>₹{cartTotal}</span>
                    <span style={{ color: '#059669' }}>₹{cartTotal * 0.5}</span>
                  </>
                ) : (
                  `₹${cartTotal}`
                )}
              </span>
            </div>
            <button className="btn btn-primary checkout-btn" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
