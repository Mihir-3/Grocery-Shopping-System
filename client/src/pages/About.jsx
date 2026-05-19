import React from 'react';

const About = () => {
  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <h1 className="page-title" style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5rem' }}>About Us</h1>
      
      <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gridAutoRows: 'auto' }}>
        <div className="card" style={{ padding: '40px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: 'var(--primary)' }}>Our Story</h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-light)', fontSize: '1.1rem' }}>
            FreshCart began with a simple idea: bringing the freshest, highest-quality groceries directly to your doorstep. We believe that access to premium, healthy food should be convenient and reliable. Since our inception, we have partnered with local farmers and top-tier suppliers to ensure every item meets our strict standards of quality.
          </p>
        </div>

        <div className="card" style={{ padding: '40px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: 'var(--primary)' }}>Our Mission</h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-light)', fontSize: '1.1rem' }}>
            To revolutionize the way you shop for groceries by providing a seamless, fast, and secure online platform. We are committed to sustainability, reducing food waste, and supporting local communities. Our modern approach to grocery shopping is designed to give you back your most valuable asset: time.
          </p>
        </div>

        <div className="card" style={{ padding: '40px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: 'var(--primary)' }}>Our Promise</h2>
          <p style={{ lineHeight: '1.8', color: 'var(--text-light)', fontSize: '1.1rem' }}>
            When you shop with us, you are guaranteed uncompromising freshness, transparent pricing, and unparalleled customer service. If it isn't good enough for our own family table, we simply won't deliver it to yours. Your 100% satisfaction is built into every single box we pack.
          </p>
        </div>

        <div className="card" style={{ padding: '40px', gridColumn: '1 / -1', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: 'var(--primary)' }}>Why Choose FreshCart?</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', marginTop: '30px' }}>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🚀</div>
              <h3 style={{ marginBottom: '10px' }}>Lightning Fast</h3>
              <p style={{ color: 'var(--text-light)' }}>Same-day delivery for all your essential needs.</p>
            </div>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🌿</div>
              <h3 style={{ marginBottom: '10px' }}>Always Fresh</h3>
              <p style={{ color: 'var(--text-light)' }}>Hand-picked quality, guaranteed fresh every time.</p>
            </div>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🔒</div>
              <h3 style={{ marginBottom: '10px' }}>Secure Shopping</h3>
              <p style={{ color: 'var(--text-light)' }}>Your data is protected with enterprise-grade security.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
