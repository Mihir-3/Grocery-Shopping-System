import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders", {
          headers: { token: user.token }
        });
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  return (
    <div style={{ padding: '40px 0' }}>
      <h2 className="section-title">My Profile</h2>
      
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div className="product-card" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>Account Details</h3>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.isAdmin ? 'Administrator' : 'Customer'}</p>
          </div>
        </div>

        <div style={{ flex: '2', minWidth: '300px' }}>
          <h3 style={{ marginBottom: '20px' }}>Order History</h3>
          {orders.length === 0 ? (
            <div className="empty-state">No orders found.</div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id}>
                      <td>{o._id.substring(0, 8)}...</td>
                      <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td>{o.items.length} items</td>
                      <td style={{ fontWeight: 'bold' }}>₹{o.total}</td>
                      <td>
                        <span className={`status-badge ${o.status === 'Delivered' ? 'success' : 'warning'}`} style={{
                          padding: '4px 8px', 
                          borderRadius: '12px', 
                          fontSize: '12px',
                          background: o.status === 'Pending' ? '#fef3c7' : '#dcfce3',
                          color: o.status === 'Pending' ? '#92400e' : '#166534'
                        }}>
                          {o.status}
                        </span>
                      </td>
                      <td>
                        {o.status === "Pending" && (
                          <button 
                            onClick={async () => {
                              if(window.confirm('Are you sure you want to cancel this order?')) {
                                try {
                                  await axios.put(`http://localhost:5000/api/orders/${o._id}/cancel`, {}, {
                                    headers: { token: user.token }
                                  });
                                  const res = await axios.get("http://localhost:5000/api/orders", {
                                    headers: { token: user.token }
                                  });
                                  setOrders(res.data);
                                } catch(err) {
                                  alert('Failed to cancel order: ' + (err.response?.data || err.message));
                                }
                              }
                            }}
                            style={{ background: '#ef4444', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
