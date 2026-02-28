import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useOrdersStore } from "../../state/orders.store";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function toCSV(rows) {
  const escape = (v) => {
    const s = String(v ?? "");
    if (s.includes(",") || s.includes("\n") || s.includes('"')) {
      return `"${s.replaceAll('"', '""')}"`;
    }
    return s;
  };
  return rows.map((r) => r.map(escape).join(",")).join("\n");
}

export default function Clients() {
  const orders = useOrdersStore((s) => s.orders) || [];

  const [q, setQ] = useState("");

  const clients = useMemo(() => {
    const map = new Map();

    for (const o of orders) {
      const key = o.customerEmail
        ? `email:${o.customerEmail}`
        : `phone:${o.phone || "unknown"}`;

      const label = o.customerEmail || o.phone || "unknown";
      const name = o.customerName || "";

      const prev = map.get(key) || {
        key,
        label,
        name,
        email: o.customerEmail || "",
        phone: o.phone || "",
        ordersCount: 0,
        totalSpent: 0,
        itemsBought: 0,
        lastPurchaseAt: null,
        receipts: [],
      };

      prev.ordersCount += 1;
      prev.totalSpent += Number(o.total) || 0;

      const itemsCount = (o.items || []).reduce(
        (sum, it) => sum + (Number(it.qty) || 0),
        0
      );
      prev.itemsBought += itemsCount;

      const ts = new Date(o.createdAt).getTime();
      if (!prev.lastPurchaseAt || ts > prev.lastPurchaseAt.ts) {
        prev.lastPurchaseAt = { iso: o.createdAt, ts };
      }

      prev.receipts.push({
        id: o.id,
        createdAt: o.createdAt,
        total: Number(o.total) || 0,
        status: o.status || "PAID",
      });

      map.set(key, prev);
    }

    const arr = Array.from(map.values()).map((c) => ({
      ...c,
      receipts: c.receipts.sort((a, b) =>
        String(b.createdAt || "").localeCompare(String(a.createdAt || ""))
      ),
    }));

    arr.sort((a, b) => b.totalSpent - a.totalSpent);
    return arr;
  }, [orders]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return clients;

    return clients.filter((c) => {
      const hay = [
        c.label,
        c.name,
        c.email,
        c.phone,
        String(c.totalSpent),
        String(c.ordersCount),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return hay.includes(query);
    });
  }, [clients, q]);

  const summary = useMemo(() => {
    const totalClients = filtered.length;
    const totalRevenue = filtered.reduce(
      (sum, c) => sum + (Number(c.totalSpent) || 0),
      0
    );
    const totalOrders = filtered.reduce(
      (sum, c) => sum + (Number(c.ordersCount) || 0),
      0
    );
    const avgSpend = totalClients ? Math.round(totalRevenue / totalClients) : 0;

    return { totalClients, totalRevenue, totalOrders, avgSpend };
  }, [filtered]);

  function exportCSV() {
    const header = [
      "Client",
      "Name",
      "Email",
      "Phone",
      "OrdersCount",
      "ItemsBought",
      "TotalSpent",
      "LastPurchase",
    ];

    const rows = filtered.map((c) => [
      c.label,
      c.name,
      c.email,
      c.phone,
      c.ordersCount,
      c.itemsBought,
      Math.round(c.totalSpent),
      c.lastPurchaseAt?.iso || "",
    ]);

    const csv = toCSV([header, ...rows]);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `clients_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="card" style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Clients</h2>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>
            Customers, spend, purchases, and receipts
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button className="btn btn-ghost" onClick={exportCSV} disabled={filtered.length === 0}>
            Export CSV
          </button>
          <Link to="/admin/orders">
            <button className="btn btn-dark">View Orders</button>
          </Link>
        </div>
      </div>

      <div style={{ marginTop: 14, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <input
            className="input"
            placeholder="Search client by email/phone/name..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <div
        style={{
          marginTop: 14,
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 12,
        }}
      >
        <MiniKpi title="Clients" value={summary.totalClients} />
        <MiniKpi title="Revenue" value={`KSh ${summary.totalRevenue}`} />
        <MiniKpi title="Orders" value={summary.totalOrders} />
        <MiniKpi title="Avg Spend" value={`KSh ${summary.avgSpend}`} />
      </div>

      <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ color: "var(--muted)" }}>No clients yet.</div>
        ) : (
          filtered.map((c) => (
            <details
              key={c.key}
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
                    {c.label}
                    {c.name ? (
                      <span style={{ color: "var(--muted)", fontWeight: 700, marginLeft: 8 }}>
                        • {c.name}
                      </span>
                    ) : null}
                  </div>
                  <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
                    Orders: <strong style={{ color: "#111" }}>{c.ordersCount}</strong>
                    {" • "}
                    Items: <strong style={{ color: "#111" }}>{c.itemsBought}</strong>
                    {" • "}
                    Total: <strong style={{ color: "#111" }}>KSh {Math.round(c.totalSpent)}</strong>
                    {" • "}
                    Last:{" "}
                    <strong style={{ color: "#111" }}>
                      {c.lastPurchaseAt?.iso ? formatDate(c.lastPurchaseAt.iso) : "-"}
                    </strong>
                  </div>
                </div>

                <div style={{ color: "var(--muted)", fontSize: 12 }}>
                  Click to view receipts
                </div>
              </summary>

              <div style={{ padding: 12, borderTop: "1px solid var(--border)" }}>
                <div style={{ fontWeight: 900, marginBottom: 10 }}>Receipts</div>

                {c.receipts.length === 0 ? (
                  <div style={{ color: "var(--muted)" }}>No receipts</div>
                ) : (
                  <div style={{ display: "grid", gap: 10 }}>
                    {c.receipts.map((r) => (
                      <div
                        key={r.id}
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
                          <div style={{ fontWeight: 900 }}>#{r.id}</div>
                          <div style={{ color: "var(--muted)", fontSize: 13 }}>
                            {formatDate(r.createdAt)} • {r.status}
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ fontWeight: 900 }}>KSh {r.total}</div>
                          <Link to={`/receipt/${r.id}`} style={{ textDecoration: "underline" }}>
                            Open
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </details>
          ))
        )}
      </div>

      <div style={{ marginTop: 14, color: "var(--muted)", fontSize: 12, lineHeight: 1.55 }}>
        Tip: A “client” is identified by email if present, otherwise by phone number.
      </div>
    </div>
  );
}

function MiniKpi({ title, value }) {
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
      <div style={{ fontSize: 20, fontWeight: 900, marginTop: 4 }}>{value}</div>
    </div>
  );
}