import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.get("http://localhost:5000/api/auth/me", {
            headers: { token }
          });
          setUser({ ...res.data, token });
        } catch (err) {
          console.error("Token verification failed", err);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    checkLoggedUser();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setUser({ ...res.data.user, token: res.data.token });
  };

  const register = async (name, email, password) => {
    await axios.post("http://localhost:5000/api/auth/register", { name, email, password });
    // Auto login after register
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
