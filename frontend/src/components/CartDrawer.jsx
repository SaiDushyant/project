import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

function closeCart() {
  document.getElementById("cart-drawer").classList.remove("open");
  document.getElementById("overlay").classList.remove("open");
}

export default function CartDrawer() {
  const { cart, removeFromCart, updateQty, totalPrice } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  return (
    <>
      <div className="overlay" id="overlay" onClick={closeCart} />
      <div className="cart-drawer" id="cart-drawer">
        <div className="cart-header">
          <h2>🛒 Your Cart</h2>
          <button className="btn-icon" onClick={closeCart}>✕</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="empty-icon">🛒</div>
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item._id}>
                <img className="cart-item-img" src={item.image} alt={item.name} />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">₹{item.price.toFixed(2)}</div>
                  <div className="cart-item-qty">
                    <button
                      className="qty-btn"
                      style={{ width: 26, height: 26 }}
                      onClick={() => updateQty(item._id, -1)}
                    >−</button>
                    <span>{item.qty}</span>
                    <button
                      className="qty-btn"
                      disabled={item.isFreeGift}
                      style={{ width: 26, height: 26, opacity: item.isFreeGift ? 0.4 : 1, cursor: item.isFreeGift ? 'not-allowed' : 'pointer' }}
                      onClick={() => !item.isFreeGift && updateQty(item._id, 1)}
                    >+</button>
                  </div>
                </div>
                <button
                  className="cart-remove"
                  onClick={() => { removeFromCart(item._id); showToast("Item removed"); }}
                >✕</button>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span>Total</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
          <button
            className="btn-checkout"
            onClick={() => { closeCart(); navigate("/checkout"); }}
          >
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </>
  );
}
