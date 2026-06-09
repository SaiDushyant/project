import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useBanners } from "../context/BannerContext";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";

const THEMES = ["Comicverse", "Anime", "Western Pop", "Eastern Pop", "Mythology", "Sports", "Music", "Motivational", "Video Games"];

export default function CategoryPage() {
  const { categoryName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTheme = searchParams.get("theme") || "All";
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const banners = useBanners();

  const meta = {
    Comicverse:  { icon: "🦸", description: "Superheroes, villains and legendary comic art", color: "#F87171", gradient: "linear-gradient(135deg,#F87171,#EF4444)" },
    Anime:       { icon: "🏮", description: "Your favorite characters and anime-inspired art", color: "#FBBF24", gradient: "linear-gradient(135deg,#FBBF24,#F59E0B)" },
    "Western Pop": { icon: "🤠", description: "Western cinema, music and pop culture icons", color: "#60A5FA", gradient: "linear-gradient(135deg,#60A5FA,#3B82F6)" },
    "Eastern Pop": { icon: "🏯", description: "Eastern culture, K-Pop and oriental aesthetics", color: "#F472B6", gradient: "linear-gradient(135deg,#F472B6,#E11D48)" },
    Mythology:   { icon: "⚡", description: "Ancient gods, myths and legendary creatures", color: "#A78BFA", gradient: "linear-gradient(135deg,#A78BFA,#8B5CF6)" },
    Sports:      { icon: "⚽", description: "Celebrate your favorite teams and athletes",   color: "#34D399", gradient: "linear-gradient(135deg,#34D399,#059669)" },
    Music:       { icon: "🎵", description: "Vinyl-worthy art and band-inspired keepsakes", color: "#818CF8", gradient: "linear-gradient(135deg,#818CF8,#6366F1)" },
    Motivational:{ icon: "💡", description: "Inspirational quotes and positive vibes",     color: "#FBBF24", gradient: "linear-gradient(135deg,#FBBF24,#D97706)" },
    "Video Games":{ icon: "🎮", description: "Epic gaming gear and digital world art",      color: "#60A5FA", gradient: "linear-gradient(135deg,#60A5FA,#2563EB)" },
    Squishies:   { icon: "☁️", description: "Premium soft and stress-relieving collectibles", color: "#F472B6", gradient: "linear-gradient(135deg,#F472B6,#DB2777)" },
    Stickers:    { icon: "🎨", description: "Express yourself with our premium vinyl stickers", color: "#60A5FA", gradient: "linear-gradient(135deg,#60A5FA,#2563EB)" },
  }[categoryName] || { icon: "✨", description: "Premium handcrafted collectibles", color: "#6366F1", gradient: "linear-gradient(135deg,#6366F1,#4F46E5)" };

  // Use theme banner if a theme is selected, otherwise fallback to category banner
  const bannerImg = (activeTheme !== "All" && banners && banners[activeTheme]) || (banners && banners[categoryName]);

  useEffect(() => {
    setLoading(true);
    let url = `/api/products?category=${categoryName}`;
    if (activeTheme !== "All") url += `&theme=${activeTheme}`;
    
    axios.get(url)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [categoryName, activeTheme]);

  const handleThemeClick = (theme) => {
    const newParams = new URLSearchParams(searchParams);
    if (theme === "All") {
      newParams.delete("theme");
    } else {
      newParams.set("theme", theme);
    }
    setSearchParams(newParams);
  };

  if (loading) return <Spinner />;

  return (
    <div className="page">
      {/* Category Hero */}
      <div style={{ 
        position: 'relative',
        backgroundColor: "#1a1a1a",
        backgroundImage: bannerImg ? `url("${bannerImg}")` : meta.gradient,
        backgroundSize: bannerImg ? 'contain' : 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: "120px 24px", 
        color: "white", 
        textAlign: "center",
        minHeight: bannerImg ? '650px' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '0 0 40px 40px',
        overflow: 'hidden'
      }}>
        {bannerImg && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', zIndex: 1 }} />}
        
        <div style={{ position: 'relative', zIndex: 2 }}>
          {!bannerImg && <div style={{ fontSize: "3.5rem", marginBottom: "12px" }}>{meta.icon}</div>}
          <h1 style={{ fontSize: "3.5rem", fontWeight: 800, marginBottom: "8px", textShadow: bannerImg ? '0 2px 10px rgba(0,0,0,0.5)' : 'none' }}>{categoryName}</h1>
          <p style={{ fontSize: "1.1rem", opacity: 0.9, maxWidth: "600px", margin: "0 auto" }}>{meta.description}</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: "40px" }}>
        <div className="breadcrumb" style={{ marginBottom: "24px" }}>
          <Link to="/">Home</Link>
          <span>›</span>
          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{categoryName}</span>
        </div>

        {/* Theme Filter Section */}
        <div style={{ marginBottom: "40px" }}>
          <h3 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: "1.1rem", marginBottom: "16px", color: "var(--dark)" }}>Filter by Theme:</h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => handleThemeClick("All")}
              style={{
                padding: "8px 20px",
                borderRadius: "30px",
                border: "2px solid var(--primary)",
                background: activeTheme === "All" ? "var(--primary)" : "transparent",
                color: activeTheme === "All" ? "white" : "var(--primary)",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "0.85rem",
                transition: "all 0.2s"
              }}
            >
              All Themes
            </button>
            {THEMES.map((t) => (
              <button
                key={t}
                onClick={() => handleThemeClick(t)}
                style={{
                  padding: "8px 20px",
                  borderRadius: "30px",
                  border: "2px solid var(--border)",
                  background: activeTheme === t ? "var(--primary)" : "var(--card-bg)",
                  color: activeTheme === t ? "white" : "var(--text-muted)",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  transition: "all 0.2s",
                  boxShadow: activeTheme === t ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
                  borderColor: activeTheme === t ? "var(--primary)" : "var(--border)"
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="section-header">
          <h2 className="section-title">Explore <span>{categoryName}</span></h2>
          <p className="section-subtitle">
            {activeTheme !== "All" ? `Showing ${activeTheme} style ${categoryName}` : `Showing all ${categoryName} designs`}
          </p>
        </div>

        {products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--gray)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🔍</div>
            <h3>No products found for this theme in {categoryName}.</h3>
            <p>Try selecting a different theme or viewing all.</p>
            <button 
              onClick={() => handleThemeClick("All")}
              className="btn btn-primary" 
              style={{ marginTop: "20px" }}
            >
              Show All {categoryName}
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
