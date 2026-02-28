import { useMemo } from "react";
import Navbar from "../components/layout/Navbar.jsx";
import ProductGrid from "../components/product/ProductGrid.jsx";
import WhatsAppButton from "../components/whatsapp/WhatsAppButton.jsx";
import { useProductsStore } from "../state/products.store";

export default function Home() {
  const products = useProductsStore((s) => s.products);
  const categories = useProductsStore((s) => s.categories);
  const searchQuery = useProductsStore((s) => s.searchQuery);
  const activeCategory = useProductsStore((s) => s.activeCategory);

  const setSearchQuery = useProductsStore((s) => s.setSearchQuery);
  const setActiveCategory = useProductsStore((s) => s.setActiveCategory);

  const safeCategories = useMemo(() => {
    // prefer store categories, but also derive if needed
    const list = Array.isArray(categories) && categories.length ? categories : [];
    const uniqueFromProducts = Array.from(
      new Set((products || []).map((p) => p.category).filter(Boolean))
    );

    const merged = list.length ? list : ["All", ...uniqueFromProducts];
    if (!merged.includes("All")) return ["All", ...merged];
    return merged;
  }, [categories, products]);

  return (
    <>
      <Navbar />

      <div className="container" style={{ marginTop: 18 }}>
        {/* Simple Hero */}
        <section
          className="card"
          style={{
            padding: 18,
            borderRadius: 18,
            marginBottom: 14,
            background:
              "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(59,130,246,0.10))",
            boxShadow: "none",
          }}
        >
          <h1 style={{ margin: "0 0 6px", fontSize: 26 }}>
            Find your next fit — clean & simple.
          </h1>
          <p style={{ margin: 0, color: "var(--muted)" }}>
            Browse, search by category, add to cart, and pay with M-Pesa.
          </p>
        </section>

        {/* Search + Categories */}
        <div className="card" style={{ padding: 12, boxShadow: "none", marginBottom: 14 }}>
          {/* Search */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
              <input
                className="input"
                placeholder="Search products..."
                value={searchQuery || ""}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  fontSize: 14,
                  borderRadius: 14,
                }}
              />
              {searchQuery ? (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute",
                    right: 6,
                    top: 6,
                    padding: "6px 10px",
                    borderRadius: 12,
                  }}
                >
                  Clear
                </button>
              ) : null}
            </div>

            <div style={{ color: "var(--muted)", fontSize: 13 }}>
              Category: <strong style={{ color: "#111" }}>{activeCategory || "All"}</strong>
            </div>
          </div>

          {/* Category Pills */}
          <div
            style={{
              marginTop: 10,
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {safeCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`pill ${(!activeCategory && cat === "All") || activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products */}
        <ProductGrid />
      </div>

      <WhatsAppButton />
    </>
  );
}