import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  items: [],

  addToCart: (product) => {
    const items = get().items;
    const existing = items.find((i) => i.id === product.id);
    const stock = Number(product.stock ?? 0);

    if (stock <= 0) return;

    if (existing) {
      if (existing.qty >= stock) return;
      set({
        items: items.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        ),
      });
    } else {
      set({ items: [...items, { ...product, qty: 1 }] });
    }
  },

  increaseQty: (id) =>
    set({
      items: get().items.map((i) => {
        if (i.id !== id) return i;
        const stock = Number(i.stock ?? 0);
        if (i.qty >= stock) return i;
        return { ...i, qty: i.qty + 1 };
      }),
    }),

  decreaseQty: (id) =>
    set({
      items: get().items
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0),
    }),

  removeFromCart: (id) =>
    set({ items: get().items.filter((i) => i.id !== id) }),

  clearCart: () => set({ items: [] }),

  totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),

  totalPrice: () => get().items.reduce((sum, i) => sum + i.qty * i.price, 0),
}));