const express = require("express");
const router = express.Router({ mergeParams: true });
const supabase = require("../config/supabase");

// GET /api/products/:id/reviews
router.get("/", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("product_reviews")
    .select("id, user_name, rating, comment, created_at")
    .eq("product_id", id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// POST /api/products/:id/reviews — requires auth token
router.post("/", async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Login required to leave a review" });

  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) return res.status(401).json({ error: "Invalid session" });

  const { rating, comment } = req.body;
  const parsedRating = parseInt(rating);
  if (!parsedRating || parsedRating < 1 || parsedRating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  // One review per user per product
  const { data: existing } = await supabase
    .from("product_reviews")
    .select("id")
    .eq("product_id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) return res.status(409).json({ error: "You have already reviewed this product" });

  const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Customer";

  const { error: insertErr } = await supabase.from("product_reviews").insert([{
    product_id: id,
    user_id: user.id,
    user_name: userName,
    rating: parsedRating,
    comment: (comment || "").trim(),
  }]);

  if (insertErr) return res.status(500).json({ error: insertErr.message });

  // Recalculate and update product rating + review count
  const { data: allReviews } = await supabase
    .from("product_reviews")
    .select("rating")
    .eq("product_id", id);

  if (allReviews && allReviews.length > 0) {
    const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
    await supabase
      .from("products")
      .update({ rating: Math.round(avg * 10) / 10, reviews: allReviews.length })
      .eq("id", id);
  }

  res.status(201).json({ success: true });
});

module.exports = router;
