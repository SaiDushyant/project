const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const couponRoutes = require("./routes/couponRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const mysteryBoxRoutes = require("./routes/mysteryBoxRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const supabase = require("./config/supabase");

const app = express();

// Trust Vercel's proxy so express-rate-limit reads the real client IP
app.set("trust proxy", 1);

// Restrict CORS to known origins
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow no-origin requests (Postman, server-to-server, same-origin Vercel)
      if (!origin) return callback(null, true);
      // Allow any vercel.app subdomain (handles preview deployments too)
      if (origin.endsWith(".vercel.app")) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

// BUG-27: Global rate limiter — 200 req/15 min per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use(globalLimiter);

// Stricter limiter for payment and coupon claim endpoints
const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests on this endpoint." },
});

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", sensitiveLimiter, paymentRoutes);
app.use("/api/coupons", sensitiveLimiter, couponRoutes);
app.use("/api/newsletter", sensitiveLimiter, newsletterRoutes);
app.use("/api/mystery-boxes", mysteryBoxRoutes);
app.use("/api/products/:id/reviews", reviewRoutes);

app.get("/", (_, res) => res.json({ message: "Akara API running" }));

async function deleteExpiredEvents() {
  const { error } = await supabase
    .from("events")
    .delete()
    .lt("date", new Date().toISOString());
  if (error) console.error("Event cleanup error:", error.message);
}

if (process.env.NODE_ENV !== "production") {
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on http://localhost:${process.env.PORT || 5000}`);
    deleteExpiredEvents();
    setInterval(deleteExpiredEvents, 60 * 60 * 1000);
  });
} else {
  deleteExpiredEvents();
}

module.exports = app;
