import { useContext } from "react";
import { Store } from "../context/Store";
import axios from "axios";

export default function Cart() {
  const { cart, updateQty, removeItem } = useContext(Store);

  // TOTAL PRICE
  const total = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // PLACE ORDER
  const placeOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/orders",
        {
          items: cart,
          total: total
        },
        {
          headers: { token }
        }
      );

      alert("✅ Order Placed Successfully");

      // OPTIONAL: clear cart (refresh page or reset state)
      window.location.reload();

    } catch (err) {
      console.log(err);
      alert("❌ Order Failed");
    }
  };

  return (
    <div className="cart-page">
      <h2>🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <h3 className="empty">Your cart is empty 😢</h3>
      ) : (
        <>
          <div className="cart-container">
            {cart.map((item) => (
              <div key={item._id} className="cart-item">

                <img src={item.image} alt={item.name} />

                <div className="info">
                  <h3>{item.name}</h3>
                  <p>₹{item.price}</p>

                  <div className="qty">
                    <button
                      onClick={() =>
                        updateQty(item._id, Math.max(1, item.qty - 1))
                      }
                    >
                      -
                    </button>

                    <span>{item.qty}</span>

                    <button
                      onClick={() =>
                        updateQty(item._id, item.qty + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <p className="subtotal">
                    Subtotal: ₹{item.price * item.qty}
                  </p>
                </div>

                <button
                  className="remove"
                  onClick={() => removeItem(item._id)}
                >
                  ❌
                </button>

              </div>
            ))}
          </div>

          {/* TOTAL + CHECKOUT */}
          <div className="cart-summary">
            <h3>Total: ₹{total}</h3>

            <button className="checkout" onClick={placeOrder}>
              💳 Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}