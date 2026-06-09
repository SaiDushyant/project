const supabase = require('../config/supabase');

// Comma-separated list of admin emails, e.g. ADMIN_EMAILS=a@b.com,c@d.com
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

async function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Invalid token' });

  // Fast path: email listed in ADMIN_EMAILS env var
  if (ADMIN_EMAILS.length > 0 && ADMIN_EMAILS.includes(user.email?.toLowerCase())) {
    req.user = user;
    return next();
  }

  // DB path: check user_roles table (may not exist yet — fail gracefully)
  try {
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (roleData?.role === 'admin') {
      req.user = user;
      return next();
    }
  } catch {
    // user_roles table doesn't exist — fall through to 403
  }

  return res.status(403).json({ error: 'Admin access required' });
}

module.exports = { requireAdmin };
