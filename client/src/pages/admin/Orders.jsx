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

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
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

export default function Orders() {
  const orders = useOrdersStore((s) => s.orders) || [];

  const [range, setRange] = useState("all"); // all | today | 7d | 30d
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    let cutoff = null;
    if (range === "today") cutoff = startOfToday();
    if (range === "7d") cutoff = daysAgo(7);
    if (range === "30d") cutoff = daysAgo(30);

    return orders.filter((o) => {
      // date filter
      if (cutoff) {
        const created = new Date(o.createdAt);
        if (Number.isFinite(created.getTime()) && created < cutoff) return false;
      }

      if (!query) return true;

      const hay = [
        o.id,
        o.customerEmail,
        o.customerName,
        o.phone,
        o.status,
        String(o.total),
        ...(o.items || []).map((it) => it.name),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return hay.includes(query);
    });
  }, [orders, range, q]);

  const summary = useMemo(() => {
    const totalRevenue = filtered.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const totalOrders = filtered.length;

    const customers = new Set(
      filtered.map((o) => (o.customerEmail ? `email:${o.customerEmail}` : `phone:${o.phone}`))
    );

    const itemsSold = filtered.reduce((sum, o) => {
      const count = (o.items || []).reduce((s, it) => s + (Number(it.qty) || 0), 0);
      return sum + count;
    }, 0);

    return {
      totalRevenue,
      totalOrders,
      totalCustomers: customers.size,
      itemsSold,
    };
  }, [filtered]);

  function exportCSV() {
    const header = [
      "OrderID",
      "Date",
      "CustomerEmail",
      "CustomerName",
      "Phone",
      "Total",
      "Status",
      "ItemsCount",
      "Items",
    ];

    const rows = filtered.map((o) => {
      const itemsText = (o.items || [])
        .map((it) => `${it.name} x${it.qty}`)
        .join(" | ");

      const itemsCount = (o.items || []).reduce((s, it) => s + (Number(it.qty) || 0), 0);

      return [
        o.id,
        o.createdAt,
        o.customerEmail || "",
        o.customerName || "",
        o.phone || "",
        Number(o.total) || 0,
        o.status || "",
        itemsCount,
        itemsText,
      ];
    });

    const csv = toCSV([header, ...rows]);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_${range}_${new Date().toISOString().slice(0, 10)}.csv`;
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
          <h2 style={{ margin: 0 }}>Orders</h2>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>
            Filter, search, open receipts, export CSV
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button className="btn btn-ghost" onClick={exportCSV} disabled={filtered.length === 0}>
            Export CSV
          </button>
          <Link to="/admin/products/new">
            <button className="btn btn-dark">+ Add Product</button>
          </Link>
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          marginTop: 14,
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            className={`pill ${range === "all" ? "active" : ""}`}
            onClick={() => setRange("all")}
            type="button"
          >
            All
          </button>
          <button
            className={`pill ${range === "today" ? "active" : ""}`}
            onClick={() => setRange("today")}
            type="button"
          >
            Today
          </button>
          <button
            className={`pill ${range === "7d" ? "active" : ""}`}
            onClick={() => setRange("7d")}
            type="button"
          >
            Last 7 days
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
            placeholder="Search by receipt id, email, phone, item name..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {/* Summary */}
      <div
        style={{
          marginTop: 14,
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 12,
        }}
      >
        <MiniKpi title="Revenue" value={`KSh ${summary.totalRevenue}`} />
        <MiniKpi title="Orders" value={summary.totalOrders} />
        <MiniKpi title="Customers" value={summary.totalCustomers} />
        <MiniKpi title="Items Sold" value={summary.itemsSold} />
      </div>

      {/* List */}
      <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ color: "var(--muted)" }}>No orders match your filter/search.</div>
        ) : (
          filtered.map((o) => {
            const itemsCount = (o.items || []).reduce((s, it) => s + (Number(it.qty) || 0), 0);
            const customer = o.customerEmail || o.phone || "unknown customer";

            return (
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
                  <div style={{ fontWeight: 900 }}>
                    Receipt #{o.id}{" "}
                    <span style={{ fontWeight: 700, color: "var(--muted)", fontSize: 13 }}>
                      • {formatDate(o.createdAt)}
                    </span>
                  </div>

                  <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
                    Customer: <strong style={{ color: "#111" }}>{customer}</strong>
                    {o.customerName ? (
                      <>
                        {" "}
                        • Name: <strong style={{ color: "#111" }}>{o.customerName}</strong>
                      </>
                    ) : null}
                    {" "}
                    • Items: <strong style={{ color: "#111" }}>{itemsCount}</strong>
                    {" "}
                    • Status:{" "}
                    <strong style={{ color: "#111" }}>{o.status || "PAID"}</strong>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontWeight: 900 }}>KSh {o.total}</div>
                  <Link to={`/receipt/${o.id}`} style={{ textDecoration: "underline" }}>
                    Open
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Note */}
      <div style={{ marginTop: 14, color: "var(--muted)", fontSize: 12, lineHeight: 1.55 }}>
        {/*Tip: This page is based on your saved receipts (localStorage). When we add the backend + M-Pesa Daraja callback,
        these become real database orders.*/}
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