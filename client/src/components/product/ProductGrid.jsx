import { useMemo } from "react";
import { useProductsStore } from "../../state/products.store";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const products = useProductsStore((s) => s.products);
  const searchQuery = useProductsStore((s) => s.searchQuery);
  const activeCategory = useProductsStore((s) => s.activeCategory);

  const filteredProducts = useMemo(() => {
    const q = (searchQuery || "").trim().toLowerCase();

    return (products || []).filter((p) => {
      const matchesQuery =
        !q ||
        (p.name || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q);

      const matchesCategory =
        !activeCategory ||
        activeCategory === "All" ||
        p.category === activeCategory;

      return matchesQuery && matchesCategory;
    });
  }, [products, searchQuery, activeCategory]);

  if (!products || products.length === 0) {
    return (
      <div style={{ marginTop: 20 }}>
        No products yet.
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: 18,
        marginTop: 18,
      }}
    >
      {filteredProducts.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
