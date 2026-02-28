import { create } from "zustand";
import { nanoid } from "nanoid";

const LS_KEY = "clothshop_orders_v1";

function load() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : { orders: [] };
  } catch {
    return { orders: [] };
  }
}

function save(orders) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ orders }));
  } catch {
    // ignore
  }
}

export const useOrdersStore = create((set, get) => ({
  ...load(),

  createOrder: ({ phone, customerEmail, customerName, items, total }) => {
    const order = {
      id: nanoid(10),
      createdAt: new Date().toISOString(),
      phone: String(phone || "").trim(),
      customerEmail: String(customerEmail || "").trim(),
      customerName: String(customerName || "").trim(),
      items: (items || []).map((i) => ({
        id: i.id,
        name: i.name,
        price: Number(i.price) || 0,
        qty: Number(i.qty) || 0,
        image: i.image,
        category: i.category,
      })),
      total: Number(total) || 0,
      status: "PAID", // mocked for now; later Daraja callback
    };

    const orders = [order, ...(get().orders || [])];
    set({ orders });
    save(orders);
    return order.id;
  },

  getOrderById: (id) => (get().orders || []).find((o) => o.id === id) || null,

  // ---------- Analytics (business dashboard) ----------
  getStats: () => {
    const orders = get().orders || [];

    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const totalOrders = orders.length;

    // Unique customers by email if available, else by phone
    const customersSet = new Set(
      orders.map((o) => (o.customerEmail ? `email:${o.customerEmail}` : `phone:${o.phone}`))
    );
    const totalCustomers = customersSet.size;

    const avgOrderValue = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;

    // Top-selling item by qty + compute revenue for that item
    const itemAgg = new Map(); // id -> { id, name, qty, revenue, image }
    for (const o of orders) {
      for (const it of o.items || []) {
        const key = it.id;
        const prev = itemAgg.get(key) || {
          id: it.id,
          name: it.name,
          qty: 0,
          revenue: 0,
          image: it.image,
        };
        prev.qty += Number(it.qty) || 0;
        prev.revenue += (Number(it.price) || 0) * (Number(it.qty) || 0);
        itemAgg.set(key, prev);
      }
    }

    let topItem = null;
    for (const v of itemAgg.values()) {
      if (!topItem) topItem = v;
      else if (v.qty > topItem.qty) topItem = v;
      else if (v.qty === topItem.qty && v.revenue > topItem.revenue) topItem = v;
    }

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      avgOrderValue,
      topItem, // null if none
    };
  },

  getRecentOrders: (limit = 8) => {
    return (get().orders || []).slice(0, limit);
  },
}));