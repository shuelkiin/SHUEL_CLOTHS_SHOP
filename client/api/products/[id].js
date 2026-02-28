/* eslint-disable */
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

    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing id" });

    if (req.method === "PUT") {
      if (!isAdmin) return res.status(401).json({ error: "Unauthorized" });

      const b = req.body || {};
      const patch = {};

      if (b.name !== undefined) patch.name = String(b.name);
      if (b.description !== undefined) patch.description = String(b.description);
      if (b.image !== undefined) patch.image = String(b.image);
      if (b.category !== undefined) patch.category = String(b.category);
      if (b.price !== undefined) patch.price = Number(b.price);
      if (b.stock !== undefined) patch.stock = Number(b.stock);

      const { data, error } = await supabase
        .from("products")
        .update(patch)
        .eq("id", id)
        .select("*")
        .single();

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    }

    if (req.method === "DELETE") {
      if (!isAdmin) return res.status(401).json({ error: "Unauthorized" });

      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "PUT, DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
}
