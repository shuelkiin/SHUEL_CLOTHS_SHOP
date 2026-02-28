import { Link } from "react-router-dom";
import { useProductsStore } from "../../state/products.store";

export default function AdminProducts() {
  const products = useProductsStore((s) => s.products);
  const deleteProduct = useProductsStore((s) => s.deleteProduct);
  const restockProduct = useProductsStore((s) => s.restockProduct);

  function onDelete(p) {
    const ok = window.confirm(`Delete "${p.name}"?`);
    if (!ok) return;
    deleteProduct(p.id);
  }

  return (
    <div className="card" style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "center",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Products</h2>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>
            Total: {products.length}
          </div>
        </div>

        <Link to="/admin/products/new">
          <button className="btn btn-dark">+ Add Product</button>
        </Link>
      </div>

      <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
        {products.map((p) => {
          const stock = Number(p.stock ?? 0);
          const low = stock <= 2;

          return (
            <div
              key={p.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                padding: 12,
                border: "1px solid var(--border)",
                borderRadius: 12,
                background: "#fff",
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <img
                  src={p.image}
                  alt={p.name}
                  style={{
                    width: 64,
                    height: 64,
                    objectFit: "cover",
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                  }}
                />

                <div>
                  <div style={{ fontWeight: 900 }}>{p.name}</div>
                  <div style={{ color: "var(--muted)", fontSize: 13 }}>
                    {p.category} • KSh {p.price} • Stock:{" "}
                    <strong style={{ color: low ? "#b91c1c" : "#111" }}>
                      {stock}
                    </strong>
                    {low ? (
                      <span style={{ marginLeft: 8, color: "#b91c1c" }}>
                        (low)
                      </span>
                    ) : null}
                  </div>
                  <div
                    style={{
                      color: "var(--muted)",
                      fontSize: 12,
                      marginTop: 2,
                    }}
                  >
                    #{p.id}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  className="btn btn-ghost"
                  onClick={() => restockProduct(p.id, 5)}
                  title="Add 5 stock"
                >
                  +5
                </button>

                <button
                  className="btn btn-ghost"
                  onClick={() => restockProduct(p.id, 10)}
                  title="Add 10 stock"
                >
                  +10
                </button>

                <Link to={`/admin/products/${p.id}/edit`}>
                  <button className="btn btn-ghost">Edit</button>
                </Link>

                <button
                  className="btn btn-ghost"
                  onClick={() => onDelete(p)}
                  style={{ borderColor: "#fecaca", color: "#b91c1c" }}
                  title="Delete product"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}