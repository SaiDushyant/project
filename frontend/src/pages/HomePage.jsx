import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [, setCategories] = useState([]);
  const [, setFeatured] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Handle hash scrolling
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location.hash]);

  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const heroSlides = [
    {
      id: 1,
      image: "https://qbjlbtdwiqvmsovbfpgf.supabase.co/storage/v1/object/sign/akara-assests/Header-corosuel/Gemini_Generated_Image_q1ne3wq1ne3wq1ne.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zOTI5NWVlYi04ZWVmLTQwMjYtYTQzNS05ODI5ZWM1Y2QwNTgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJha2FyYS1hc3Nlc3RzL0hlYWRlci1jb3Jvc3VlbC9HZW1pbmlfR2VuZXJhdGVkX0ltYWdlX3ExbmUzd3ExbmUzd3ExbmUucG5nIiwiaWF0IjoxNzc2Njk3NDEwLCJleHAiOjIwOTIwNTc0MTB9.RxFNGXhXlNLovwG__dPVU9FNZtfOor2fntlwx6IgKMg",
      title: "Pin",
      subtitle: "Badges",
      desc: "Stand out with our curated collection of round pin badges."
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1572375927902-e60599bed90c?w=1600&q=80",
      title: "Stick",
      subtitle: "Stickers",
      desc: "Decorate your laptops, tablets, notebooks and what not with our huge range of themed stickers."
    },
    {
      id: 3,
      image: "https://qbjlbtdwiqvmsovbfpgf.supabase.co/storage/v1/object/sign/akara-assests/Header-corosuel/Gemini_Generated_Image_5ybzqn5ybzqn5ybz.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zOTI5NWVlYi04ZWVmLTQwMjYtYTQzNS05ODI5ZWM1Y2QwNTgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJha2FyYS1hc3Nlc3RzL0hlYWRlci1jb3Jvc3VlbC9HZW1pbmlfR2VuZXJhdGVkX0ltYWdlXzV5YnpxbjV5YnpxbjV5YnoucG5nIiwiaWF0IjoxNzc2Njk3MjEzLCJleHAiOjIwOTIwNTcyMTN9.zd9k9SSFI-WQUQMhoj2Edtttvy0u2n27GwOALP2QI9s",
      title: "Hang",
      subtitle: "Posters",
      desc: "Make your wall stand out and transform your space with our stunning poster collection."
    },
    {
      id: 4,
      image: "https://qbjlbtdwiqvmsovbfpgf.supabase.co/storage/v1/object/sign/akara-assests/Header-corosuel/Gemini_Generated_Image_jfyijqjfyijqjfyi.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zOTI5NWVlYi04ZWVmLTQwMjYtYTQzNS05ODI5ZWM1Y2QwNTgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJha2FyYS1hc3Nlc3RzL0hlYWRlci1jb3Jvc3VlbC9HZW1pbmlfR2VuZXJhdGVkX0ltYWdlX2pmeWlqcWpmeWlqcWpmeWkucG5nIiwiaWF0IjoxNzc2Njk3MzY3LCJleHAiOjIwOTIwNTczNjd9.41g8RNSiCj15yETNpJcrOA4XU3KIYcPPUnkIECW83WE",
      title: "Craft",
      subtitle: "Plaques",
      desc: "Make your customized Spotify plaque for either yourself or your loved ones. Perfect for gifting."
    },
    {
      id: 5,
      image: "https://qbjlbtdwiqvmsovbfpgf.supabase.co/storage/v1/object/sign/akara-assests/Header-corosuel/WhatsApp%20Image%202026-04-20%20at%2020.27.45.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zOTI5NWVlYi04ZWVmLTQwMjYtYTQzNS05ODI5ZWM1Y2QwNTgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJha2FyYS1hc3Nlc3RzL0hlYWRlci1jb3Jvc3VlbC9XaGF0c0FwcCBJbWFnZSAyMDI2LTA0LTIwIGF0IDIwLjI3LjQ1LmpwZWciLCJpYXQiOjE3NzY2OTc2NjEsImV4cCI6MjA5MjA1NzY2MX0._JQSGnScOiTnzIaWTEcVbJL7q01bj12bC45rssJFqbs",
      title: "Grab",
      subtitle: "Bookmarks",
      desc: "The perfect companion for every avid reader, crafted with love."
    },
    {
      id: 6,
      image: "https://qbjlbtdwiqvmsovbfpgf.supabase.co/storage/v1/object/sign/akara-assests/Header-corosuel/Gemini_Generated_Image_7wwu4d7wwu4d7wwu.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zOTI5NWVlYi04ZWVmLTQwMjYtYTQzNS05ODI5ZWM1Y2QwNTgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJha2FyYS1hc3Nlc3RzL0hlYWRlci1jb3Jvc3VlbC9HZW1pbmlfR2VuZXJhdGVkX0ltYWdlXzd3d3U0ZDd3d3U0ZDd3d3UucG5nIiwiaWF0IjoxNzc2Njk3MjgzLCJleHAiOjIwOTIwNTcyODN9.tqKO-WplzRXF2QSPdABU292jTgn1Dk9HGV2OXZIDkD4",
      title: "Get",
      subtitle: "Magnets",
      desc: "Add a splash of quirky to your fridge or workspace pin-board."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    if (touchStart - touchEnd > 50) setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    if (touchStart - touchEnd < -50) setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setTouchStart(0); setTouchEnd(0);
  };

  useEffect(() => {
    Promise.all([
      axios.get("/api/categories"),
      axios.get("/api/products/featured"),
      axios.get("/api/events")
    ]).then(([catRes, featRes, eventRes]) => {
      setCategories(catRes.data);
      setFeatured(featRes.data);
      setEvents(eventRes.data);
    }).catch(() => {
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const [activeFaq, setActiveFaq] = useState(null);
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0 });
  const [showWheel, setShowWheel] = useState(false);
  const [showMysteryModal, setShowMysteryModal] = useState(false);
  const [mysteryCategory, setMysteryCategory] = useState("Comic-verse");
  const [mysteryPrice, setMysteryPrice] = useState("499");
  const [mysteryPreferences, setMysteryPreferences] = useState("");
  const [mysteryName, setMysteryName] = useState("");
  const [mysteryEmail, setMysteryEmail] = useState("");
  const [mysteryStatus, setMysteryStatus] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState(null);

  const { user, isAdmin } = useAuth();
  const { addToCart } = useCart();
  const [canSpin, setCanSpin] = useState(true);
  const [spinCountdown, setSpinCountdown] = useState("");
  const [showSpinNotification, setShowSpinNotification] = useState(false);
  const [showClaimSuccessModal, setShowClaimSuccessModal] = useState(false);
  const [claimedCouponInfo, setClaimedCouponInfo] = useState(null);

  const updateCountdown = (ms) => {
    const totalSecs = Math.floor(ms / 1000);
    if (totalSecs <= 0) {
      setCanSpin(true);
      setSpinCountdown("");
      setShowSpinNotification(true);
      return;
    }
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;
    setSpinCountdown(
      `${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    );
  };

  const checkSpinStatus = async () => {

    let lastSpinStr = null;
    if (user) {
      try {
        const { data } = await axios.get(`/api/users/${user.id}/spin-status`);
        lastSpinStr = data.lastSpinTime;
        if (lastSpinStr) {
          localStorage.setItem("last_spin_time_cached", lastSpinStr);
        } else {
          localStorage.removeItem("last_spin_time_cached");
        }
      } catch (err) {
        lastSpinStr = localStorage.getItem("last_spin_time_cached");
      }
    } else {
      lastSpinStr = localStorage.getItem("last_spin_time");
    }

    if (lastSpinStr) {
      const lastSpin = new Date(lastSpinStr).getTime();
      const now = Date.now();
      const msDiff = now - lastSpin;
      const limit = 30 * 24 * 60 * 60 * 1000; // 30 days

      if (msDiff < limit) {
        setCanSpin(false);
        setShowSpinNotification(true);
        updateCountdown(limit - msDiff);
      } else {
        setCanSpin(true);
        setSpinCountdown("");
        setShowSpinNotification(true);
      }
    } else {
      setCanSpin(true);
      setSpinCountdown("");
      setShowSpinNotification(true);
    }
  };

  useEffect(() => {
    checkSpinStatus();
  }, [user]);

  useEffect(() => {
    if (canSpin) return;

    const interval = setInterval(() => {
      const lastSpinTimeStr = user 
        ? localStorage.getItem("last_spin_time_cached") 
        : localStorage.getItem("last_spin_time");
        
      if (lastSpinTimeStr) {
        const lastSpin = new Date(lastSpinTimeStr).getTime();
        const now = Date.now();
        const msDiff = now - lastSpin;
        const limit = 30 * 24 * 60 * 60 * 1000;
        if (msDiff < limit) {
          updateCountdown(limit - msDiff);
        } else {
          setCanSpin(true);
          setSpinCountdown("");
          setShowSpinNotification(true);
          clearInterval(interval);
        }
      } else {
        setCanSpin(true);
        setSpinCountdown("");
        setShowSpinNotification(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [canSpin, user]);

  const fireConfetti = () => {
    if (window.confetti) {
      window.confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      return;
    }
    if (document.getElementById("confetti-script")) return;
    const script = document.createElement("script");
    script.id = "confetti-script";
    script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
    script.async = true;
    script.onload = () => window.confetti && window.confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    document.body.appendChild(script);
  };

  useEffect(() => {
    if (showClaimSuccessModal) fireConfetti();
  }, [showClaimSuccessModal]);

  const handleSpin = async () => {
    if (isSpinning || !canSpin) return;
    setIsSpinning(true);
    setWheelResult(null);

    const nowISO = new Date().toISOString();
    if (user) {
      // Set localStorage first to prevent interval from re-enabling spin if API fails
      localStorage.setItem("last_spin_time_cached", nowISO);
      try {
        await axios.post(`/api/users/${user.id}/record-spin`);
      } catch {
      }
    } else {
      localStorage.setItem("last_spin_time", nowISO);
    }
    
    // Disable spinning and trigger check to start countdown
    setCanSpin(false);
    
    const targetIndex = Math.floor(Math.random() * 6);
    const options = [
      "5% off on 500 and above",
      "Spin Again",
      "Free Charm",
      "Try again tomorrow",
      "Free Squishy",
      "Free Stickers"
    ];
    
    const randomOffset = Math.floor(Math.random() * 40) - 20; 
    const spinRot = 1800 + 360 - (targetIndex * 60 + 30) + randomOffset;
    
    const wheel = document.querySelector(".wheel-graphic");
    if (wheel) wheel.style.transform = `rotate(${spinRot}deg)`;
    
    setTimeout(async () => {
      setIsSpinning(false);
      const result = options[targetIndex];
      
      if (result === "Spin Again") {
        // Re-enable spin immediately and clear DB/local timers
        if (user) {
          try {
            await axios.post(`/api/users/${user.id}/reset-spin`);
            localStorage.removeItem("last_spin_time_cached");
          } catch {
          }
        } else {
          localStorage.removeItem("last_spin_time");
        }
        setCanSpin(true);
        setSpinCountdown("");
        setWheelResult(null);
        alert("🎉 You won 'Spin Again'! You got an extra free spin immediately! Try your luck again!");
      } else {
        setWheelResult(result);
      }
    }, 4000);
  };

  const handleClaim = async () => {
    const codeMap = {
      "5% off on 500 and above": "AKARA5",
      "Free Squishy": "FREESQUISHY",
      "Free Stickers": "FREESTICKERS",
      "Free Charm": "FREECHARM"
    };
    
    const discountPercentMap = {
      "AKARA5": 5,
      "FREESQUISHY": 0,
      "FREESTICKERS": 0,
      "FREECHARM": 0
    };

    const giftProductMap = {
      "Free Charm": {
        _id: "free-gift-charm",
        name: "🎁 Dainty Silver Charm (Free Gift)",
        price: 0,
        image: "https://images.unsplash.com/photo-1590548784585-645d2b65306a?w=600&q=80",
        category: "Charms",
        isFreeGift: true
      },
      "Free Stickers": {
        _id: "free-gift-stickers",
        name: "🎁 Vinyl Sticker Pack (Free Gift)",
        price: 0,
        image: "https://images.unsplash.com/photo-1589051030483-e30739c83218?w=600&q=80",
        category: "Stickers",
        isFreeGift: true
      },
      "Free Squishy": {
        _id: "free-gift-squishy",
        name: "🎁 Panda Squishy Toy (Free Gift)",
        price: 0,
        image: "https://images.unsplash.com/photo-1559124391-c6e50c777b08?w=600&q=80",
        category: "Squishies",
        isFreeGift: true
      }
    };

    const baseCode = codeMap[wheelResult];
    if (baseCode) {
      try {
        const { data } = await axios.post("/api/coupons/claim", {
          code: baseCode,
          discountPercent: discountPercentMap[baseCode]
        });

        localStorage.setItem("spin_coupon", data.code);
        
        // Add physical free gift to cart immediately
        const isFreeGift = ["Free Squishy", "Free Stickers", "Free Charm"].includes(wheelResult);
        if (isFreeGift && giftProductMap[wheelResult]) {
          addToCart(giftProductMap[wheelResult], 1);
        }

        setClaimedCouponInfo({
          code: data.code,
          expiryDate: new Date(data.expiryDate).toLocaleDateString(),
          isFreeGift,
          giftName: wheelResult
        });
        
        setShowClaimSuccessModal(true);
        setShowWheel(false);
      } catch (err) {
        alert("Failed to claim coupon. Please try again.");
      }
    }
  };

  const handleMagnetic = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.35;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.35;
    setBtnOffset({ x, y });
  };

  const resetMagnetic = () => setBtnOffset({ x: 0, y: 0 });

  if (loading) return <Spinner />;

  return (
    <div className="page home-page">
      {/* Floating Background Blobs */}
      <div className="floating-bg">
        <div className="float-blob blob-1"></div>
        <div className="float-blob blob-2"></div>
      </div>

      {/* Top Carousel */}
      <section className="carousel-container" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        <div className="carousel-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {heroSlides.map((slide, index) => (
            <div key={slide.id} className={`carousel-slide ${index === currentSlide ? "active" : ""}`}>
              <div className="carousel-slide-bg"><img src={slide.image} alt={slide.subtitle} /></div>
              <div className="hero-main-row">
                <div className="hero-left">
                  <h1 className="elegant-title">{slide.title} your <br/><span className="italic">{slide.subtitle.toLowerCase()}</span></h1>
                  <p className="hero-desc">{slide.desc}</p>
                  <Link 
                    to="/shop" 
                    className="btn-white-pill" 
                    onMouseMove={handleMagnetic} 
                    onMouseLeave={resetMagnetic} 
                    style={{ transform: `translate(${btnOffset.x}px, ${btnOffset.y}px)` }}
                  >
                    Build My {slide.title} Gift
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="carousel-controls">
          {heroSlides.map((_, i) => (
            <div key={i} className={`carousel-indicator ${i === currentSlide ? "active" : ""}`} onClick={() => setCurrentSlide(i)} />
          ))}
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="benefits-bar reveal">
        <div className="benefit-item">
          <div className="benefit-icon">🚚</div>
          <div className="benefit-text"><h4>Fast Delivery</h4><p>Across all major cities</p></div>
        </div>
        <div className="benefit-item">
          <div className="benefit-icon">🛡️</div>
          <div className="benefit-text"><h4>Secure Payment</h4><p>100% safe transactions</p></div>
        </div>
        <div className="benefit-item">
          <div className="benefit-icon">💎</div>
          <div className="benefit-text"><h4>Premium Quality</h4><p>Handcrafted with care</p></div>
        </div>
        <div className="benefit-item">
          <div className="benefit-icon">🎧</div>
          <div className="benefit-text"><h4>24/7 Support</h4><p>We're here to help</p></div>
        </div>
      </section>

      {/* As Seen On / Partners */}
      <section className="reveal" style={{ padding: '40px 0', borderBottom: '1px solid var(--border)' }}>
        <p style={{ textAlign: 'center', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--gray)', marginBottom: '25px', fontWeight: 700 }}>As Featured In & Partnered With</p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '60px', flexWrap: 'wrap', opacity: 0.4, filter: 'grayscale(1)' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'Outfit', color: 'var(--text)' }}>VOGUE</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'Outfit', color: 'var(--text)' }}>GQ</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'Outfit', color: 'var(--text)' }}>ELLE</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'Outfit', color: 'var(--text)' }}>DESIGNER'S HUB</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'Outfit', color: 'var(--text)' }}>VINTAGE CO.</span>
        </div>
      </section>

      {/* Summer Capsule Section */}
      <section className="reveal" style={{ 
        padding: '100px 32px', 
        backgroundImage: 'linear-gradient(var(--glass-bg), var(--glass-bg)), url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        margin: '40px 32px',
        borderRadius: '32px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)'
      }}>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontFamily: 'Outfit', color: 'var(--primary)', fontWeight: 900 }}>Summer <span>Holiday</span> Capsule</h2>
        <p style={{ maxWidth: '600px', margin: '16px auto 40px', fontSize: '1.2rem', color: 'var(--text)', fontWeight: 500 }}>Limited edition beach-vibes badges, magnets, and sun-proof stickers. Catch them before the tide goes out! 🌊</p>
        <button className="btn btn-primary" onClick={() => navigate("/shop")} style={{ padding: '16px 40px', borderRadius: '50px' }}>Explore Summer Drops →</button>
      </section>

      {/* Immersive Brand Hero with Mouse Parallax */}
      <section className="hero reveal">
        <div className="hero-content-split">
          <div className="hero-text-side">
            <h1>Handcrafted <span>Happiness.</span> Curated <span>Collectibles.</span></h1>
            <p>Elevate your everyday with premium badges, magnets, stickers, posters, bookmarks, and figurines designed to bring art, personality, and fandom into every corner of your life.</p>
            <div className="hero-btns">
              <button 
                className="btn btn-primary" 
                onClick={() => navigate("/shop")}
                onMouseMove={handleMagnetic} onMouseLeave={resetMagnetic}
                style={{ transform: `translate(${btnOffset.x}px, ${btnOffset.y}px)` }}
              >
                Explore Store →
              </button>
              <button className="btn btn-outline" onClick={() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" })}>View Events</button>
            </div>
          </div>
          <div className="hero-img-side">
            <img 
              src="https://qbjlbtdwiqvmsovbfpgf.supabase.co/storage/v1/object/sign/akara-assests/hero_lifestyle_premium_1777994217967.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zOTI5NWVlYi04ZWVmLTQwMjYtYTQzNS05ODI5ZWM1Y2QwNTgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJha2FyYS1hc3Nlc3RzL2hlcm9fbGlmZXN0eWxlX3ByZW1pdW1fMTc3Nzk5NDIxNzk2Ny5wbmciLCJpYXQiOjE3Nzc5OTQyNTAsImV4cCI6NDkzMTU5NDI1MH0.WjYQ3_56W-y9I2u0-q1a-0Z9K_C8O3T2U7C9J5V6X_U" 
              alt="Premium Lifestyle" 
              style={{ transform: `scale(1.1) translate(${mousePos.x}px, ${mousePos.y}px)` }}
            />
          </div>
        </div>
      </section>



      {/* Mystery Box Section */}
      <section className="reveal dark-section" style={{ padding: '100px 24px', textAlign: 'center', margin: '60px 32px', borderRadius: '32px', overflow: 'hidden', position: 'relative', boxShadow: '0 0 40px rgba(var(--primary-rgb), 0.2)' }}>
        <div style={{ position: 'absolute', top: '-50px', left: '-50px', fontSize: '10rem', opacity: 0.05 }}>📦</div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ marginBottom: '10px' }}><span style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 900 }}>秘密</span></div>
          <h2 style={{ fontSize: '3rem', fontFamily: 'Outfit', fontWeight: 800, margin: '20px 0', textShadow: '0 0 15px rgba(var(--primary-rgb), 0.4)', color: 'white' }}>The Akara <span>Mystery Box</span></h2>
          <p style={{ maxWidth: '700px', margin: '0 auto 40px', opacity: 0.8, fontSize: '1.1rem', color: 'white', lineHeight: '1.6' }}>Discover the thrill of surprise with our curated Mystery Boxes available in ₹499, ₹999, and ₹1499 variants — each packed with collectibles and goodies worth more than what you pay for. From stickers and badges to charms, posters, bookmarks, magnets, figurines, and exclusive extras, every box is designed to feel personal, exciting, and unique.</p>
          <button className="btn btn-white-pill anime-btn-glow" onClick={() => setShowMysteryModal(true)}>Unlock your Mystery Box</button>
        </div>
      </section>

      {/* Akara Gallery / Instagram Feed */}
      <section className="reveal" style={{ padding: '80px 32px' }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{ marginBottom: '8px' }}><span style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 800, letterSpacing: '4px' }}>証</span></div>
          <h2 className="section-title">The Akara <span>Gallery</span></h2>
          <p style={{ color: 'var(--gray)' }}>Join 50,000+ collectors sharing their memories. Tag @AkaraKeepsakes to be featured.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {[
            "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=600&q=80",
            "https://images.unsplash.com/photo-1566121933407-3c7ccdd26763?w=600&q=80",
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80",
            "https://images.unsplash.com/photo-1534349762230-e0cadf78f5db?w=600&q=80",
            "https://images.unsplash.com/photo-1520004481444-d8af301639af?w=600&q=80",
            "https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?w=600&q=80"
          ].map((url, i) => (
            <div key={i} style={{ borderRadius: '16px', overflow: 'hidden', height: '250px', cursor: 'pointer', position: 'relative' }} className="gallery-item">
              <img src={url} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', opacity: 0, transition: 'opacity 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem' }} className="gallery-overlay">❤️</div>
            </div>
          ))}
        </div>
      </section>
      <section className="process-section reveal">
        <h2 className="section-title">AKARA <span>Process</span></h2>
        <div className="process-grid">
          <div className="process-card">
            <span className="process-icon">🎨</span>
            <h3>Curated Selection</h3>
            <p>Every collection is thoughtfully assembled with unique designs, trending fandoms, and creative aesthetics chosen to match your style and interests.</p>
          </div>
          <div className="process-card">
            <span className="process-icon">⚒️</span>
            <h3>Quality Craftsmanship</h3>
            <p>From badges and stickers to figurines and charms, each piece is made using premium materials and detailed finishing for a collectible-worthy feel.</p>
          </div>
          <div className="process-card">
            <span className="process-icon">🎁</span>
            <h3>Premium Packaging</h3>
            <p>Your keepsakes are carefully packed in our signature boxes, ready to be gifted or cherished.</p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="stats-bar reveal">
        <div className="stats-inner">
          <div className="stat-item"><div className="stat-num">300+</div><div className="stat-label">Products</div></div>
          <div className="stat-item"><div className="stat-num">500+</div><div className="stat-label">Happy Customers</div></div>
          <div className="stat-item"><div className="stat-num">4.8</div><div className="stat-label">Stars - Average Rating</div></div>
        </div>
      </div>

      {/* Collection Row */}
      <div className="visit-collections-row reveal" onClick={() => navigate("/shop")}>
        <div className="pill box-img">
          <img src="https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&q=80" alt="Badges" />
          <span>VISIT OUR</span>
        </div>
        <div className="pill box-outlined">COLLECTIONS</div>
        <div className="pill box-solid"><span className="arrow">→</span></div>
      </div>


      {/* Campaigns Bento Grid */}
      <section className="bento-grid reveal">
          <div className="bento-right" style={{ width: '100%' }}>
            <Link to="/shop" className="bento-right-top">
              <img src="https://images.unsplash.com/photo-1544816155-12df9643f363?w=1600&q=80" alt="Vintage" className="bento-img" />
              <div className="bento-overlay"><h2>VINTAGE CAPSULE</h2></div>
            </Link>
            <div className="bento-right-bottom">
              <Link to="/shop" className="bento-item">
                <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80" alt="Art" className="bento-img" />
                <div className="bento-overlay"><h2 style={{ fontSize: '1.5rem' }}>ART MAGNETS</h2></div>
              </Link>
              <Link to="/category/Plaques" className="bento-item">
                <img src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80" alt="Wooden" className="bento-img" />
                <div className="bento-overlay"><h2 style={{ fontSize: '1.5rem' }}>WOODEN CARDS</h2></div>
              </Link>
            </div>
          </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section reveal">
        <h2 className="section-title" style={{ textAlign: 'center' }}>Frequently <span>Asked</span> Questions</h2>
        <div className="faq-grid">
          {[
            { q: "How long does shipping take?", a: "Standard shipping takes 3-5 business days. Express shipping is available for next-day delivery in most cities." },
            { q: "Can I customize my order?", a: "Yes! We specialize in custom badges, magnets, and plaques. Simply head to our custom studio section in the shop." },
            { q: "What materials do you use?", a: "We use premium eco-friendly materials, including recycled metals, genuine leather, and sustainable wood." }
          ].map((faq, i) => (
            <div key={i} className={`faq-card ${activeFaq === i ? 'active' : ''}`} onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
              <div className="faq-q">
                {faq.q}
                <span className="faq-icon">+</span>
              </div>
              <div className="faq-a">{faq.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Events Teaser Banner */}
      {events.length > 0 && (
          <Link to="/events" className="reveal" style={{ textDecoration: "none" }} id="events">
            <div style={{
              margin: "0 32px 48px",
              background: "linear-gradient(135deg, #040404 0%, #1a1a1a 100%)",
              borderRadius: 16,
              padding: "28px 36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ background: "var(--primary)", borderRadius: 12, width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem" }}>🎪</div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ background: "var(--primary)", color: "white", borderRadius: 20, padding: "2px 12px", fontSize: "0.78rem", fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" }}>
                      {events.length} Upcoming {events.length === 1 ? "Event" : "Events"}
                    </span>
                  </div>
                  <h3 style={{ color: "white", fontFamily: "Outfit", fontWeight: 700, fontSize: "1.1rem", margin: 0 }}>
                    {events[0].name}
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", margin: "4px 0 0" }}>
                    {new Date(events[0].date).toLocaleDateString("en-GB", { day: "numeric", month: "long" })} · {events[0].location}
                  </p>
                </div>
              </div>
              <div style={{ color: "white", fontWeight: 700, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 6, opacity: 0.85 }}>
                View All <span>→</span>
              </div>
            </div>
          </Link>
      )}

      {/* Customer Reviews */}
      <section className="reviews-section reveal">
        <div className="reviews-header">
          <h2>Loved by <span>Thousands</span></h2>
          <p>Join our community of collectors and creators.</p>
        </div>
        <div className="reviews-grid">
          {[
            { n: "Vidhya", r: "Happy Customer", t: "The badges were of excellent quality and they really elevated my aesthetic experience." },
            { n: "Savitri", r: "Happy Customer", t: "I got a custom plaque made by Akara, and loved the thoughtfulness behind the crafted outcome." },
            { n: "Priya", r: "Happy Customer", t: "The packaging was very neat and shipping was very prompt. Highly recommended!" }
          ].map((rev, i) => (
            <div 
              key={i} 
              className="review-card perspective-card"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                e.currentTarget.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-5px)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0)`;
              }}
            >
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"{rev.t}"</p>
              <div className="review-author">
                <div className="review-avatar">{rev.n[0]}</div>
                <div className="review-author-info"><h4>{rev.n}</h4><span>{rev.r}</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Founders Section */}
      <section className="founders-section reveal dark-section" style={{ margin: '80px 32px', padding: '80px 40px', borderRadius: '32px' }}>
        <div className="founders-container">
          <div className="founders-left">
            <img src="https://qbjlbtdwiqvmsovbfpgf.supabase.co/storage/v1/object/sign/akara-assests/Other%20Assests/Sweety%20AV%20image.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zOTI5NWVlYi04ZWVmLTQwMjYtYTQzNS05ODI5ZWM1Y2QwNTgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJha2FyYS1hc3Nlc3RzL090aGVyIEFzc2VzdHMvU3dlZXR5IEFWIGltYWdlLmpwZyIsImlhdCI6MTc3ODI5Nzc5MSwiZXhwIjoyNjQyMjk3NzkxfQ.gTzQPOGP0GNr1njD-fEEzxcbh0ZDPWd022rDKyK3z3M" alt="Founders" className="founders-img" />
            <div className="founders-quote">"Turning small moments into lasting memories is what drives us to do what we do."</div>
            <div className="founders-signature">— Swetha and Amritha, Founders</div>
          </div>
          <div className="founders-right">
            <h2>From the <span>Founders'</span> Desk</h2>
            <p>Akara was born in a small studio with big dreams. Our passion for handcrafted detail has led us on an incredible journey across the country.</p>
            <p>Every poster, sticker, and keepsake is made with utmost care and attention to detail. Most importantly, there is lots of love behind Akara.</p>
            <button className="btn btn-outline" style={{ borderColor: 'white', color: 'white', marginTop: '20px' }} onClick={() => navigate("/shop")}>Our Story</button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section reveal dark-section" style={{ marginBottom: '0', borderRadius: '32px 32px 0 0', marginInline: '0' }}>
        <div className="newsletter-content">
          <h2>Join the <span>Akara Club</span></h2>
          <p>Subscribe to get early access to new drops, exclusive events, and 10% off your first order.</p>
          <form className="newsletter-form" onSubmit={async (e) => {
            e.preventDefault();
            try {
              await axios.post("/api/newsletter", { email: newsletterEmail });
              setNewsletterStatus("success");
              setNewsletterEmail("");
            } catch {
              setNewsletterStatus("error");
            }
          }}>
            <input
              type="email"
              placeholder="Your email address"
              className="newsletter-input"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Join Now</button>
          </form>
          {newsletterStatus === "success" && (
            <p style={{ color: "var(--primary)", marginTop: "12px", fontWeight: 700 }}>You're subscribed!</p>
          )}
          {newsletterStatus === "error" && (
            <p style={{ color: "#ef4444", marginTop: "12px", fontWeight: 700 }}>Something went wrong. Please try again.</p>
          )}
        </div>
      </section>

      {/* Spin the Wheel Trigger */}
      <div className="spin-trigger" onClick={() => setShowWheel(true)}>🎡</div>

      {/* Spin the Wheel Modal */}
      {showWheel && (
        <div className="wheel-modal" onClick={() => !isSpinning && setShowWheel(false)}>
          <div className="wheel-container" onClick={(e) => e.stopPropagation()}>
            <button style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => setShowWheel(false)}>×</button>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 800 }}>Spin & <span>Save</span></h2>
            <p>Win exclusive discounts for your next custom keepsake!</p>
            <div className="wheel-pointer"></div>
            <div className="wheel-graphic">
              {/* Background wedges */}
              {[
                { label: "Free Squishy", color: "var(--primary)" },
                { label: "Free Stickers", color: "#1a1a1a" },
                { label: "5% off on 500 and above", color: "var(--primary)" },
                { label: "Spin Again", color: "#222222" },
                { label: "Free Charm", color: "var(--primary)" },
                { label: "Try again tomorrow", color: "#1a1a1a" }
              ].map((seg, i) => (
                <div key={`bg-${i}`} className="wheel-segment" style={{ 
                  transform: `rotate(${i * 60}deg) skewY(-30deg)`,
                  background: seg.color
                }} />
              ))}

              {/* Text labels on top */}
              {[
                { label: "Free Squishy", color: "var(--primary)" },
                { label: "Free Stickers", color: "#1a1a1a" },
                { label: "5% off on 500 and above", color: "var(--primary)" },
                { label: "Spin Again", color: "#222222" },
                { label: "Free Charm", color: "var(--primary)" },
                { label: "Try again tomorrow", color: "#1a1a1a" }
              ].map((seg, i) => (
                <div key={`txt-${i}`} className="wheel-segment" style={{ 
                  transform: `rotate(${i * 60}deg) skewY(-30deg)`,
                  background: 'transparent',
                  border: 'none'
                }}>
                  <span className="segment-label">{seg.label}</span>
                </div>
              ))}
            </div>
             {wheelResult ? (
               <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '12px', marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                 <div>
                   <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--gray)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>
                     {wheelResult === "Try again tomorrow" ? "Result:" : "Your Code:"}
                   </p>
                   <h3 style={{ margin: '4px 0 0 0', color: 'var(--primary)', textAlign: 'center', fontFamily: 'Outfit', fontWeight: 800 }}>{wheelResult}</h3>
                 </div>
                 {["5% off on 500 and above", "Free Squishy", "Free Stickers", "Free Charm"].includes(wheelResult) && (
                   <button 
                     onClick={handleClaim}
                     style={{
                       background: 'var(--primary)',
                       color: 'white',
                       border: 'none',
                       padding: '10px 30px',
                       borderRadius: '8px',
                       fontWeight: '800',
                       cursor: 'pointer',
                       fontSize: '0.9rem',
                       textTransform: 'uppercase',
                       letterSpacing: '1px',
                       boxShadow: '0 4px 10px rgba(0, 209, 178, 0.3)',
                       transition: 'all 0.3s ease'
                     }}
                   >
                     Claim
                   </button>
                 )}
                 {!canSpin && (
                   <div style={{ marginTop: '8px', fontSize: '0.95rem', color: '#555', fontWeight: 'bold', textAlign: 'center' }}>
                     Next spin available in: <span style={{ color: 'var(--primary)' }}>{spinCountdown}</span>
                   </div>
                 )}
               </div>
             ) : (
              <button 
                 className="btn btn-primary" 
                 onClick={handleSpin} 
                 disabled={isSpinning || !canSpin}
                 style={!canSpin ? { background: '#666', borderColor: '#666', cursor: 'not-allowed' } : {}}
               >
                 {isSpinning ? "Spinning..." : !canSpin ? `Next Spin in: ${spinCountdown}` : "Spin Now"}
               </button>
            )}
          </div>
        </div>
      )}

      {/* Mystery Box Modal */}
      {showMysteryModal && (
        <div className="wheel-modal" onClick={() => setShowMysteryModal(false)}>
          <div className="wheel-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', textAlign: 'left', padding: '40px 30px', maxHeight: '90vh', overflowY: 'auto' }}>
            <button style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => setShowMysteryModal(false)}>×</button>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, marginBottom: '20px', textAlign: 'center' }}>Unlock your <span>Mystery Box</span></h2>
            
            {mysteryStatus === "success" ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🎉</div>
                <h3 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: "1.5rem", marginBottom: "8px" }}>Request Submitted!</h3>
                <p style={{ color: "var(--gray)", marginBottom: "24px" }}>We'll get back to you shortly with details about your custom mystery box.</p>
                <button className="btn btn-primary" onClick={() => setShowMysteryModal(false)}>Close</button>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700 }}>Your Name *</label>
                    <input type="text" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }} value={mysteryName} onChange={(e) => setMysteryName(e.target.value)} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700 }}>Email Address *</label>
                    <input type="email" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }} value={mysteryEmail} onChange={(e) => setMysteryEmail(e.target.value)} required />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700 }}>Choose your favorite category:</label>
                  <select
                    value={mysteryCategory}
                    onChange={(e) => setMysteryCategory(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }}
                  >
                    <option>Comic-verse</option>
                    <option>Anime</option>
                    <option>Western Pop Culture</option>
                    <option>Eastern Pop Culture</option>
                    <option>Sports</option>
                    <option>Video Games</option>
                    <option>Music</option>
                    <option>Motivational</option>
                    <option>Mythology</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700 }}>Options for Price:</label>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    {['499', '999', '1499'].map(price => (
                      <label key={price} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="mystery-price"
                          value={price}
                          checked={mysteryPrice === price}
                          onChange={() => setMysteryPrice(price)}
                        /> ₹{price}
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700 }}>Customization (Optional):</label>
                  <input 
                    type="text" 
                    placeholder="Mention your favorite themes or interests..." 
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }} 
                    value={mysteryPreferences}
                    onChange={(e) => setMysteryPreferences(e.target.value)}
                  />
                </div>

                <p style={{ fontSize: '0.9rem', color: '#555', lineHeight: '1.6', marginBottom: '24px' }}>
                  Want a mix of themes? That works too. Simply mention your favorite characters, series, artists, teams, aesthetics, or interests in the customization box, and we'll curate a box specially tailored for you.
                </p>

                {mysteryStatus === "error" && <div style={{ color: "red", marginBottom: "16px", fontSize: "0.9rem", textAlign: "center" }}>Please fill in your name and email.</div>}

                <button className="btn btn-primary" style={{ width: '100%', padding: '14px', borderRadius: '50px' }} onClick={async () => {
                  if (!mysteryName || !mysteryEmail) {
                    setMysteryStatus("error");
                    return;
                  }
                  try {
                    await axios.post("/api/mystery-boxes", {
                      name: mysteryName,
                      email: mysteryEmail,
                      category: mysteryCategory,
                      price: mysteryPrice,
                      preferences: mysteryPreferences
                    });
                    setMysteryStatus("success");
                  } catch (err) {
                    console.error(err);
                  }
                }}>
                  Submit Request
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating Spin Available Notification */}
      {showSpinNotification && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          background: 'rgba(26, 26, 26, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '20px 24px',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxWidth: '320px',
          animation: 'slideIn 0.5s ease-out',
          color: 'white',
          fontFamily: 'Outfit'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1.2rem' }}>{canSpin ? '🎉' : '⏳'}</span>
            <button 
              onClick={() => setShowSpinNotification(false)}
              style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.05rem', fontWeight: 'bold' }}
            >
              ✕
            </button>
          </div>
          <div style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--primary)' }}>
            {canSpin ? "Daily Spin is Available!" : "Daily Spin Locked"}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: '1.4' }}>
            {canSpin 
              ? "Your free daily spin is ready. Spin the wheel to unlock exclusive discounts and free gifts!"
              : `Next spin available in: ${spinCountdown}`
            }
          </div>
          <button 
            onClick={() => {
              if (canSpin) {
                setShowWheel(true);
                setShowSpinNotification(false);
              }
            }}
            disabled={!canSpin}
            style={{
              background: canSpin ? 'var(--primary)' : '#444',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: canSpin ? 'pointer' : 'not-allowed',
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              textAlign: 'center'
            }}
          >
            {canSpin ? "Spin & Save Now" : "Come back later"}
          </button>
        </div>
      )}

      {/* Claim Success Celebration Modal */}
      {showClaimSuccessModal && claimedCouponInfo && (
        <div className="wheel-modal" style={{ zIndex: 10000 }}>
          <div 
            className="wheel-container" 
            style={{ 
              maxWidth: '480px', 
              textAlign: 'center', 
              padding: '40px 30px', 
              background: 'rgba(26, 26, 26, 0.95)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              color: 'white',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
              animation: 'scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.8rem', marginBottom: '8px', color: 'var(--primary)' }}>
              {claimedCouponInfo.isFreeGift ? "Free Gift Claimed!" : "Prize Claimed!"}
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#ccc', marginBottom: '24px', lineHeight: '1.5' }}>
              {claimedCouponInfo.isFreeGift 
                ? `Your free gift "${claimedCouponInfo.giftName}" has been successfully added directly to your cart at ₹0 price!` 
                : "Your exclusive spin wheel offer has been successfully registered in our database!"}
            </p>
            
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              border: '1px dashed var(--primary)', 
              padding: '16px 20px', 
              borderRadius: '12px', 
              marginBottom: '20px' 
            }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#aaa', letterSpacing: '1px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Your Coupon Code:</span>
              <strong style={{ fontSize: '1.6rem', color: 'var(--primary)', fontFamily: 'monospace', letterSpacing: '2px' }}>
                {claimedCouponInfo.code}
              </strong>
            </div>

            {claimedCouponInfo.isFreeGift ? (
              <div style={{ fontSize: '0.85rem', color: '#ffbd59', background: 'rgba(255, 189, 89, 0.1)', border: '1px solid rgba(255, 189, 89, 0.2)', padding: '12px 16px', borderRadius: '12px', marginBottom: '30px', fontWeight: 'bold', lineHeight: '1.4', textAlign: 'left' }}>
                ⚠️ <b>Shipping Policy:</b> We cannot ship free gift products alone. When you purchase any other standard product, your free gift will be shipped with it together!
              </div>
            ) : (
              <div style={{ fontSize: '0.82rem', color: '#ff6b6b', background: 'rgba(255, 107, 107, 0.1)', padding: '10px 14px', borderRadius: '8px', marginBottom: '30px', fontWeight: 'bold', lineHeight: '1.4' }}>
                ⏳ Valid for exactly 2 days (expires {claimedCouponInfo.expiryDate}). After this, it will automatically expire and be deleted from the database.
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                className="btn btn-primary" 
                onClick={() => { setShowClaimSuccessModal(false); navigate("/checkout"); }}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.95rem', letterSpacing: '1px', border: 'none', cursor: 'pointer' }}
              >
                Go to Checkout
              </button>
              <button 
                onClick={() => setShowClaimSuccessModal(false)}
                style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', padding: '8px' }}
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @media (max-width: 768px) {
          /* Summer Capsule section */
          .home-page section[style*="40px 32px"] {
            margin: 12px !important;
            padding: 56px 20px !important;
            border-radius: 20px !important;
          }

          /* Mystery box section */
          .home-page section.dark-section {
            margin: 40px 0 !important;
            border-radius: 0 !important;
            padding: 64px 20px !important;
          }
          .home-page section.dark-section h2 { font-size: 2rem !important; }
          .home-page section.dark-section p { font-size: 0.95rem !important; }

          /* Gallery section */
          .home-page section[style*="80px 32px"] {
            padding: 48px 16px !important;
          }

          /* Cinematic workshop section */
          .home-page section[style*="600px"] {
            height: 340px !important;
            margin: 40px 0 !important;
            border-radius: 0 !important;
          }
          .home-page section[style*="600px"] h2 { font-size: 2rem !important; }

          /* Founders section */
          .founders-section {
            margin: 40px 0 !important;
            padding: 48px 20px !important;
            border-radius: 0 !important;
          }
          .founders-right h2 { font-size: 2rem !important; }
          .founders-right p { font-size: 0.95rem !important; }
          .founders-quote { font-size: 1.1rem !important; }

          /* Events banner */
          .home-page a[href="/events"] > div {
            margin: 0 16px 32px !important;
            padding: 20px 16px !important;
            flex-wrap: wrap !important;
            gap: 12px !important;
          }

          /* Partners section */
          .home-page section[style*="Featured"] div[style*="gap: '60px'"],
          .home-page .partners-row {
            gap: 24px !important;
          }

          /* Spin notification */
          .home-page div[style*="bottom: '30px'"][style*="right: '30px'"] {
            right: 12px !important;
            bottom: 140px !important;
            max-width: 280px !important;
          }

          /* Section title clamp */
          .section-title { font-size: clamp(1.4rem, 5vw, 2.4rem) !important; }

          /* Process section title */
          .process-section h2 { font-size: clamp(1.4rem, 5vw, 2.4rem); }
        }
      `}</style>
    </div>
  );
}
