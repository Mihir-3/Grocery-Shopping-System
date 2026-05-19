import React, { useState } from 'react';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/contact", formData);
      alert("Message sent successfully!");
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      alert("Failed to send message. Please try again later.");
    }
  };
  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <h1 className="page-title" style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5rem' }}>Contact Us</h1>
      
      <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gridAutoRows: 'auto' }}>
        <div className="card" style={{ padding: '40px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '30px', color: 'var(--primary)' }}>Get in Touch</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
              <div style={{ fontSize: '1.5rem' }}>📍</div>
              <div>
                <h3 style={{ marginBottom: '5px' }}>Our Office</h3>
                <p style={{ color: 'var(--text-light)', lineHeight: '1.5' }}>
                  123 Fresh Avenue<br />
                  Silicon Valley, CA 94025
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
              <div style={{ fontSize: '1.5rem' }}>📞</div>
              <div>
                <h3 style={{ marginBottom: '5px' }}>Phone Support</h3>
                <p style={{ color: 'var(--text-light)', lineHeight: '1.5' }}>
                  +1 (800) 123-4567<br />
                  Mon-Fri: 8am - 8pm
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
              <div style={{ fontSize: '1.5rem' }}>✉️</div>
              <div>
                <h3 style={{ marginBottom: '5px' }}>Email Us</h3>
                <p style={{ color: 'var(--text-light)', lineHeight: '1.5' }}>
                  support@freshcart.com<br />
                  hello@freshcart.com
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '40px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: 'var(--primary)' }}>Send a Message</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" className="form-input" placeholder="Your Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="form-input" placeholder="Your Email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea className="form-input" rows="4" placeholder="How can we help you?" style={{ resize: 'vertical' }} required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
