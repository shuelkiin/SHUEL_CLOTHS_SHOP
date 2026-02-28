import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProductsStore } from "../../state/products.store";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const products = useProductsStore((s) => s.products);
  const categories = useProductsStore((s) => s.categories).filter(
    (c) => c !== "All"
  );
  const updateProduct = useProductsStore((s) => s.updateProduct);

  const product = useMemo(
    () => (products || []).find((p) => p.id === id),
    [products, id]
  );

  const [form, setForm] = useState(() => ({
    name: product?.name || "",
    price: String(product?.price ?? ""),
    category: product?.category || categories[0] || "Men",
    stock: String(product?.stock ?? 0),
    image: product?.image || "",
    description: product?.description || "",
  }));

  if (!product) {
    return (
      <div className="card" style={{ padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Product not found</h2>
        <Link to="/admin/products" style={{ textDecoration: "underline" }}>
          ← Back to Products
        </Link>
      </div>
    );
  }

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const cleanedPrice = Number(
    String(form.price).replaceAll(",", "").trim()
  );
  const cleanedStock = Math.max(
    0,
    Number(String(form.stock).replaceAll(",", "").trim())
  );

  const imageOk =
    form.image.startsWith("http://") || form.image.startsWith("https://");

  const canSave =
    form.name.trim().length >= 2 &&
    cleanedPrice > 0 &&
    cleanedStock >= 0 &&
    imageOk &&
    form.category;

  function onSubmit(e) {
    e.preventDefault();
    if (!canSave) return;

    updateProduct(id, {
      name: form.name.trim(),
      price: cleanedPrice,
      category: form.category,
      stock: cleanedStock,
      image: form.image.trim(),
      description: form.description.trim(),
    });

    navigate("/admin/products");
  }

  return (
    <div className="card" style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <h2>Edit Product</h2>
        <Link to="/admin/products">← Back</Link>
      </div>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          className="input"
          placeholder="Product name"
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
        />

        <input
          className="input"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setField("price", e.target.value)}
        />

        <select
          className="input"
          value={form.category}
          onChange={(e) => setField("category", e.target.value)}
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <input
          className="input"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setField("stock", e.target.value)}
        />

        <input
          className="input"
          placeholder="Image URL"
          value={form.image}
          onChange={(e) => setField("image", e.target.value)}
        />

        {imageOk && (
          <img
            src={form.image}
            alt="preview"
            style={{
              width: "100%",
              maxHeight: 240,
              objectFit: "cover",
              borderRadius: 12,
              border: "1px solid var(--border)",
            }}
          />
        )}

        <textarea
          className="input"
          rows={4}
          placeholder="Description"
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
        />

        <button
          className="btn btn-dark"
          disabled={!canSave}
          style={{ opacity: canSave ? 1 : 0.5 }}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}