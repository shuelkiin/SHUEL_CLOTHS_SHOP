const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function isAdmin(req) {
  const secret = req.headers["x-admin-secret"];
  return secret && process.env.ADMIN_SECRET && secret === process.env.ADMIN_SECRET;
}

module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data || []);
    }

    if (req.method === "POST") {
      if (!isAdmin(req)) return res.status(401).json({ error: "Unauthorized" });

      const body = req.body || {};
      const payload = {
        name: String(body.name ?? "").trim(),
        description: String(body.description ?? ""),
        price: Number(body.price ?? 0),
        image: String(body.image ?? ""),
        category: String(body.category ?? "Uncategorized"),
        stock: Number(body.stock ?? 0),
      };

      if (!payload.name) return res.status(400).json({ error: "Name required" });

      const { data, error } = await supabase
        .from("products")
        .insert(payload)
        .select("*")
        .single();

      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json(data);
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
};
