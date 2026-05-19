import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Welcome Back</h2>
        <p>Login to your account to continue shopping</p>
        
        {error && <div style={{color: 'red', marginBottom: '16px', textAlign: 'center'}}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address or Username</label>
            <input 
              type="text" 
              className="form-input" 
              value={email} // treating 'email' state as username/email
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary form-submit">Sign In / Login</button>
        </form>
        
        <div className="auth-redirect">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;