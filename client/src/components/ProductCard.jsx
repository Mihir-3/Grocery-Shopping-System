import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <div className="product-card">
      <div 
        className="product-img-wrapper" 
        onClick={() => navigate(`/product/${product._id}`)}
        style={{ cursor: 'pointer' }}
      >
        <span className="product-category">{product.category}</span>
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h3 
          className="product-title" 
          onClick={() => navigate(`/product/${product._id}`)}
          style={{ cursor: 'pointer' }}
        >
          {product.name}
        </h3>
        <div className="product-bottom">
          <span className="product-price">₹{product.price}</span>
          <button 
            className="add-to-cart" 
            onClick={() => addToCart(product)}
            title="Add to Cart"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;