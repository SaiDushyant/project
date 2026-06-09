import { useState } from "react";
import axios from "axios";

const STATUS_STEPS = ["pending", "confirmed", "shipped", "delivered"];

const STATUS_META = {
  pending:   { label: "Order Placed",  icon: "📋", color: "#f59e0b" },
  confirmed: { label: "Confirmed",     icon: "✅", color: "#10b981" },
  shipped:   { label: "Shipped",       icon: "🚚", color: "#3b82f6" },
  delivered: { label: "Delivered",     icon: "🎉", color: "#059669" },
  cancelled: { label: "Cancelled",     icon: "❌", color: "#ef4444" },
};

function StatusTracker({ status }) {
  if (status === "cancelled") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#ef4444", fontWeight: 700 }}>
        ❌ Order Cancelled
      </div>
    );
  }
  const currentIdx = STATUS_STEPS.indexOf(status);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0", marginTop: "8px" }}>
      {STATUS_STEPS.map((step, i) => {
        const done = i <= currentIdx;
        const meta = STATUS_META[step];
        return (
          <div key={step} style={{ display: "flex", alignItems: "center", flex: i < STATUS_STEPS.length - 1 ? "1" : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: done ? meta.color : "var(--gray-light)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.1rem", transition: "background 0.3s",
                border: `2px solid ${done ? meta.color : "var(--border)"}`,
              }}>
                {done ? meta.icon : "○"}
              </div>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: done ? meta.color : "var(--gray)", whiteSpace: "nowrap" }}>
                {meta.label}
              </span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 3, marginBottom: "18px",
                background: i < currentIdx ? meta.color : "var(--border)",
                transition: "background 0.3s",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function OrderTrackingPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e) {
    e.preventDefault();
    if (!/^\d{10}$/.test(phone.trim())) {
      setError("Enter a valid 10-digit phone number");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/orders/track?phone=${phone.trim()}`);
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page" style={{ paddingTop: "100px", minHeight: "80vh" }}>
      <div className="main-content" style={{ maxWidth: "720px", margin: "0 auto" }}>
        <h1 className="elegant-title" style={{ fontSize: "clamp(2rem, 6vw, 3rem)", marginBottom: "8px", color: "var(--dark)" }}>
          Track Your <span className="italic">Order</span>
        </h1>
        <p style={{ color: "var(--gray)", marginBottom: "40px", fontSize: "1.05rem" }}>
          Enter the phone number you used at checkout to see your order status.
        </p>

        <form onSubmit={handleSearch} style={{ display: "flex", gap: "12px", marginBottom: "40px" }}>
          <input
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setError(""); }}
            placeholder="10-digit mobile number"
            maxLength={10}
            style={{
              flex: 1, padding: "14px 18px", border: `1px solid ${error ? "#ef4444" : "var(--border)"}`,
              borderRadius: "8px", fontSize: "1rem", background: "var(--bg)", color: "var(--text)", outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              background: "var(--dark)", color: "white", border: "none",
              padding: "14px 28px", borderRadius: "8px", fontWeight: 800,
              fontSize: "0.95rem", cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: "1px", opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Searching…" : "Track"}
          </button>
        </form>

        {error && (
          <p style={{ color: "#ef4444", fontWeight: 600, marginBottom: "24px" }}>{error}</p>
        )}

        {orders !== null && orders.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--gray)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📭</div>
            <h3 style={{ color: "var(--dark)", marginBottom: "8px" }}>No orders found</h3>
            <p>No orders are linked to this phone number.</p>
          </div>
        )}

        {orders && orders.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {orders.map((order) => (
              <div
                key={order._id}
                style={{
                  background: "var(--card-bg)", borderRadius: "16px",
                  border: "1px solid var(--border)", padding: "28px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--dark)", marginBottom: "4px" }}>
                      Order #{order._id.slice(-8).toUpperCase()}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "var(--gray)" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                      {" · "}{order.itemCount} item{order.itemCount !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--dark)" }}>₹{parseFloat(order.total).toFixed(2)}</div>
                    <div style={{
                      fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase",
                      color: order.paymentStatus === "paid" ? "#059669" : "#f59e0b",
                      marginTop: "2px",
                    }}>
                      {order.paymentStatus === "paid" ? "Payment Received" : "Payment Pending"}
                    </div>
                  </div>
                </div>
                <StatusTracker status={order.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
