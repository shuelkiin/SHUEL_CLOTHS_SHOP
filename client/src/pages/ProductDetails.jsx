import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import WhatsAppButton from "../components/whatsapp/WhatsAppButton";
import { useProductsStore } from "../state/products.store";
import { useCartStore } from "../state/cart.store";

export default function ProductDetails() {
  const { id } = useParams();

  const products = useProductsStore((s) => s.products);
  const addToCart = useCartStore((s) => s.addToCart);

  const product = useMemo(
    () => (products || []).find((p) => p.id === id),
    [products, id]
  );

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ marginTop: 24 }}>
          <div className="card" style={{ padding: 16 }}>
            <h2 style={{ marginTop: 0 }}>Product not found</h2>
            <Link to="/" style={{ textDecoration: "underline" }}>
              ← Back to shop
            </Link>
          </div>
        </div>
      </>
    );
  }

  const stock = Number(product.stock ?? 0);

  return (
    <>
      <Navbar />

      <div className="container" style={{ marginTop: 18 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 16,
            alignItems: "start",
          }}
        >
          <div className="card" style={{ overflow: "hidden" }}>
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "100%",
                height: 460,
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>

          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <h2 style={{ margin: 0 }}>{product.name}</h2>
                <div style={{ marginTop: 6, color: "var(--muted)" }}>
                  Category: <strong style={{ color: "#111" }}>{product.category}</strong>
                </div>
                <div style={{ marginTop: 6, color: "var(--muted)" }}>
                  Available: <strong style={{ color: "#111" }}>{stock}</strong>
                </div>
              </div>

              <div style={{ fontWeight: 900, fontSize: 20 }}>KSh {product.price}</div>
            </div>

            <p style={{ marginTop: 12, color: "var(--muted)", lineHeight: 1.55 }}>
              {product.description || "No description yet."}
            </p>

            <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
              <button
                className="btn btn-dark"
                onClick={() => addToCart(product)}
                disabled={stock <= 0}
                style={{ opacity: stock <= 0 ? 0.5 : 1 }}
              >
                {stock <= 0 ? "Out of Stock" : "Add to Cart"}
              </button>

              <Link to="/cart">
                <button className="btn btn-ghost" style={{ width: "100%" }}>
                  Go to Cart
                </button>
              </Link>

              <Link to="/" style={{ textDecoration: "underline", fontSize: 13, color: "var(--muted)" }}>
                ← Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      <WhatsAppButton />
    </>
  );
}