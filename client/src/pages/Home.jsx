import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProd, resCat] = await Promise.all([
          axios.get("http://localhost:5000/api/products"),
          axios.get("http://localhost:5000/api/categories")
        ]);
        setProducts(resProd.data);
        setDbCategories(resCat.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchData();
  }, []);

  const backendCats = dbCategories.map(c => c.name);
  const categories = ["All", ...new Set([...backendCats, ...products.map(p => p.category)])];

  // Filtering products
  const filteredProducts = products.filter(p => {
    return category === "All" || p.category === category;
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  const trendingProducts = products.slice(0, 5); // Just mocked trending items

  return (
    <div>
      {/* Search Bar - Overlapping */}
      <form className="search-glass" onSubmit={handleSearchSubmit}>
        <input 
          type="text" 
          placeholder="Search for fresh groceries..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="search-glass-btn">🔍</button>
      </form>

      {/* Bento Box Hero Section */}
      <section className="bento-section">
        <div className="bento-grid">
          {/* Main Large Bento */}
          <div className="bento-card bento-large">
            <img className="bento-bg" src="https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=800&q=80" alt="Fresh Fruits" />
            <div className="bento-overlay"></div>
            <div className="bento-content">
              <span className="bento-tag">Fresh Arrival</span>
              <h2 className="bento-title">Organic Farm<br/>Fruits & Veggies</h2>
              <p className="bento-desc">Direct from local farms to your kitchen.</p>
            </div>
          </div>
          
          {/* Side Tall Bento */}
          <div className="bento-card bento-tall">
            <img className="bento-bg" src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=400&q=80" alt="Groceries" />
            <div className="bento-overlay"></div>
            <div className="bento-content">
              <span className="bento-tag" style={{background: '#f59e0b'}}>Trending</span>
              <h2 className="bento-title" style={{fontSize: '22px'}}>Weekly Essentials</h2>
            </div>
          </div>

          {/* Normal Size Bento */}
          <div className="bento-card">
            <img className="bento-bg" src="https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=400&q=80" alt="Bakery" />
            <div className="bento-overlay"></div>
            <div className="bento-content">
              <span className="bento-tag" style={{background: '#8b5cf6'}}>Bakery</span>
              <h2 className="bento-title" style={{fontSize: '20px'}}>Freshly Baked</h2>
            </div>
          </div>

          <div className="bento-card">
            <img className="bento-bg" src="https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80" alt="Dairy" />
            <div className="bento-overlay"></div>
            <div className="bento-content">
              <span className="bento-tag" style={{background: '#3b82f6'}}>Dairy</span>
              <h2 className="bento-title" style={{fontSize: '20px'}}>Milk & Cheese</h2>
            </div>
          </div>
        </div>
      </section>

      {/* Category Bubbles */}
      <div className="category-bubbles">
        {categories.map(cat => (
          <button 
            key={cat} 
            className={`cat-bubble ${category === cat ? 'active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {category === cat && <span>✓</span>} {cat}
          </button>
        ))}
      </div>

      {/* Main Product Grid */}
      <div className="grid">
        {filteredProducts.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <div className="empty-state">
          <h3 style={{fontSize: '24px', color: '#94a3b8'}}>No products match your search.</h3>
        </div>
      )}

      {/* Promotional Strip */}
      <div className="promo-strip">
        <div>
          <h2>Get 50% Off First Deal</h2>
          <p>Sign up today and your 50% discount will be automatically applied at checkout on your first order!</p>
        </div>
        <button className="btn" onClick={() => navigate('/register')}>Claim Offer</button>
      </div>

      {/* Trending Horizontal Scroll */}
      <div className="trending-container">
        <h2 className="section-title">Trending This Week</h2>
        <div className="trending-scroll">
          {trendingProducts.map(product => (
             <div key={product._id} style={{width: '280px', flexShrink: 0}}>
               <ProductCard product={product} />
             </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Home;