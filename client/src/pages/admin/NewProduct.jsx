import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProductsStore } from "../../state/products.store";

export default function NewProduct() {
  const navigate = useNavigate();
  const addProduct = useProductsStore((s) => s.addProduct);
  const categories = useProductsStore((s) => s.categories);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("Shirts");
  const [stock, setStock] = useState(10);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selectableCategories = useMemo(() => {
    const base = (categories || []).filter((c) => c && c !== "All");
    const extras = ["Shirts", "Trousers", "Shoes", "Hoodies", "Dresses"];
    return Array.from(new Set([...extras, ...base]));
  }, [categories]);

  const onSave = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      name,
      description,
      price: Number(price || 0),
      image,
      category,
      stock: Number(stock || 0),
    };

    if (!payload.name.trim()) return setError("Product name is required.");
    if (!payload.image.trim()) return setError("Image URL is required.");
    if (!payload.category.trim()) return setError("Category is required.");

    try {
      setSaving(true);
      await addProduct(payload);
      navigate("/admin/products");
    } catch (err) {
      setError(err?.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ fontSize: 22, fontWeight: 900 }}>Add Product</div>
      <div style={{ color: "var(--muted)", marginTop: 6 }}>
        Saves to Supabase (visible to everyone).
      </div>

      <form onSubmit={onSave} style={{ marginTop: 14, display: "grid", gap: 10 }}>
        <input className="input" placeholder="Product name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input" placeholder="Image URL (https://...)" value={image} onChange={(e) => setImage(e.target.value)} />
        <textarea
          className="input"
          style={{ minHeight: 90, resize: "vertical" }}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <input className="input" placeholder="Price (KSh)" value={price} onChange={(e) => setPrice(e.target.value)} />
          <input className="input" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} />
        </div>

        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
          {selectableCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {error ? (
          <div className="card" style={{ padding: 12, borderColor: "#fecaca", background: "#fff1f2" }}>
            <b>Error:</b> {error}
          </div>
        ) : null}

        <button className="btn btn-dark" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Product"}
        </button>
      </form>
    </div>
  );
}
