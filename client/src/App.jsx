import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/ProductDetail";
import Search from "./pages/Search";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSidebar";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <CartSidebar />
      <div className="container" style={{ minHeight: '80vh', paddingBottom: '40px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" />} />
          <Route path="/success" element={user ? <Success /> : <Navigate to="/login" />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to={user?.isAdmin ? "/admin" : "/"} />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to={user?.isAdmin ? "/admin" : "/"} />} />
          <Route path="/admin-login" element={!user ? <AdminLogin /> : <Navigate to={user?.isAdmin ? "/admin" : "/"} />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/admin" element={user?.isAdmin ? <Admin /> : <Navigate to="/" />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;