import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartCount, toggleSidebar } = useContext(CartContext);
  
  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="nav-brand">
          <span style={{ fontSize: '28px' }}>🛒</span> frshCart
        </Link>
        
        <div className="nav-links">
          {(!user || !user.isAdmin) && (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/about" className="nav-link">About Us</Link>
              <Link to="/contact" className="nav-link">Contact Us</Link>
            </>
          )}
          {user && user.isAdmin && (
            <Link to="/admin" className="nav-link">Dashboard</Link>
          )}

          {(!user || !user.isAdmin) && (
            <button className="cart-btn" onClick={toggleSidebar}>
              🛍️
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          )}

          {user ? (
            <div className="user-menu">
              <div className="user-btn">
                👤 {user.name}
              </div>
              <div className="user-dropdown">
                <Link to="/profile" className="dropdown-item">My Profile</Link>
                <div 
                  className="dropdown-item danger" 
                  onClick={logout}
                  style={{cursor: 'pointer'}}
                >
                  Logout
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/admin-login" className="btn btn-secondary" style={{padding: '8px 16px', fontSize: '14px'}}>
                Admin Login
              </Link>
              <Link to="/login" className="btn btn-primary" style={{padding: '8px 16px', fontSize: '14px'}}>
                Login / Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;