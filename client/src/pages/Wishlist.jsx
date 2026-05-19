import { useContext } from "react";
import { Store } from "../context/Store";

export default function Wishlist() {
  const { wishlist, addToCart } = useContext(Store);

  return (
    <div>
      <h2>❤️ Wishlist</h2>

      {wishlist.map(item => (
        <div key={item._id}>
          <h3>{item.name}</h3>
          <button onClick={() => addToCart(item)}>
            Move to Cart
          </button>
        </div>
      ))}
    </div>
  );
}