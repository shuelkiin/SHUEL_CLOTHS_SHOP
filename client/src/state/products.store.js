import { create } from "zustand";

/**
 * We try multiple keys because your project evolved and keys may have changed.
 * This prevents "products disappeared" after a refactor.
 */
const PRIMARY_PRODUCTS_KEY = "clothshop_products_v1";
const PRIMARY_CATS_KEY = "clothshop_categories_v1";

// Possible old keys your app may have used before
const FALLBACK_PRODUCTS_KEYS = [
  "clothshop_products",
  "products",
  "shop_products",
  "cloth-shop-products",
  "clothshopProducts",
];

const FALLBACK_CATS_KEYS = [
  "clothshop_categories",
  "categories",
  "shop_categories",
  "cloth-shop-categories",
  "clothshopCategories",
];

function safeJSONParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function isProductArray(arr) {
  if (!Array.isArray(arr)) return false;
  // Minimal check: objects with name + price or id
  return arr.every((x) => x && typeof x === "object" && ("name" in x || "id" in x));
}

function loadFromKeys(keys) {
  for (const k of keys) {
    const raw = localStorage.getItem(k);
    if (!raw) continue;
    const val = safeJSONParse(raw);
    if (val != null) return { key: k, value: val };
  }
  return { key: null, value: null };
}

/**
 * Last-resort: scan localStorage for any array that looks like products.
 * This is safe because we only accept arrays that look like product objects.
 */
function scanLocalStorageForProducts() {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;

      // only look at keys that smell like product data
      const low = k.toLowerCase();
      if (!low.includes("product")) continue;

      const raw = localStorage.getItem(k);
      if (!raw) continue;

      const val = safeJSONParse(raw);
      if (isProductArray(val)) return { key: k, value: val };
    }
  } catch {
    // ignore
  }
  return { key: null, value: null };
}

function loadProductsWithMigration() {
  // 1) primary
  const primary = loadFromKeys([PRIMARY_PRODUCTS_KEY]);
  if (isProductArray(primary.value)) return primary.value;

  // 2) fallbacks
  const fb = loadFromKeys(FALLBACK_PRODUCTS_KEYS);
  if (isProductArray(fb.value)) return fb.value;

  // 3) scan
  const scan = scanLocalStorageForProducts();
  if (isProductArray(scan.value)) return scan.value;

  return [];
}

function loadCategoriesWithMigration() {
  const primary = loadFromKeys([PRIMARY_CATS_KEY]);
  if (Array.isArray(primary.value)) return ensureAll(primary.value);

  const fb = loadFromKeys(FALLBACK_CATS_KEYS);
  if (Array.isArray(fb.value)) return ensureAll(fb.value);

  // derive categories from products if not found
  const products = loadProductsWithMigration();
  const derived = Array.from(new Set((products || []).map((p) => p.category).filter(Boolean)));
  return ensureAll(derived);
}

function ensureAll(list) {
  const arr = Array.isArray(list) ? list.filter(Boolean) : [];
  return arr.includes("All") ? arr : ["All", ...arr];
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export const useProductsStore = create((set, get) => {
  const initialProducts = loadProductsWithMigration();
  const initialCategories = loadCategoriesWithMigration();

  return {
    products: initialProducts,
    categories: initialCategories,

    searchQuery: "",
    activeCategory: "All",

    setSearchQuery: (q) => set({ searchQuery: q }),
    setActiveCategory: (cat) => set({ activeCategory: cat || "All" }),

    addCategory: (name) => {
      const clean = String(name || "").trim();
      if (!clean || clean === "All") return;

      const current = ensureAll(get().categories);
      if (current.includes(clean)) return;

      const next = [...current, clean];
      set({ categories: next });
      save(PRIMARY_CATS_KEY, next);
    },

    deleteCategory: (name) => {
      const clean = String(name || "").trim();
      if (!clean || clean === "All") return;

      const current = ensureAll(get().categories);
      const next = current.filter((c) => c !== clean);

      set({ categories: next });
      save(PRIMARY_CATS_KEY, next);

      if (get().activeCategory === clean) set({ activeCategory: "All" });
    },

    addProduct: (product) => {
      const p = {
        id: `p_${Math.random().toString(16).slice(2)}`,
        name: product.name,
        description: product.description,
        price: Number(product.price) || 0,
        image: product.image,
        category: product.category || "Uncategorized",
        stock: Number(product.stock ?? 0),
        createdAt: new Date().toISOString(),
      };

      const nextProducts = [p, ...(get().products || [])];
      set({ products: nextProducts });
      save(PRIMARY_PRODUCTS_KEY, nextProducts);

      get().addCategory(p.category);
    },

    updateProduct: (id, patch) => {
      const next = (get().products || []).map((p) =>
        p.id === id ? { ...p, ...patch } : p
      );
      set({ products: next });
      save(PRIMARY_PRODUCTS_KEY, next);

      if (patch?.category) get().addCategory(patch.category);
    },

    deleteProduct: (id) => {
      const next = (get().products || []).filter((p) => p.id !== id);
      set({ products: next });
      save(PRIMARY_PRODUCTS_KEY, next);
    },

    decrementStockFromCart: (cartItems) => {
      const next = (get().products || []).map((p) => {
        const item = (cartItems || []).find((i) => i.id === p.id);
        if (!item) return p;

        const current = Number(p.stock ?? 0);
        const qty = Number(item.qty ?? 0);
        return { ...p, stock: Math.max(0, current - qty) };
      });

      set({ products: next });
      save(PRIMARY_PRODUCTS_KEY, next);
    },
  };
});