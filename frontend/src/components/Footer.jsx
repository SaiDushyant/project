import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(0,0,0,0.05)', background: '#ffffff' }}>
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="logo">
              <img src="https://qbjlbtdwiqvmsovbfpgf.supabase.co/storage/v1/object/sign/akara-assests/Logo/AKARA.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zOTI5NWVlYi04ZWVmLTQwMjYtYTQzNS05ODI5ZWM1Y2QwNTgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJha2FyYS1hc3Nlc3RzL0xvZ28vQUtBUkEucG5nIiwiaWF0IjoxNzc3MTc4NzM0LCJleHAiOjQ5MzA3Nzg3MzR9.ZnWan6Mfw8Vng1dk3t4ZrSu1rYJjwV4a8PiRmHKzFz4" alt="AKARA Logo" style={{height: "65px", width: "auto", objectFit: "contain", marginBottom: "20px"}} />
            </Link>
            <p style={{ maxWidth: '300px', fontSize: '0.9rem', lineHeight: 1.7 }}>
              Crafting premium custom keepsakes tailored to your unique vision. From badges to plaques, we turn memories into tangible art.
            </p>
            <div className="social-links" style={{ display: 'flex', gap: '15px', marginTop: '24px' }}>
              <a href="#" className="social-icon">📸</a>
              <a href="#" className="social-icon">💬</a>
              <a href="#" className="social-icon">🐦</a>
              <a href="#" className="social-icon">📌</a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              {["Badges", "Magnets", "Posters", "Plaques", "Bookmarks"].map((cat) => (
                <li key={cat}><Link to={`/category/${cat}`} className="footer-link">{cat}</Link></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              {[
                { name: "Track Your Order", path: "/track-order" },
                { name: "Shipping Policy", path: "/shop" },
                { name: "Return Policy", path: "/shop" },
                { name: "Privacy Policy", path: "/shop" },
                { name: "Contact Us", path: "/shop" }
              ].map((item) => (
                <li key={item.name}><Link to={item.path} className="footer-link">{item.name}</Link></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>About</h4>
            <ul>
              {[
                { name: "Our Story", path: "/shop" },
                { name: "Behind the Scenes", path: "/shop" },
                { name: "Events", path: "/events" },
                { name: "Akara Club", path: "/shop" },
                { name: "Wholesale", path: "/shop" }
              ].map((item) => (
                <li key={item.name}><Link to={item.path} className="footer-link">{item.name}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom" style={{ marginTop: '60px', paddingTop: '32px', borderTop: '1px solid #f0f0f0' }}>
          <p style={{ fontSize: '0.85rem', textAlign: 'center' }}>
            © {new Date().getFullYear()} Akara Keepsakes. All rights reserved. <br/>
            <span style={{ marginTop: '8px', display: 'inline-block' }}>Crafted with passion for collectors worldwide.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
