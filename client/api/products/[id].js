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
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing id" });

    if (req.method === "PUT") {
      if (!isAdmin(req)) return res.status(401).json({ error: "Unauthorized" });

      const body = req.body || {};
      const patch = {};

      ["name", "description", "image", "category"].forEach((k) => {
        if (body[k] !== undefined) patch[k] = body[k];
      });
      if (body.price !== undefined) patch.price = Number(body.price);
      if (body.stock !== undefined) patch.stock = Number(body.stock);

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
      if (!isAdmin(req)) return res.status(401).json({ error: "Unauthorized" });

      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "PUT, DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
};
