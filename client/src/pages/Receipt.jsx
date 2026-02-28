import { Link, useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { useOrdersStore } from "../state/orders.store";

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

export default function Receipt() {
  const { id } = useParams();
  const getOrderById = useOrdersStore((s) => s.getOrderById);

  const order = getOrderById(id);

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ marginTop: 24 }}>
          <div className="card" style={{ padding: 16 }}>
            <h2 style={{ marginTop: 0 }}>Receipt not found</h2>
            <p style={{ color: "var(--muted)" }}>
              This receipt may have been cleared from local storage.
            </p>
            <Link to="/" style={{ textDecoration: "underline" }}>
              ← Back to shop
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container" style={{ marginTop: 24 }}>
        <div className="card" style={{ padding: 18, maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}>
            <div>
              <h2 style={{ marginTop: 0, marginBottom: 6 }}>Payment Successful ✅</h2>
              <div style={{ color: "var(--muted)", fontSize: 13 }}>
                Order ID: <strong style={{ color: "#111" }}>{order.id}</strong>
              </div>
              <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
                Date: <strong style={{ color: "#111" }}>{formatDate(order.createdAt)}</strong>
              </div>
              <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
                Phone: <strong style={{ color: "#111" }}>{order.phone || "-"}</strong>
              </div>
            </div>

            <div
              style={{
                background: "#f6f7f9",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 12,
                minWidth: 200,
              }}
            >
              <div style={{ color: "var(--muted)", fontSize: 13 }}>Total Paid</div>
              <div style={{ fontSize: 22, fontWeight: 900, marginTop: 4 }}>
                KSh {order.total}
              </div>
              <div style={{ marginTop: 6, fontSize: 12, color: "var(--muted)" }}>
                Status: <strong style={{ color: "#111" }}>{order.status}</strong>
              </div>
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "16px 0" }} />

          <h3 style={{ margin: "0 0 10px" }}>Items</h3>

          <div style={{ display: "grid", gap: 10 }}>
            {order.items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: 12,
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  background: "#fff",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: 64,
                      height: 64,
                      objectFit: "cover",
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 900 }}>{item.name}</div>
                    <div style={{ color: "var(--muted)", fontSize: 13 }}>
                      KSh {item.price} • Qty: <strong style={{ color: "#111" }}>{item.qty}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ fontWeight: 900 }}>
                  KSh {Number(item.price) * Number(item.qty)}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <Link to="/" style={{ textDecoration: "underline" }}>
              ← Continue shopping
            </Link>

            <button
              className="btn btn-ghost"
              onClick={() => window.print()}
              title="Print / Save as PDF"
            >
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </>
  );
}