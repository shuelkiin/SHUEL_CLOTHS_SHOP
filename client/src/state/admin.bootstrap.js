import { useProductsStore } from "./products.store";

export function bootstrapAdminSecret() {
  const secret = import.meta.env.VITE_ADMIN_SECRET || "";
  if (secret) {
    useProductsStore.getState().setAdminSecret(secret);
  }
}
