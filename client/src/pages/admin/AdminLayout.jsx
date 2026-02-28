import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../state/auth.store";

export default function AdminLayout() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div className="adminShell">
      {/* Topbar (mobile) */}
      <header className="adminTopbar">
        <button className="btn btn-ghost" onClick={() => setOpen(true)}>
          ☰
        </button>

        <div style={{ fontWeight: 900 }}>Admin Panel</div>

        <button className="btn btn-dark" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Overlay (mobile when sidebar open) */}
      <div
        className={`adminOverlay ${open ? "show" : ""}`}
        onClick={closeMenu}
      />

      {/* Sidebar */}
      <aside className={`adminSidebar2 ${open ? "open" : ""}`}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18 }}>Admin</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{user?.email}</div>
          </div>

          <button className="btn btn-ghost" onClick={closeMenu}>
            ✕
          </button>
        </div>

        <div style={{ height: 12 }} />

        <NavItem to="/admin/dashboard" label="Dashboard" onClick={closeMenu} />
        <NavItem to="/admin/products" label="Products" onClick={closeMenu} />
        <NavItem to="/admin/categories" label="Categories" onClick={closeMenu} />
        <NavItem to="/admin/orders" label="Orders" onClick={closeMenu} />
        <NavItem to="/admin/clients" label="Clients" onClick={closeMenu} />

        <div style={{ marginTop: "auto" }}>
          <button className="btn btn-dark" style={{ width: "100%" }} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="adminMain2">
        <Outlet />
      </main>
    </div>
  );
}

function NavItem({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `adminNavLink2 ${isActive ? "active" : ""}`}
    >
      {label}
    </NavLink>
  );
}