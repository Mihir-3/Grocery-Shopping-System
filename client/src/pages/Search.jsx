import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/products");
        const allProducts = res.data;
        const filtered = allProducts.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase())
        );
        setProducts(filtered);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (query) {
      fetchProducts();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <div style={{padding: '40px 0'}}>
      <h2 className="section-title" style={{textAlign: 'left', marginBottom: '24px'}}>Search Results for "{query}"</h2>
      
      {loading ? (
        <div style={{textAlign: 'center', padding: '40px'}}>Loading...</div>
      ) : (
        <>
          <div className="grid">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          {products.length === 0 && (
            <div className="empty-state">
              <h3 style={{fontSize: '24px', color: '#94a3b8'}}>No products match your search.</h3>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Search;
