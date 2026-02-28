import { useProductsStore } from "../../state/products.store";

export default function CategoryPills() {
  const categories = useProductsStore((s) => s.categories);
  const active = useProductsStore((s) => s.activeCategory);
  const setActiveCategory = useProductsStore((s) => s.setActiveCategory);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
      {categories.map((c) => (
        <button
          key={c}
          className={`pill ${active === c ? "active" : ""}`}
          onClick={() => setActiveCategory(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}