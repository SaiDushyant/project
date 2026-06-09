const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const { requireAdmin } = require("../middleware/auth");

// Map snake_case DB row → camelCase shape the frontend expects
function mapProduct(row) {
  if (!row) return null;
  return {
    _id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    originalPrice: row.original_price,
    rating: row.rating,
    reviews: row.reviews,
    image: row.image,
    description: row.description,
    theme: row.theme,
    sizes: row.sizes || [],
    colors: row.colors || [],
    inStock: row.in_stock,
    featured: row.featured,
    badge: row.badge,
    bannerImage: row.banner_image,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// GET /api/products — optional ?category= and ?search=
router.get("/", async (req, res) => {
  try {
    let query = supabase.from("products").select("*").order("created_at", { ascending: false });

    if (req.query.category) query = query.eq("category", req.query.category);
    if (req.query.theme) query = query.eq("theme", req.query.theme);
    if (req.query.search) {
      const term = `%${req.query.search}%`;
      query = query.or(`name.ilike.${term},description.ilike.${term},category.ilike.${term}`);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data.map(mapProduct));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/featured
router.get("/featured", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("featured", true);
    if (error) throw error;
    res.json(data.map(mapProduct));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:id/recommendations
router.get("/:id/recommendations", async (req, res) => {
  try {
    const { data: product, error: pErr } = await supabase
      .from("products")
      .select("category")
      .eq("id", req.params.id)
      .single();
    if (pErr) return res.status(404).json({ message: "Product not found" });

    const [sameRes, otherRes] = await Promise.all([
      supabase.from("products").select("*").eq("category", product.category).neq("id", req.params.id).limit(2),
      supabase.from("products").select("*").neq("category", product.category).limit(2),
    ]);

    const combined = [...(sameRes.data || []), ...(otherRes.data || [])];
    res.json(combined.map(mapProduct));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", req.params.id)
      .single();
    if (error) return res.status(404).json({ message: "Product not found" });
    res.json(mapProduct(data));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products (admin)
router.post("/", requireAdmin, async (req, res) => {
  try {
    const { _id, ...body } = req.body;
    const payload = {
      name: body.name,
      category: body.category,
      price: body.price,
      original_price: body.originalPrice ?? null,
      rating: body.rating ?? 0,
      reviews: body.reviews ?? 0,
      image: body.image,
      description: body.description,
      theme: body.theme || null,
      sizes: body.sizes || [],
      colors: body.colors || [],
      in_stock: body.inStock ?? true,
      featured: body.featured ?? false,
      badge: body.badge ?? null,
      banner_image: body.bannerImage ?? null,
    };
    const { data, error } = await supabase.from("products").insert(payload).select().single();
    if (error) throw error;
    res.status(201).json(mapProduct(data));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/products/:id (admin)
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const body = req.body;
    const payload = {
      name: body.name,
      category: body.category,
      price: body.price,
      original_price: body.originalPrice ?? null,
      image: body.image,
      description: body.description,
      theme: body.theme || null,
      sizes: body.sizes || [],
      colors: body.colors || [],
      in_stock: body.inStock ?? true,
      featured: body.featured ?? false,
      badge: body.badge ?? null,
      banner_image: body.bannerImage ?? null,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", req.params.id)
      .select()
      .single();
    if (error) return res.status(404).json({ message: "Product not found" });
    res.json(mapProduct(data));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/products/:id (admin)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const { error } = await supabase.from("products").delete().eq("id", req.params.id);
    if (error) throw error;
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
