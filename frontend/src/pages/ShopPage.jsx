import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "All";

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState(urlCategory);
  const [loading, setLoading] = useState(true);

  const productTypes = ["Badges", "Magnets", "Posters", "Plaques", "Bookmarks", "Figurines", "Keychains", "Charms", "Squishies", "Stickers"];

  useEffect(() => {
    axios.get("/api/categories")
      .then((res) => setCategories(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setActiveFilter(urlCategory);
  }, [urlCategory]);

  const fetchTimer = useRef(null);

  useEffect(() => {
    clearTimeout(fetchTimer.current);
    fetchTimer.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (activeFilter !== "All") params.set("category", activeFilter);
      if (searchQuery) params.set("search", searchQuery);
      const themeFilter = searchParams.get("theme");
      if (themeFilter) params.set("theme", themeFilter);
      axios.get(`/api/products?${params}`).then((res) => setProducts(res.data));
    }, 300);
    return () => clearTimeout(fetchTimer.current);
  }, [activeFilter, searchQuery, searchParams]);

  const handleFilterClick = (catName) => {
    const params = new URLSearchParams(searchParams);
    if (catName === "All") {
      params.delete("category");
    } else {
      params.set("category", catName);
    }
    setSearchParams(params);
  };

  if (loading) return <Spinner />;

  return (
    <div className="page">
      <div className="shop-hero" style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)", padding: "60px 24px", color: "white", textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "12px", fontFamily: "Outfit" }}>Our Full Collection</h1>
        <p style={{ opacity: 0.8, maxWidth: "600px", margin: "0 auto", fontSize: "1.1rem" }}>
          Browse through our entire range of handcrafted memories and personalized keepsakes.
        </p>
      </div>

      <div className="main-content" style={{ padding: "40px 32px" }}>
        <div className="section-header">
          <h2 className="section-title">
            {searchQuery ? <>Results for "<span>{searchQuery}</span>"</> : activeFilter !== "All" ? <><span>{activeFilter}</span> Collection</> : <>All <span>Products</span></>}
          </h2>
          <span className="see-all">{products.length} items</span>
        </div>

        {/* Category Filters */}
        <div className="products-header" style={{ marginBottom: "20px" }}>
          <button
            className={`filter-btn ${activeFilter === "All" ? "active" : ""}`}
            onClick={() => handleFilterClick("All")}
          >
            All Categories
          </button>
          {categories
            .map((cat) => (
              <button
                key={cat.name}
                className={`filter-btn ${activeFilter === cat.name ? "active" : ""}`}
                onClick={() => handleFilterClick(cat.name)}
              >
                {cat.name}
              </button>
            ))
          }
        </div>

        {/* Theme Filters */}
        <div style={{ marginBottom: "40px" }}>
          <h3 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: "1rem", marginBottom: "12px", color: "var(--dark)" }}>Filter by Theme:</h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.delete("theme");
                setSearchParams(params);
              }}
              style={{
                padding: "6px 16px",
                borderRadius: "30px",
                border: "2px solid var(--primary)",
                background: !searchParams.get("theme") ? "var(--primary)" : "transparent",
                color: !searchParams.get("theme") ? "white" : "var(--primary)",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "0.8rem",
                transition: "all 0.2s"
              }}
            >
              All Themes
            </button>
            {["Comicverse", "Anime", "Western Pop", "Eastern Pop", "Mythology", "Sports", "Music", "Motivational", "Video Games"].map((t) => (
              <button
                key={t}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set("theme", t);
                  setSearchParams(params);
                }}
                style={{
                  padding: "6px 16px",
                  borderRadius: "30px",
                  border: "2px solid var(--border)",
                  background: searchParams.get("theme") === t ? "var(--primary)" : "var(--card-bg)",
                  color: searchParams.get("theme") === t ? "white" : "var(--text-muted)",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  transition: "all 0.2s",
                  borderColor: searchParams.get("theme") === t ? "var(--primary)" : "var(--border)"
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {products.length > 0 ? (
          <div className="products-grid">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : (
          <div className="no-results">
            <div className="icon">🔍</div>
            <p>No products found{searchQuery ? ` for "${searchQuery}"` : ""}.</p>
          </div>
        )}
      </div>
    </div>
  );
}
