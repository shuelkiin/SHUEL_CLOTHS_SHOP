import { Link } from "react-router-dom";
import { useCartStore } from "../../state/cart.store";

export default function ProductCard({ product }) {
  const addToCart = useCartStore((s) => s.addToCart);
  const stock = Number(product.stock ?? 0);

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <Link to={`/product/${product.id}`}>
        <div style={{ position: "relative" }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "100%",
              height: 230,
              objectFit: "cover",
              display: "block",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 12,
              bottom: 12,
              background: "rgba(17,17,17,.86)",
              color: "#fff",
              padding: "6px 10px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {product.category}
          </div>
        </div>
      </Link>

      <div style={{ padding: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
          <h4 style={{ margin: 0, fontSize: 16 }}>{product.name}</h4>
          <div style={{ fontWeight: 800 }}>KSh {product.price}</div>
        </div>

        {product.description ? (
          <p
            style={{
              margin: "8px 0 0",
              color: "var(--muted)",
              fontSize: 13,
              lineHeight: 1.4,
            }}
          >
            {product.description}
          </p>
        ) : null}

        <div style={{ marginTop: 8, color: "var(--muted)", fontSize: 13 }}>
          Available:{" "}
          <strong style={{ color: "#111" }}>{stock}</strong>
        </div>

        <button
          className="btn btn-dark"
          onClick={() => addToCart(product)}
          disabled={stock <= 0}
          style={{
            width: "100%",
            marginTop: 12,
            opacity: stock <= 0 ? 0.5 : 1,
          }}
        >
          {stock <= 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}