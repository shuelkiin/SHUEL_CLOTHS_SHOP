import { Link } from "react-router-dom";
import { useOrdersStore } from "../../state/orders.store";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function Dashboard() {
  const getStats = useOrdersStore((s) => s.getStats);
  const getRecentOrders = useOrdersStore((s) => s.getRecentOrders);

  const stats = getStats();
  const recent = getRecentOrders(8);

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: 0 }}>Dashboard</h2>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>
            Business overview (sales, customers, receipts)
          </div>
        </div>

        <Link to="/admin/products/new">
          <button className="btn btn-dark">+ Add Product</button>
        </Link>
      </div>

      {/* KPIs */}
      <div className="kpiGrid" style={{ marginTop: 14 }}>
        <Kpi title="Total Revenue" value={`KSh ${stats.totalRevenue}`} />
        <Kpi title="Orders" value={stats.totalOrders} />
        <Kpi title="Customers" value={stats.totalCustomers} />
        <Kpi title="Avg Order" value={`KSh ${stats.avgOrderValue}`} />
      </div>

      {/* Top product */}
      <div className="card" style={{ marginTop: 12, padding: 14, boxShadow: "none" }}>
        <div style={{ fontWeight: 900, marginBottom: 10 }}>Top Selling Item</div>

        {!stats.topItem ? (
          <div style={{ color: "var(--muted)" }}>
            No sales yet. Make a test purchase to see stats.
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img
                src={stats.topItem.image}
                alt={stats.topItem.name}
                style={{
                  width: 64,
                  height: 64,
                  objectFit: "cover",
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                }}
              />
              <div>
                <div style={{ fontWeight: 900 }}>{stats.topItem.name}</div>
                <div style={{ color: "var(--muted)", fontSize: 13 }}>
                  Sold: <strong style={{ color: "#111" }}>{stats.topItem.qty}</strong>
                  {" • "}
                  Revenue:{" "}
                  <strong style={{ color: "#111" }}>
                    KSh {Math.round(stats.topItem.revenue)}
                  </strong>
                </div>
              </div>
            </div>

            <div style={{ color: "var(--muted)", fontSize: 12 }}>
              (based on all receipts)
            </div>
          </div>
        )}
      </div>

      {/* Recent receipts */}
      <div style={{ marginTop: 14 }}>
        <div style={{ fontWeight: 900, marginBottom: 10 }}>Recent Receipts</div>

        {recent.length === 0 ? (
          <div style={{ color: "var(--muted)" }}>No receipts yet.</div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {recent.map((o) => (
              <div
                key={o.id}
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
                <div>
                  <div style={{ fontWeight: 900 }}>Receipt #{o.id}</div>
                  <div style={{ color: "var(--muted)", fontSize: 13 }}>
                    {formatDate(o.createdAt)} • {o.customerEmail || o.phone || "unknown customer"}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontWeight: 900 }}>KSh {o.total}</div>
                  <Link to={`/receipt/${o.id}`} style={{ textDecoration: "underline" }}>
                    Open
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Kpi({ title, value }) {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: 12,
        background: "#fff",
      }}
    >
      <div style={{ color: "var(--muted)", fontSize: 13 }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 900, marginTop: 4 }}>{value}</div>
    </div>
  );
}