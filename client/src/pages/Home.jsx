import { useEffect } from "react";
import { useProductsStore } from "../state/products.store";
import ProductGrid from "../components/product/ProductGrid";

export default function Home() {
  const fetchProducts = useProductsStore((s) => s.fetchProducts);

  useEffect(() => {
    fetchProducts().catch(() => {});
  }, [fetchProducts]);

  return (
    <div className="container">
      <ProductGrid />
    </div>
  );
}
