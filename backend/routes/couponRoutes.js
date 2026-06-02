const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

// PUBLIC: Validate a coupon
router.post("/validate", async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) return res.status(400).json({ error: "Code is required" });

        const specialCoupons = {
            "AKARA5": { discount_percent: 5, code: "AKARA5" },
            "FREESQUISHY": { discount_percent: 0, code: "FREESQUISHY" },
            "FREESTICKERS": { discount_percent: 0, code: "FREESTICKERS" },
            "FREECHARM": { discount_percent: 0, code: "FREECHARM" }
        };

        const upperCode = code.toUpperCase();
        if (specialCoupons[upperCode]) {
            return res.json({
                success: true,
                discount_percent: specialCoupons[upperCode].discount_percent,
                code: specialCoupons[upperCode].code
            });
        }

        const { data: coupon, error } = await supabase
            .from("coupons")
            .select("*")
            .eq("code", upperCode)
            .eq("is_active", true)
            .single();

        if (error || !coupon) {
            return res.status(404).json({ error: "Invalid or inactive coupon code" });
        }

        const now = new Date();
        const expiry = new Date(coupon.expiry_date);

        if (now > expiry) {
            // Automatically delete expired coupon from DB!
            await supabase.from("coupons").delete().eq("id", coupon.id);
            return res.status(400).json({ error: "This coupon has expired" });
        }

        res.json({ 
            success: true, 
            discount_percent: (coupon.code.startsWith("FREECHARM-") || coupon.code.startsWith("FREESTICKERS-") || coupon.code.startsWith("FREESQUISHY-")) ? 0 : coupon.discount_percent,
            code: coupon.code
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUBLIC: Claim a coupon from spin wheel (valid for 2 days)
router.post("/claim", async (req, res) => {
    try {
        const { code, discountPercent } = req.body;
        if (!code) return res.status(400).json({ error: "Code is required" });

        // Generate a unique code suffix to prevent collision and reuse
        const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
        const uniqueCode = `${code.toUpperCase()}-${randomSuffix}`;
        
        // Expiry is 2 days from now
        const expiryDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();

        // Bypassing the coupons_discount_percent_check (discount_percent > 0) DB constraint:
        // Set discount_percent to 1 for physical free gifts (which are ₹0 anyway), and validate overrides it to 0.
        const parsedPercent = parseInt(discountPercent || 0);
        const finalPercent = parsedPercent <= 0 ? 1 : parsedPercent;

        const { error } = await supabase
            .from("coupons")
            .insert([{
                code: uniqueCode,
                discount_percent: finalPercent,
                expiry_date: expiryDate,
                is_active: true
            }]);

        if (error) {
            console.error("Supabase coupon insert error:", JSON.stringify(error, null, 2));
            throw error;
        }
        res.status(201).json({ success: true, code: uniqueCode, expiryDate });
    } catch (err) {
        console.error("Coupon claim route error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// PUBLIC: Get active general coupons
router.get("/public", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("coupons")
            .select("*")
            .eq("is_active", true)
            .gte("expiry_date", new Date().toISOString())
            .order("created_at", { ascending: false });
        
        if (error) throw error;
        // Filter out spin wheel unique codes (they contain a hyphen)
        const generalCoupons = data.filter(c => !c.code.includes("-"));
        res.json(generalCoupons);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADMIN: List all coupons
router.get("/", async (_, res) => {
    try {
        const { data, error } = await supabase
            .from("coupons")
            .select("*")
            .order("created_at", { ascending: false });
        
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUBLIC: Mark a coupon as used (called after successful order)
router.post("/use", async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) return res.status(400).json({ error: "Code is required" });

        // Only deactivate DB-based coupons (spin-wheel ones have unique suffixes)
        const { error } = await supabase
            .from("coupons")
            .update({ is_active: false })
            .eq("code", code.toUpperCase());

        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADMIN: Create a coupon
const { requireAdmin } = require("../middleware/auth");
router.post("/", requireAdmin, async (req, res) => {
    try {
        const { code, discount_percent, expiry_date } = req.body;
        const { data, error } = await supabase
            .from("coupons")
            .insert([{ 
                code: code.toUpperCase(), 
                discount_percent: parseInt(discount_percent), 
                expiry_date,
                is_active: true
            }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADMIN: Delete a coupon
router.delete("/:id", async (req, res) => {
    try {
        const { error } = await supabase
            .from("coupons")
            .delete()
            .eq("id", req.params.id);
        
        if (error) throw error;
        res.json({ message: "Coupon deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
