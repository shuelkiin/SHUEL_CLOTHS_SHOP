import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useProductsStore } from "../../state/products.store";

export default function NewProduct() {
  const navigate = useNavigate();

  const categories = useProductsStore((s) => s.categories).filter((c) => c !== "All");
  const addProduct = useProductsStore((s) => s.addProduct);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: categories[0] || "Men",
    stock: 10,
    image: "",
    description: "",
  });

  const canSave = useMemo(() => {
    return (
      form.name.trim().length > 1 &&
      Number(form.price) > 0 &&
      form.category &&
      String(form.image || "").trim().startsWith("http") &&
      Number(form.stock) >= 0
    );
  }, [form]);

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!canSave) return;
    addProduct(form);
    navigate("/admin/products");
  }

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div>
          <h2 style={{ margin: 0 }}>Add Product</h2>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>Create a new item for the shop</div>
        </div>

        <Link to="/admin/products" style={{ textDecoration: "underline" }}>
          ← Back to Products
        </Link>
      </div>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 800 }}>Product Name</span>
          <input
            className="input"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="e.g. Classic Hoodie"
          />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontWeight: 800 }}>Price (KSh)</span>
            <input
              className="input"
              value={form.price}
              onChange={(e) => setField("price", e.target.value)}
              placeholder="e.g. 2500"
              inputMode="numeric"
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontWeight: 800 }}>Category</span>
            <select className="input" value={form.category} onChange={(e) => setField("category", e.target.value)}>
              {categories.length ? (
                categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))
              ) : (
                <option value="Men">Men</option>
              )}
            </select>
          </label>
        </div>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 800 }}>Stock (Available)</span>
          <input
            className="input"
            value={form.stock}
            onChange={(e) => setField("stock", e.target.value)}
            placeholder="e.g. 20"
            inputMode="numeric"
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 800 }}>Image URL</span>
          <input
            className="input"
            value={form.image}
            onChange={(e) => setField("image", e.target.value)}
            placeholder="https://..."
          />
        </label>

        {String(form.image || "").trim() ? (
          <div style={{ marginTop: 4 }}>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>Preview</div>
            <img
              src={form.image}
              alt="preview"
              style={{
                width: "100%",
                maxHeight: 260,
                objectFit: "cover",
                borderRadius: 14,
                border: "1px solid var(--border)",
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        ) : null}

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontWeight: 800 }}>Description</span>
          <textarea
            className="input"
            rows={4}
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Short description..."
          />
        </label>

        <button className="btn btn-dark" disabled={!canSave} style={{ opacity: canSave ? 1 : 0.5 }}>
          Save Product
        </button>

        {!canSave && (
          <div style={{ fontSize: 12, color: "var(--muted)" }}>
            Add name, price, category, stock and a valid image URL (starts with http).
          </div>
        )}
      </form>
    </div>
  );
}