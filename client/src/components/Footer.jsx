import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-section brand-section">
          <h2><span style={{ fontSize: '28px' }}>🛒</span> frshCart</h2>
          <p>Your one-stop destination for fresh groceries, delivered right to your doorstep.</p>
        </div>

        <div className="footer-section links-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-section cities-section">
          <h3>Available Cities in India</h3>
          <ul className="cities-grid">
            <li>Mumbai</li>
            <li>Delhi</li>
            <li>Bangalore</li>
            <li>Hyderabad</li>
            <li>Chennai</li>
            <li>Kolkata</li>
            <li>Pune</li>
            <li>Ahmedabad</li>
            <li>Jaipur</li>
            <li>Surat</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} frshCart. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
