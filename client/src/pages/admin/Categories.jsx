import { useMemo, useState } from "react";
import { useProductsStore } from "../../state/products.store";

export default function Categories() {
  const categories = useProductsStore((s) => s.categories) || [];
  const products = useProductsStore((s) => s.products) || [];

  const addCategory = useProductsStore((s) => s.addCategory);
  const deleteCategory = useProductsStore((s) => s.deleteCategory);
  const setActiveCategory = useProductsStore((s) => s.setActiveCategory);
  const activeCategory = useProductsStore((s) => s.activeCategory);

  const [name, setName] = useState("");

  const stats = useMemo(() => {
    const counts = {};
    for (const p of products) {
      const c = p.category || "Uncategorized";
      counts[c] = (counts[c] || 0) + 1;
    }
    return counts;
  }, [products]);

  function onAdd(e) {
    e.preventDefault();
    const clean = name.trim();
    if (!clean) return;
    addCategory(clean);
    setName("");
  }

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: 0 }}>Categories</h2>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>
            Create categories and organize products
          </div>
        </div>
      </div>

      <form onSubmit={onAdd} style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          className="input"
          placeholder="New category name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ flex: 1, minWidth: 220 }}
        />
        <button className="btn btn-dark" type="submit">
          Add
        </button>
      </form>

      <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
        {categories.length === 0 ? (
          <div style={{ color: "var(--muted)" }}>No categories yet.</div>
        ) : (
          categories.map((c) => (
            <div
              key={c}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
                padding: 12,
                borderRadius: 14,
                border: "1px solid var(--border)",
                background: "#fff",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={{ fontWeight: 900 }}>{c}</div>
                <div style={{ color: "var(--muted)", fontSize: 13 }}>
                  Products: <strong style={{ color: "#111" }}>{stats[c] || 0}</strong>
                  {" • "}
                  Active:{" "}
                  <strong style={{ color: "#111" }}>
                    {activeCategory === c ? "Yes" : "No"}
                  </strong>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => setActiveCategory(c)}
                >
                  Filter
                </button>

                {c !== "All" ? (
                  <button
                    className="btn btn-ghost"
                    type="button"
                    onClick={() => {
                      // if deleting active, reset to All
                      if (activeCategory === c) setActiveCategory("All");
                      deleteCategory(c);
                    }}
                  >
                    Delete
                  </button>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: 14, color: "var(--muted)", fontSize: 12 }}>
        Tip: “Filter” sets the active category for the shop page.
      </div>
    </div>
  );
}