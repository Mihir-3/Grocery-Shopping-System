import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Admin = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [usersInfo, setUsersInfo] = useState([]);
  const [checkouts, setCheckouts] = useState([]);
  
  // Modes: home, add-product, manage-products, manage-orders, contacts, manage-categories
  const [view, setView] = useState("home");
  
  // Product Form
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  // Category Form
  const [newCatName, setNewCatName] = useState("");

  // Product Edit Form State inline
  const [editingProductId, setEditingProductId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  const fetchData = async () => {
    try {
      const [resProd, resOrd, resCont, resCat, resUsr, resChk] = await Promise.all([
        axios.get("http://localhost:5000/api/products"),
        axios.get("http://localhost:5000/api/orders/all", { headers: { token: user.token } }),
        axios.get("http://localhost:5000/api/contact/all", { headers: { token: user.token } }),
        axios.get("http://localhost:5000/api/categories"),
        axios.get("http://localhost:5000/api/auth/all", { headers: { token: user.token } }),
        axios.get("http://localhost:5000/api/checkouts/all", { headers: { token: user.token } })
      ]);
      setProducts(resProd.data);
      setOrders(resOrd.data);
      setContacts(resCont.data);
      setCategories(resCat.data);
      setUsersInfo(resUsr.data);
      setCheckouts(resChk.data);
      
      if (resCat.data.length > 0 && !category) {
        setCategory(resCat.data[0].name);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Products Logic ---
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image file first.");
    if (!category) return alert("Please select a category.");
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("image", image);

    try {
      await axios.post(
        "http://localhost:5000/api/products", 
        formData,
        { headers: { token: user.token } }
      );
      fetchData();
      setName(""); setPrice(""); setImage(null); setDescription(""); 
      alert("Product added securely to Cloudinary!");
      setView("manage-products"); 
    } catch (err) {
      alert("Failed to add product: " + (err.response?.data?.error || err.response?.data || err.message));
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { token: user.token }
      });
      fetchData();
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  const startEditProduct = (product) => {
    setEditingProductId(product._id);
    setEditName(product.name);
    setEditPrice(product.price);
  };

  const handleSaveProductEdit = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/products/${id}`, 
        { name: editName, price: Number(editPrice) },
        { headers: { token: user.token } }
      );
      setEditingProductId(null);
      fetchData();
    } catch (err) {
      alert("Failed to update product");
    }
  };

  // --- Categories Logic ---
  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/categories", 
        { name: newCatName },
        { headers: { token: user.token } }
      );
      fetchData();
      setNewCatName("");
      alert("Category created!");
    } catch (err) {
      alert("Failed to create category");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure? Removing this won't change existing products, just the dropdown lists.")) return;
    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`, {
        headers: { token: user.token }
      });
      fetchData();
    } catch (err) {
      alert("Failed to delete category");
    }
  };


  // --- Orders Logic ---
  const handleUpdateOrderStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Pending" ? "Delivered" : "Pending";
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}/status`, 
        { status: newStatus },
        { headers: { token: user.token } }
      );
      fetchData();
    } catch (err) {
      alert("Failed to update status");
    }
  };


  return (
    <div className="admin-layout" style={{ margin: '0 -20px' }}>
      {/* Sidebar */}
      <div className="admin-sidebar" style={{ minHeight: '100%' }}>
        <h2 style={{ padding: '0 20px', color: 'var(--primary)', marginBottom: '30px' }}>Admin Panel</h2>
        
        <button 
          className={`admin-nav-item ${view === 'home' ? 'active' : ''}`}
          onClick={() => setView('home')}
        >
          🏠 Dashboard Home
        </button>
        <button 
          className={`admin-nav-item ${view === 'add-product' ? 'active' : ''}`}
          onClick={() => setView('add-product')}
        >
          ➕ Add New Product
        </button>
        <button 
          className={`admin-nav-item ${view === 'manage-products' ? 'active' : ''}`}
          onClick={() => setView('manage-products')}
        >
          📦 Manage Products
        </button>
        <button 
          className={`admin-nav-item ${view === 'manage-categories' ? 'active' : ''}`}
          onClick={() => setView('manage-categories')}
        >
          📂 Manage Categories
        </button>
        <button 
          className={`admin-nav-item ${view === 'manage-orders' ? 'active' : ''}`}
          onClick={() => setView('manage-orders')}
        >
          🚚 Manage Orders
        </button>
        <button 
          className={`admin-nav-item ${view === 'contacts' ? 'active' : ''}`}
          onClick={() => setView('contacts')}
        >
          ✉️ Contact Messages
        </button>
        <button 
          className={`admin-nav-item ${view === 'checkouts' ? 'active' : ''}`}
          onClick={() => setView('checkouts')}
        >
          💳 Checkout Records
        </button>
      </div>

      {/* Main Content Area */}
      <div className="admin-content">
        <h2 className="section-title" style={{ textAlign: 'left', margin: 0, marginBottom: '24px' }}>
          {view === 'home' && 'Platform Overview'}
          {view === 'add-product' && 'Add & Update Products'}
          {view === 'manage-products' && 'Manage Products Catalog'}
          {view === 'manage-categories' && 'Manage Categories'}
          {view === 'manage-orders' && 'Manage Customer Orders'}
          {view === 'contacts' && 'User Contact Messages'}
          {view === 'checkouts' && 'Checkout Records'}
        </h2>

        {view === 'home' && (
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div className="product-card" style={{ flex: 1, minWidth: '250px', padding: '30px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>📦</div>
              <h3 style={{ fontSize: '36px', color: 'var(--primary)', margin: '0' }}>{products.length}</h3>
              <p style={{ color: 'var(--gray-500)', fontWeight: '600', margin: '5px 0 0 0' }}>Total Products</p>
            </div>
            <div className="product-card" style={{ flex: 1, minWidth: '250px', padding: '30px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>👥</div>
              <h3 style={{ fontSize: '36px', color: '#8b5cf6', margin: '0' }}>{usersInfo.length}</h3>
              <p style={{ color: 'var(--gray-500)', fontWeight: '600', margin: '5px 0 0 0' }}>Registered Users</p>
            </div>
            <div className="product-card" style={{ flex: 1, minWidth: '250px', padding: '30px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>🚚</div>
              <h3 style={{ fontSize: '36px', color: '#f59e0b', margin: '0' }}>{orders.length}</h3>
              <p style={{ color: 'var(--gray-500)', fontWeight: '600', margin: '5px 0 0 0' }}>Total Orders</p>
            </div>
          </div>
        )}

        {view === 'add-product' && (
          <div className="product-card" style={{ padding: '30px', maxWidth: '600px' }}>
            <form onSubmit={handleAddProduct}>
              <div className="form-group">
                <label>Product Name</label>
                <input className="form-input" value={name} onChange={e=>setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input type="number" className="form-input" value={price} onChange={e=>setPrice(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select 
                  className="form-input" 
                  value={category} 
                  onChange={e=>setCategory(e.target.value)} 
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                {categories.length === 0 && <small style={{color:'red'}}>No categories exist. Please create one first.</small>}
              </div>
              <div className="form-group">
                <label>Description (Quantity & Ingredients)</label>
                <textarea 
                  className="form-input" 
                  value={description} 
                  onChange={e=>setDescription(e.target.value)} 
                  rows="4" 
                  placeholder="e.g. 500g Pack. Contains farm-fresh organic ingredients."
                />
              </div>
              <div className="form-group">
                <label>Product Image File</label>
                <input type="file" className="form-input" accept="image/*" onChange={e=>setImage(e.target.files[0])} required />
              </div>
              <button type="submit" className="btn btn-primary form-submit" style={{ fontSize: '18px', padding: '12px' }} disabled={categories.length === 0}>
                Upload & Publish Product
              </button>
            </form>
          </div>
        )}

        {view === 'manage-products' && (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 && <tr><td colSpan="5">No products found.</td></tr>}
                {products.map(p => (
                  <tr key={p._id}>
                    <td><img src={p.image} className="img-cell" alt={p.name} /></td>
                    <td style={{ fontWeight: '500' }}>
                      {editingProductId === p._id ? (
                        <input 
                          type="text" 
                          value={editName} 
                          onChange={(e) => setEditName(e.target.value)} 
                          style={{ padding: '6px', width: '100%' }}
                        />
                      ) : p.name}
                    </td>
                    <td><span className="status-badge success">{p.category}</span></td>
                    <td style={{ fontWeight: 'bold' }}>
                      {editingProductId === p._id ? (
                        <input 
                          type="number" 
                          value={editPrice} 
                          onChange={(e) => setEditPrice(e.target.value)} 
                          style={{ padding: '6px', width: '80px' }}
                        />
                      ) : `₹${p.price}`}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {editingProductId === p._id ? (
                          <>
                            <button 
                              className="btn btn-primary" 
                              style={{ padding: '6px 12px', fontSize: '14px' }}
                              onClick={() => handleSaveProductEdit(p._id)}
                            >
                              Save
                            </button>
                            <button 
                              className="btn btn-secondary" 
                              style={{ padding: '6px 12px', fontSize: '14px' }}
                              onClick={() => setEditingProductId(null)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              className="btn btn-secondary" 
                              style={{ padding: '6px 12px', fontSize: '14px', color: 'var(--primary)', borderColor: 'var(--primary)' }}
                              onClick={() => startEditProduct(p)}
                            >
                              Edit
                            </button>
                            <button 
                              className="btn btn-secondary" 
                              style={{ padding: '6px 12px', fontSize: '14px', color: '#ef4444', borderColor: '#ef4444' }}
                              onClick={() => handleDeleteProduct(p._id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === 'manage-categories' && (
          <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
            <div className="product-card" style={{ padding: '30px', flex: 1, position: 'sticky', top: '100px' }}>
              <h3 style={{ marginBottom: '20px' }}>Add New Category</h3>
              <form onSubmit={handleAddCategory}>
                <div className="form-group">
                  <label>Category Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Exotic Fruits"
                    value={newCatName} 
                    onChange={e=>setNewCatName(e.target.value)} 
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-primary form-submit">
                  Create Category
                </button>
              </form>
            </div>

            <div className="table-wrapper" style={{ flex: 2 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Created At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length === 0 && <tr><td colSpan="3">No categories defined yet.</td></tr>}
                  {categories.map(c => (
                    <tr key={c._id}>
                      <td style={{ fontWeight: '600' }}>{c.name}</td>
                      <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '6px 12px', fontSize: '12px', color: '#ef4444', borderColor: '#ef4444' }}
                          onClick={() => handleDeleteCategory(c._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {view === 'manage-orders' && (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 && <tr><td colSpan="6">No orders found.</td></tr>}
                {orders.map(o => (
                  <tr key={o._id}>
                    <td>...{o._id.slice(-6)}</td>
                    <td style={{ fontWeight: '500' }}>
                      {usersInfo.find(u => u._id === o.userId)?.name || 'Unknown'}
                    </td>
                    <td>{new Date(o.createdAt).toLocaleString()}</td>
                    <td>{o.items.length}</td>
                    <td style={{ fontWeight: 'bold' }}>₹{o.total}</td>
                    <td>
                      <span className={`status-badge ${o.status === 'Delivered' ? 'success' : 'warning'}`}>
                        {o.status || 'Pending'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                        onClick={() => handleUpdateOrderStatus(o._id, o.status || 'Pending')}
                      >
                        Mark as {o.status === 'Pending' || !o.status ? 'Delivered' : 'Pending'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === 'contacts' && (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 && <tr><td colSpan="4">No messages found.</td></tr>}
                {contacts.map(c => (
                  <tr key={c._id}>
                    <td style={{ fontWeight: '500' }}>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{new Date(c.createdAt).toLocaleString()}</td>
                    <td style={{ maxWidth: '300px', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>{c.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === 'checkouts' && (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Date & Time</th>
                  <th>Delivery Address</th>
                  <th>Payment Method</th>
                </tr>
              </thead>
              <tbody>
                {checkouts.length === 0 && <tr><td colSpan="5">No checkout records found.</td></tr>}
                {checkouts.map(c => (
                  <tr key={c._id}>
                    <td style={{ fontWeight: '500', color: 'var(--primary)' }}>#{c.orderId.slice(-8).toUpperCase()}</td>
                    <td>{c.customerName || 'Unknown'}</td>
                    <td>{new Date(c.createdAt).toLocaleString()}</td>
                    <td style={{ maxWidth: '300px', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>{c.delivery}</td>
                    <td><span className="status-badge success">{c.paymentMethod}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;