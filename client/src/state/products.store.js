import { create } from "zustand";

export const useProductsStore = create((set, get) => ({
  products: [],
  categories: ["All"],
  searchQuery: "",
  activeCategory: "All",
  adminSecret: "",

  setSearchQuery: (q) => set({ searchQuery: q }),
  setActiveCategory: (c) => set({ activeCategory: c || "All" }),
  setAdminSecret: (s) => set({ adminSecret: s || "" }),

  fetchProducts: async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Failed to load");

    const cats = Array.from(
      new Set((data || []).map((p) => p.category).filter(Boolean))
    );

    set({
      products: data || [],
      categories: ["All", ...cats],
    });
  },

  addProduct: async (product) => {
    const secret = get().adminSecret;

    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": secret,
      },
      body: JSON.stringify(product),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Failed to add");

    await get().fetchProducts();
    return data;
  },

  updateProduct: async (id, patch) => {
    const secret = get().adminSecret;

    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": secret,
      },
      body: JSON.stringify(patch),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Failed to update");

    await get().fetchProducts();
    return data;
  },

  deleteProduct: async (id) => {
    const secret = get().adminSecret;

    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
      headers: {
        "x-admin-secret": secret,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Failed to delete");

    await get().fetchProducts();
    return data;
  },
}));
