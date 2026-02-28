import { useMemo } from "react";
import { useProductsStore } from "../../state/products.store";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products: productsProp }) {
  // If Home passes products, use them. Otherwise use store products.
  const storeProducts = useProductsStore((s) => s.products);
  const searchQuery = useProductsStore((s) => s.searchQuery);
  const activeCategory = useProductsStore((s) => s.activeCategory);

  const baseProducts = productsProp ?? storeProducts ?? [];

  const filteredProducts = useMemo(() => {
    const q = (searchQuery || "").trim().toLowerCase();

    return baseProducts.filter((p) => {
      const name = (p?.name || "").toLowerCase();
      const desc = (p?.description || "").toLowerCase();

      const matchesQuery = !q || name.includes(q) || desc.includes(q);

      const matchesCategory =
        !activeCategory || activeCategory === "All" || p?.category === activeCategory;

      return matchesQuery && matchesCategory;
    });
  }, [baseProducts, searchQuery, activeCategory]);

  if (!filteredProducts.length) {
    return (
      <div style={{ marginTop: 18, color: "var(--muted)" }}>
        No products found.
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