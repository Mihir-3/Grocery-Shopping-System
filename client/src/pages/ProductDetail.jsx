import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/find/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>Loading Product...</div>;
  if (!product) return <div style={{ textAlign: "center", padding: "50px" }}>Product not found. <button onClick={() => navigate("/")} className="btn btn-primary" style={{ marginTop: "20px" }}>Back Home</button></div>;

  const handleDecrease = () => {
    if (qty > 1) setQty(qty - 1);
  };

  const handleIncrease = () => {
    setQty(qty + 1);
  };

  const handleAddToCart = () => {
    addToCart(product, qty);
  };

  return (
    <div className="container" style={{ padding: "40px 0" }}>
      <button 
        onClick={() => navigate(-1)} 
        className="btn btn-secondary" 
        style={{ marginBottom: "20px" }}
      >
        ← Back
      </button>
      
      <div style={{ display: "flex", flexWrap: "wrap", gap: "40px", backgroundColor: "var(--white)", padding: "40px", borderRadius: "var(--radius)", boxShadow: "var(--shadow)" }}>
        {/* Left: Image */}
        <div style={{ flex: "1 1 400px" }}>
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ width: "100%", height: "400px", objectFit: "cover", borderRadius: "12px" }} 
          />
        </div>
        
        {/* Right: Details */}
        <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <span className="status-badge success" style={{ alignSelf: "flex-start", marginBottom: "10px" }}>
            {product.category}
          </span>
          <h1 style={{ fontSize: "2.5rem", margin: "0 0 10px 0", color: "var(--gray-900)" }}>
            {product.name}
          </h1>
          <h2 style={{ fontSize: "2rem", color: "var(--primary)", margin: "0 0 20px 0" }}>
            ₹{product.price}
          </h2>
          
          <div style={{ marginBottom: "30px", borderTop: "1px solid var(--gray-200)", borderBottom: "1px solid var(--gray-200)", padding: "20px 0" }}>
            <h3 style={{ margin: "0 0 10px 0", color: "var(--gray-700)" }}>Product Detail & Specifications</h3>
            <p style={{ color: "var(--gray-500)", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
              {product.description || "Fresh and high quality product carefully selected for you. Order now for fast delivery!"}
            </p>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--gray-200)", borderRadius: "var(--radius)", overflow: "hidden" }}>
              <button 
                onClick={handleDecrease}
                style={{ padding: "10px 15px", background: "var(--gray-100)", border: "none", cursor: "pointer", fontSize: "1.2rem", fontWeight: "bold" }}
              >
                -
              </button>
              <div style={{ width: "50px", textAlign: "center", fontSize: "1.2rem", fontWeight: "bold" }}>
                {qty}
              </div>
              <button 
                onClick={handleIncrease}
                style={{ padding: "10px 15px", background: "var(--gray-100)", border: "none", cursor: "pointer", fontSize: "1.2rem", fontWeight: "bold" }}
              >
                +
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="btn btn-primary" 
              style={{ flex: 1, padding: "15px", fontSize: "1.1rem" }}
            >
              Add {qty} to Cart — ₹{product.price * qty}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
