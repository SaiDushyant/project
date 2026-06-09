const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const { requireAdmin } = require("../middleware/auth");
const { sendOrderConfirmation } = require("../utils/email");

// POST /api/orders — public, called from checkout after payment verified
router.post("/", async (req, res) => {
  const {
    customerName, customerPhone, customerEmail,
    address, city, pincode, notes,
    items, subtotal, shipping, tax, total,
    paymentId, paymentStatus,
    couponUsed, discountAmount,
  } = req.body;

  if (!customerName || !customerPhone || !address || !city || !pincode || !items?.length) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // BUG-28: Server-side out-of-stock validation
  const productIds = items.map((i) => i.productId || i._id).filter(Boolean);
  if (productIds.length > 0) {
    const { data: dbProducts } = await supabase
      .from("products")
      .select("id, in_stock, name")
      .in("id", productIds);

    const outOfStock = (dbProducts || []).filter((p) => !p.in_stock);
    if (outOfStock.length > 0) {
      const names = outOfStock.map((p) => p.name).join(", ");
      return res.status(400).json({ error: `Out of stock: ${names}` });
    }
  }

  const { data, error } = await supabase
    .from("orders")
    .insert([{
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail || "",
      address,
      city,
      pincode,
      notes: notes || "",
      items,
      subtotal,
      shipping,
      tax,
      total,
      payment_id: paymentId || null,
      payment_status: paymentStatus || "pending",
      coupon_used: couponUsed || null,
      discount_amount: discountAmount || 0,
    }])
    .select("id")
    .single();

  if (error) return res.status(500).json({ error: error.message });

  // Send confirmation email — fire-and-forget, never block the response
  sendOrderConfirmation({
    customerName, customerEmail, address, city, pincode,
    items, shipping, discountAmount, total,
  }).catch(() => {});

  res.status(201).json({ id: data.id });
});

// GET /api/orders/track?phone=XXXXXXXXXX — public order tracking by phone
router.get("/track", async (req, res) => {
  const { phone } = req.query;
  if (!phone || !/^\d{10}$/.test(phone.trim())) {
    return res.status(400).json({ error: "Enter a valid 10-digit phone number" });
  }

  const { data, error } = await supabase
    .from("orders")
    .select("id, created_at, status, total, items, customer_name, payment_status")
    .eq("customer_phone", phone.trim())
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) return res.status(500).json({ error: error.message });

  res.json(
    (data || []).map((o) => ({
      _id: o.id,
      customerName: o.customer_name,
      status: o.status || "pending",
      paymentStatus: o.payment_status,
      total: o.total,
      itemCount: (o.items || []).reduce((s, i) => s + (i.qty || 1), 0),
      createdAt: o.created_at,
    }))
  );
});

// GET /api/orders/sales/summary — admin
router.get("/sales/summary", requireAdmin, async (req, res) => {
  const now = new Date();

  const startOf = (daysAgo) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
  };

  // BUG-20: Use allSettled so one failed query doesn't crash the entire dashboard
  const [todayRes, weekRes, monthRes, allRes] = await Promise.allSettled([
    supabase.from("orders").select("total").gte("created_at", startOf(0)),
    supabase.from("orders").select("total").gte("created_at", startOf(6)),
    supabase.from("orders").select("total").gte("created_at", startOf(29)),
    supabase.from("orders").select("total"),
  ]);

  const rows = (result) =>
    result.status === "fulfilled" ? result.value.data || [] : [];
  const sum = (data) => data.reduce((s, r) => s + parseFloat(r.total || 0), 0);

  res.json({
    today:   { revenue: sum(rows(todayRes)),  orders: rows(todayRes).length },
    week:    { revenue: sum(rows(weekRes)),   orders: rows(weekRes).length },
    month:   { revenue: sum(rows(monthRes)),  orders: rows(monthRes).length },
    allTime: { revenue: sum(rows(allRes)),    orders: rows(allRes).length },
  });
});

// GET /api/orders/sales/chart — last 30 days daily breakdown
router.get("/sales/chart", requireAdmin, async (req, res) => {
  const start = new Date();
  start.setDate(start.getDate() - 29);
  start.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("orders")
    .select("total, created_at")
    .gte("created_at", start.toISOString())
    .order("created_at", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  const byDate = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const key = d.toISOString().slice(0, 10);
    byDate[key] = { date: key, revenue: 0, orders: 0 };
  }

  for (const order of data || []) {
    const key = order.created_at.slice(0, 10);
    if (byDate[key]) {
      byDate[key].revenue += parseFloat(order.total);
      byDate[key].orders += 1;
    }
  }

  res.json(Object.values(byDate));
});

// GET /api/orders/sales/top-products — top 10 by qty sold
router.get("/sales/top-products", requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from("orders")
    .select("items, created_at");

  if (error) return res.status(500).json({ error: error.message });

  const productMap = {};
  for (const order of data || []) {
    for (const item of order.items || []) {
      const id = item.productId || item._id;
      if (!productMap[id]) {
        productMap[id] = {
          id,
          name: item.name,
          image: item.image,
          category: item.category,
          price: item.price,
          qtySold: 0,
          revenue: 0,
        };
      }
      productMap[id].qtySold += item.qty;
      productMap[id].revenue += item.price * item.qty;
    }
  }

  const sorted = Object.values(productMap)
    .sort((a, b) => b.qtySold - a.qtySold)
    .slice(0, 10);

  res.json(sorted);
});

// GET /api/orders — recent orders list (admin)
router.get("/", requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return res.status(500).json({ error: error.message });

  res.json(
    (data || []).map((o) => ({
      _id: o.id,
      customerName: o.customer_name,
      customerPhone: o.customer_phone,
      customerEmail: o.customer_email,
      address: `${o.address}, ${o.city} - ${o.pincode}`,
      items: o.items,
      subtotal: o.subtotal,
      shipping: o.shipping,
      tax: o.tax,
      total: o.total,
      status: o.status,
      createdAt: o.created_at,
    }))
  );
});

// PUT /api/orders/:id/status — update status (admin)
router.put("/:id/status", requireAdmin, async (req, res) => {
  const { status } = req.body;
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
