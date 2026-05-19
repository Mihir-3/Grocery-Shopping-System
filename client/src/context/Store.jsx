import { createContext, useState } from "react";

export const Store = createContext();

export const StoreProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // ADD TO CART
  const addToCart = (product) => {
    const exist = cart.find(item => item._id === product._id);

    if (exist) {
      setCart(cart.map(item =>
        item._id === product._id
          ? { ...item, qty: item.qty + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  // UPDATE QTY
  const updateQty = (id, qty) => {
    setCart(cart.map(item =>
      item._id === id ? { ...item, qty } : item
    ));
  };

  // REMOVE
  const removeItem = (id) => {
    setCart(cart.filter(item => item._id !== id));
  };

  // WISHLIST
  const addToWishlist = (product) => {
    if (!wishlist.find(i => i._id === product._id)) {
      setWishlist([...wishlist, product]);
    }
  };

  return (
    <Store.Provider value={{
      cart, addToCart, updateQty, removeItem,
      wishlist, addToWishlist
    }}>
      {children}
    </Store.Provider>
  );
};