import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      return res.status(500).json({
        error: "Missing env vars",
        hasSUPABASE_URL: Boolean(url),
        hasSUPABASE_SERVICE_ROLE_KEY: Boolean(key),
      });
    }

    const supabase = createClient(url, key);

    const secret = req.headers["x-admin-secret"];
    const isAdmin = Boolean(
      secret && process.env.ADMIN_SECRET && secret === process.env.ADMIN_SECRET
    );

    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data || []);
    }

    if (req.method === "POST") {
      if (!isAdmin) return res.status(401).json({ error: "Unauthorized" });

      const b = req.body || {};
      const payload = {
        name: String(b.name ?? "").trim(),
        description: String(b.description ?? ""),
        price: Number(b.price ?? 0),
        image: String(b.image ?? ""),
        category: String(b.category ?? "Uncategorized"),
        stock: Number(b.stock ?? 0),
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
}
