import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { useOrdersStore } from "../state/orders.store";
import { useAuthStore } from "../state/auth.store";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

export default function MyOrders() {
  const user = useAuthStore((s) => s.user);
  const orders = useOrdersStore((s) => s.orders) || [];

  const [range, setRange] = useState("all"); // all | 30d
  const [q, setQ] = useState("");

  const myOrders = useMemo(() => {
    const email = String(user?.email || "").trim().toLowerCase();
    if (!email) return [];

    let cutoff = null;
    if (range === "30d") cutoff = daysAgo(30);

    const query = q.trim().toLowerCase();

    return orders
      .filter((o) => {
        const oe = String(o.customerEmail || "").trim().toLowerCase();
        if (!oe || oe !== email) return false;

        if (cutoff) {
          const created = new Date(o.createdAt);
          if (Number.isFinite(created.getTime()) && created < cutoff) return false;
        }

        if (!query) return true;

        const hay = [
          o.id,
          o.status,
          String(o.total),
          ...(o.items || []).map((it) => it.name),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return hay.includes(query);
      })
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  }, [orders, user?.email, range, q]);

  const totalSpent = useMemo(
    () => myOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0),
    [myOrders]
  );

  return (
    <>
      <Navbar />

      <div className="container" style={{ marginTop: 24 }}>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <h2 style={{ margin: 0 }}>My Orders</h2>
              <div style={{ color: "var(--muted)", fontSize: 13 }}>
                Your receipts and purchase history
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ color: "var(--muted)", fontSize: 13 }}>Total spent</div>
              <div style={{ fontSize: 20, fontWeight: 900 }}>KSh {totalSpent}</div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ marginTop: 14, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                className={`pill ${range === "all" ? "active" : ""}`}
                onClick={() => setRange("all")}
                type="button"
              >
                All
              </button>
              <button
                className={`pill ${range === "30d" ? "active" : ""}`}
                onClick={() => setRange("30d")}
                type="button"
              >
                Last 30 days
              </button>
            </div>

            <div style={{ flex: 1, minWidth: 220 }}>
              <input
                className="input"
                placeholder="Search by receipt id, item name..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>

            <Link to="/" style={{ textDecoration: "underline" }}>
              Continue shopping →
            </Link>
          </div>

          {/* Orders list */}
          <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
            {myOrders.length === 0 ? (
              <div style={{ color: "var(--muted)" }}>
                No orders found yet. Buy something and your receipts will show here.
              </div>
            ) : (
              myOrders.map((o) => {
                const itemsCount = (o.items || []).reduce((s, it) => s + (Number(it.qty) || 0), 0);

                return (
                  <details
                    key={o.id}
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: 14,
                      background: "#fff",
                      overflow: "hidden",
                    }}
                  >
                    <summary
                      style={{
                        listStyle: "none",
                        cursor: "pointer",
                        padding: 12,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 900 }}>
                          Receipt #{o.id}
                          <span style={{ color: "var(--muted)", fontWeight: 700, marginLeft: 8, fontSize: 13 }}>
                            • {formatDate(o.createdAt)}
                          </span>
                        </div>

                        <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
                          Items: <strong style={{ color: "#111" }}>{itemsCount}</strong>
                          {" • "}
                          Status: <strong style={{ color: "#111" }}>{o.status || "PAID"}</strong>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ fontWeight: 900 }}>KSh {o.total}</div>
                        <Link to={`/receipt/${o.id}`} style={{ textDecoration: "underline" }}>
                          Open
                        </Link>
                      </div>
                    </summary>

                    <div style={{ padding: 12, borderTop: "1px solid var(--border)" }}>
                      <div style={{ fontWeight: 900, marginBottom: 10 }}>Items</div>

                      <div style={{ display: "grid", gap: 10 }}>
                        {(o.items || []).map((it) => (
                          <div
                            key={`${o.id}-${it.id}`}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: 12,
                              padding: 12,
                              border: "1px solid var(--border)",
                              borderRadius: 12,
                              background: "#fff",
                              flexWrap: "wrap",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <img
                                src={it.image}
                                alt={it.name}
                                style={{
                                  width: 54,
                                  height: 54,
                                  objectFit: "cover",
                                  borderRadius: 12,
                                  border: "1px solid var(--border)",
                                }}
                              />
                              <div>
                                <div style={{ fontWeight: 900 }}>{it.name}</div>
                                <div style={{ color: "var(--muted)", fontSize: 13 }}>
                                  KSh {it.price} • Qty: <strong style={{ color: "#111" }}>{it.qty}</strong>
                                </div>
                              </div>
                            </div>

                            <div style={{ fontWeight: 900 }}>
                              KSh {Number(it.price) * Number(it.qty)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </details>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}