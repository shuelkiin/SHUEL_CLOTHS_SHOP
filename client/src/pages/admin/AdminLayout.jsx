import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../state/auth.store";
import { useProductsStore } from "../../state/products.store";
import { bootstrapAdminSecret } from "../../state/admin.bootstrap";

export default function AdminLayout() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const fetchProducts = useProductsStore((s) => s.fetchProducts);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    bootstrapAdminSecret();
    fetchProducts().catch(() => {});
  }, [fetchProducts]);

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="adminShell">
      {/* Mobile topbar */}
      <div className="adminTopbar">
        <button className="btn btn-ghost" onClick={() => setOpen(true)}>
          ☰
        </button>
        <div style={{ fontWeight: 900 }}>Admin Panel</div>
        <button className="btn btn-dark" onClick={onLogout}>
          Logout
        </button>
      </div>

      {/* Overlay */}
      <div
        className={`adminOverlay ${open ? "show" : ""}`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`adminSidebar2 ${open ? "open" : ""}`}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontWeight: 900, fontSize: 18 }}>Admin</div>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>
            Business control center
          </div>
        </div>

        <div className="adminNav" style={{ marginTop: 10 }}>
          <NavLink className="adminNavLink2" to="/admin/dashboard" onClick={() => setOpen(false)}>
            Dashboard
          </NavLink>
          <NavLink className="adminNavLink2" to="/admin/products" onClick={() => setOpen(false)}>
            Products
          </NavLink>
          <NavLink className="adminNavLink2" to="/admin/new-product" onClick={() => setOpen(false)}>
            Add Product
          </NavLink>
          <NavLink className="adminNavLink2" to="/admin/categories" onClick={() => setOpen(false)}>
            Categories
          </NavLink>
          <NavLink className="adminNavLink2" to="/admin/clients" onClick={() => setOpen(false)}>
            Clients
          </NavLink>
          <NavLink className="adminNavLink2" to="/admin/orders" onClick={() => setOpen(false)}>
            Orders
          </NavLink>
        </div>

        <div style={{ marginTop: "auto" }}>
          <button className="btn btn-dark" style={{ width: "100%" }} onClick={onLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="adminMain2">
        <Outlet />
      </main>
    </div>
  );
}
