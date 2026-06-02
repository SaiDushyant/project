import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { TAX_RATE, calcShipping } from "../utils/orderConstants";

export default function CartPage() {
  const { cart, removeFromCart, updateQty, totalPrice } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const shipping = calcShipping(totalPrice);
  const tax = totalPrice * TAX_RATE;
  const finalTotal = totalPrice + tax + shipping;

  return (
    <div className="page" style={{ paddingTop: '80px', minHeight: '80vh' }}>
      <style>{`
        @media (max-width: 768px) {
          .cart-item-row {
            display: flex !important;
            flex-direction: column !important;
            gap: 16px !important;
          }
          .cart-item-row > div { text-align: left !important; }
          .cart-item-row > div:last-child { text-align: left !important; font-size: 1rem !important; }
        }
      `}</style>
      <div className="main-content">
        <h1 className="elegant-title" style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', marginBottom: '32px', color: 'var(--dark)' }}>
          Your <span className="italic">Cart</span>
        </h1>

        {cart.length === 0 ? (
          <div className="empty-cart-page" style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '24px', opacity: 0.5 }}>🛒</div>
            <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--dark)' }}>Your cart is empty</h2>
            <p style={{ color: 'var(--gray)', marginBottom: '32px' }}>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/" className="btn-white-pill" style={{ display: 'inline-block', background: 'var(--dark)', color: 'var(--white)' }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-page-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '60px', alignItems: 'start' }}>
            
            {/* Left Column: Cart Items */}
            <div className="cart-page-items">
              <div className="cart-items-header" style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr', paddingBottom: '16px', borderBottom: '2px solid var(--gray-light)', marginBottom: '32px', fontWeight: '800', letterSpacing: '1px', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                <span>Product</span>
                <span style={{ textAlign: 'center' }}>Price</span>
                <span style={{ textAlign: 'center' }}>Quantity</span>
                <span style={{ textAlign: 'right' }}>Total</span>
              </div>

              {cart.map((item) => (
                <div key={item._id} className="cart-page-item cart-item-row" style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr', gap: '20px', alignItems: 'center', paddingBottom: '32px', marginBottom: '32px', borderBottom: '1px solid var(--gray-light)' }}>
                  
                  {/* Product Info */}
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--dark)' }}>{item.name}</h3>
                      <button onClick={() => { removeFromCart(item._id); showToast("Item removed"); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}>Remove</button>
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{ textAlign: 'center', fontSize: '1.1rem', color: 'var(--dark)' }}>
                    ₹{item.price.toFixed(2)}
                  </div>

                  {/* Quantity */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <button onClick={() => updateQty(item._id, -1)} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--dark)', background: 'transparent', cursor: 'pointer', color: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>−</button>
                    <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{item.qty}</span>
                    <button onClick={() => !item.isFreeGift && updateQty(item._id, 1)} disabled={item.isFreeGift} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--dark)', background: 'transparent', cursor: item.isFreeGift ? 'not-allowed' : 'pointer', color: item.isFreeGift ? 'var(--gray)' : 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', opacity: item.isFreeGift ? 0.4 : 1 }}>+</button>
                  </div>

                  {/* Line Total */}
                  <div style={{ textAlign: 'right', fontSize: '1.2rem', fontWeight: '800', color: 'var(--dark)' }}>
                    ₹{(item.price * item.qty).toFixed(2)}
                  </div>

                </div>
              ))}
            </div>

            {/* Right Column: Order Summary */}
            <div className="cart-order-summary" style={{ background: 'var(--gray-light)', padding: '40px', borderRadius: '0px', position: 'sticky', top: '100px' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid var(--border)', paddingBottom: '16px', color: 'var(--dark)' }}>Order Summary</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '1.1rem' }}>
                <span style={{ color: 'var(--dark)' }}>Subtotal</span>
                <span style={{ fontWeight: '700', color: 'var(--dark)' }}>₹{totalPrice.toFixed(2)}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '1.1rem' }}>
                <span style={{ color: 'var(--dark)' }}>Shipping</span>
                <span style={{ fontWeight: '700', color: 'var(--dark)' }}>₹{shipping.toFixed(2)}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', fontSize: '1.1rem' }}>
                <span style={{ color: 'var(--dark)' }}>Tax (10%)</span>
                <span style={{ fontWeight: '700', color: 'var(--dark)' }}>₹{tax.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', paddingTop: '24px', borderTop: '2px solid var(--border)', fontSize: '1.4rem', fontWeight: '800' }}>
                <span style={{ color: 'var(--dark)' }}>Total</span>
                <span style={{ color: 'var(--dark)' }}>₹{finalTotal.toFixed(2)}</span>
              </div>

              {(() => {
                const hasOnlyFreeGifts = cart.every(item => item.price === 0);
                return (
                  <>
                    {hasOnlyFreeGifts && (
                      <div style={{
                        marginBottom: "20px",
                        background: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        color: "#ef4444",
                        padding: "16px",
                        borderRadius: "12px",
                        fontSize: "0.85rem",
                        lineHeight: "1.5",
                        fontWeight: "bold",
                        textAlign: "left"
                      }}>
                        ⚠️ <b>Shipping Policy Warning:</b> Free gifts cannot be shipped alone! Please add at least one standard product to your cart to proceed.
                      </div>
                    )}
                    <button 
                      className="btn-checkout" 
                      disabled={hasOnlyFreeGifts}
                      style={{ 
                        background: hasOnlyFreeGifts ? '#666' : 'var(--primary)', 
                        color: 'white', 
                        width: '100%', 
                        padding: '20px', 
                        fontSize: '1.1rem', 
                        fontWeight: '800', 
                        textTransform: 'uppercase', 
                        letterSpacing: '2px', 
                        cursor: hasOnlyFreeGifts ? 'not-allowed' : 'pointer', 
                        border: 'none', 
                        borderRadius: '12px', 
                        transition: 'all 0.3s ease',
                        opacity: hasOnlyFreeGifts ? 0.6 : 1
                      }} 
                      onClick={() => navigate("/checkout")}
                    >
                      Proceed to Checkout
                    </button>
                  </>
                );
              })()}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
