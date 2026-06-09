import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useBanners } from "../context/BannerContext";
import Stars from "../components/Stars";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { user, getToken } = useAuth();
  const banners = useBanners();

  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [qty, setQty] = useState(1);
  const [wished, setWished] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);

  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    setQty(1);
    setSelectedSize(0);
    setSelectedColor(0);
    setActiveThumb(0);
    setReviews([]);
    setReviewRating(0);
    setReviewComment("");
    setReviewError("");
    setReviewSuccess(false);

    Promise.all([
      axios.get(`/api/products/${id}`),
      axios.get(`/api/products/${id}/recommendations`),
      axios.get(`/api/products/${id}/reviews`),
    ]).then(([prodRes, recRes, revRes]) => {
      setProduct(prodRes.data);
      setRecommendations(recRes.data);
      setReviews(revRes.data);
      setLoading(false);
    }).catch(() => {
      navigate("/");
    });
  }, [id]);

  async function handleSubmitReview(e) {
    e.preventDefault();
    if (!reviewRating) { setReviewError("Please select a star rating"); return; }
    setReviewSubmitting(true);
    setReviewError("");
    try {
      const token = await getToken();
      await axios.post(`/api/products/${id}/reviews`, { rating: reviewRating, comment: reviewComment }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { data } = await axios.get(`/api/products/${id}/reviews`);
      setReviews(data);
      setReviewSuccess(true);
      setReviewRating(0);
      setReviewComment("");
    } catch (err) {
      setReviewError(err.response?.data?.error || "Failed to submit review");
    } finally {
      setReviewSubmitting(false);
    }
  }

  if (loading) return <Spinner />;
  if (!product) return null;

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    if (!user) {
      showToast("Please log in to add items to cart");
      navigate("/login");
      return;
    }
    addToCart(product, qty);
    showToast("Added to cart!");
  };

  const bannerImg = product && (product.bannerImage || (banners && banners[product.badge]));

  // Use same image 3x as thumbnails (real app would have multiple images)
  const thumbImages = [product.image, product.image, product.image];

  return (
    <div className="page">
      <div className="product-detail">

        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to={`/category/${product.category}`}>{product.category}</Link>
          {product.theme && (
            <>
              <span>›</span>
              <Link to={`/theme/${product.theme}`}>{product.theme}</Link>
            </>
          )}
          <span>›</span>
          <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{product.name}</span>
        </div>

        <Link to={`/category/${product.category}`} className="back-btn">
          ← Back to {product.category}
        </Link>

        {/* Product Grid */}
        <div className="product-detail-grid">

          {/* Gallery */}
          <div className="product-gallery">
            <img
              className="product-main-img"
              src={thumbImages[activeThumb]}
              alt={product.name}
            />
            <div className="product-thumbnails">
              {thumbImages.map((img, i) => (
                <img
                  key={i}
                  className={`thumb ${activeThumb === i ? "active" : ""}`}
                  src={img}
                  alt={`thumb-${i}`}
                  onClick={() => setActiveThumb(i)}
                />
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="product-detail-info">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Link 
                  to={`/category/${product.category}`} 
                  className="detail-category" 
                  style={{ 
                    marginBottom: 0, 
                    textDecoration: 'none',
                    background: 'var(--bg-alt)',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    color: 'var(--text)',
                    fontSize: '0.8rem',
                    fontWeight: 700
                  }}
                >
                  {product.category}
                </Link>
                {product.theme && (
                  <Link 
                    to={`/category/${product.category}?theme=${product.theme}`} 
                    style={{ 
                      fontSize: '0.8rem', 
                      fontWeight: 700, 
                      color: 'white', 
                      textDecoration: 'none',
                      background: 'var(--primary)',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5
                    }}
                  >
                    Theme: {product.theme}
                  </Link>
                )}
              </div>
              
              {product.badge && (
                <div style={{ 
                  background: bannerImg ? 'transparent' : 'var(--primary)',
                  padding: bannerImg ? 0 : '4px 12px',
                  borderRadius: '50px',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}>
                  {bannerImg ? (
                    <img src={bannerImg} alt={product.badge} style={{ height: '45px', width: 'auto' }} />
                  ) : (
                    product.badge
                  )}
                </div>
              )}
            </div>
            <h1 className="detail-title">{product.name}</h1>

            {/* Rating */}
            <div className="detail-rating">
              <Stars rating={product.rating} />
              <strong>{product.rating}</strong>
              <span style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
                ({product.reviews} reviews)
              </span>
              {product.inStock
                ? <span style={{ color: "var(--success)", fontSize: "0.88rem", fontWeight: 600 }}>✓ In Stock</span>
                : <span style={{ color: "var(--secondary)", fontSize: "0.88rem", fontWeight: 600 }}>✗ Out of Stock</span>
              }
            </div>

            {/* Price */}
            <div className="detail-price-wrap">
              <span className="detail-price">₹{product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="detail-original">₹{product.originalPrice.toFixed(2)}</span>
              )}
              {discount && (
                <span className="detail-discount-badge">{discount}% OFF</span>
              )}
            </div>

            <p className="detail-description" style={{ color: 'var(--text-muted)' }}>{product.description}</p>

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <>
                <div className="option-label">Size</div>
                <div className="options-row">
                  {product.sizes.map((s, i) => (
                    <button
                      key={s}
                      className={`option-btn ${selectedSize === i ? "active" : ""}`}
                      onClick={() => setSelectedSize(i)}
                    >{s}</button>
                  ))}
                </div>
              </>
            )}

            {/* Colors */}
            {product.colors?.length > 0 && (
              <>
                <div className="option-label">Color / Finish</div>
                <div className="options-row">
                  {product.colors.map((c, i) => (
                    <button
                      key={c}
                      className={`option-btn ${selectedColor === i ? "active" : ""}`}
                      onClick={() => setSelectedColor(i)}
                    >{c}</button>
                  ))}
                </div>
              </>
            )}

            {/* Qty */}
            <div className="qty-row">
              <span className="option-label" style={{ marginBottom: 0 }}>Quantity</span>
              <div className="qty-control">
                <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span className="qty-num">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(Math.min(99, qty + 1))}>+</button>
              </div>
            </div>


            {/* Live Customizer Teaser */}
            <div 
              style={{
                marginBottom: '30px',
                padding: '16px',
                background: 'var(--primary)',
                color: 'white',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
              onClick={() => showToast("Customizer loading... Upload your design in the next step!")}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>🎨</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Try Live Customizer Pre-view</span>
              </div>
              <span>→</span>
            </div>

            {/* Actions */}
            <div className="detail-actions">
              <button
                className="btn-add-cart-lg"
                disabled={!product.inStock}
                onClick={handleAddToCart}
              >
                🛒 Add to Cart
              </button>
              <button
                className="btn-wishlist-lg"
                onClick={() => setWished(!wished)}
              >
                {wished ? "❤️" : "🤍"}
              </button>
            </div>

            {/* Features */}
            <div className="detail-features">
              <div className="feature-row"><span className="feature-icon">🚚</span> Free delivery on orders over ₹500</div>
              <div className="feature-row"><span className="feature-icon">↩️</span> Free 30-day returns</div>
              <div className="feature-row"><span className="feature-icon">🔒</span> Secure payment &amp; checkout</div>
              <div className="feature-row"><span className="feature-icon">✨</span> Handcrafted with Artisan Precision</div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="recommendations">
            <div className="section-header">
              <h2 className="section-title">You May Also <span>Like</span></h2>
            </div>
            <div className="products-grid">
              {recommendations.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div style={{ marginTop: "60px", paddingTop: "40px", borderTop: "1px solid var(--border)" }}>
          <h2 className="section-title" style={{ marginBottom: "32px" }}>
            Customer <span>Reviews</span>
            <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--gray)", marginLeft: "12px" }}>
              ({reviews.length})
            </span>
          </h2>

          {/* Write a review form */}
          {user ? (
            reviewSuccess ? (
              <div style={{ background: "rgba(16,185,129,0.1)", color: "#059669", padding: "16px 20px", borderRadius: "12px", fontWeight: 700, marginBottom: "32px" }}>
                Thank you for your review!
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "16px", padding: "28px", marginBottom: "40px" }}>
                <h3 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: "1.1rem", marginBottom: "20px", color: "var(--dark)" }}>Write a Review</h3>

                {/* Star picker */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      style={{ background: "none", border: "none", fontSize: "1.8rem", cursor: "pointer", color: star <= reviewRating ? "#f59e0b" : "var(--border)", transition: "color 0.15s" }}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this product (optional)…"
                  rows={3}
                  style={{ width: "100%", padding: "12px 14px", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "0.95rem", background: "var(--bg)", color: "var(--text)", resize: "vertical", outline: "none", boxSizing: "border-box" }}
                />

                {reviewError && <p style={{ color: "#ef4444", fontSize: "0.85rem", marginTop: "8px", fontWeight: 600 }}>{reviewError}</p>}

                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  style={{ marginTop: "16px", background: "var(--dark)", color: "white", border: "none", padding: "12px 28px", borderRadius: "8px", fontWeight: 800, fontSize: "0.9rem", cursor: reviewSubmitting ? "not-allowed" : "pointer", opacity: reviewSubmitting ? 0.7 : 1, letterSpacing: "0.5px" }}
                >
                  {reviewSubmitting ? "Submitting…" : "Submit Review"}
                </button>
              </form>
            )
          ) : (
            <p style={{ color: "var(--gray)", marginBottom: "32px", fontSize: "0.95rem" }}>
              <Link to="/login" style={{ color: "var(--primary)", fontWeight: 700 }}>Sign in</Link> to leave a review.
            </p>
          )}

          {/* Review list */}
          {reviews.length === 0 ? (
            <p style={{ color: "var(--gray)", fontStyle: "italic" }}>No reviews yet. Be the first!</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {reviews.map((r) => (
                <div key={r.id} style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                    <div>
                      <span style={{ fontWeight: 800, color: "var(--dark)", marginRight: "10px" }}>{r.user_name}</span>
                      <span style={{ color: "#f59e0b", fontSize: "1rem" }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                    </div>
                    <span style={{ fontSize: "0.8rem", color: "var(--gray)" }}>
                      {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  {r.comment && <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.6", margin: 0 }}>{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
