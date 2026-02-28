import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../../state/cart.store";
import { useAuthStore } from "../../state/auth.store";

export default function Navbar() {
  const navigate = useNavigate();

  const totalItems = useCartStore((s) => s.totalItems());
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(246,247,251,0.85)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          paddingTop: 12,
          paddingBottom: 12,
        }}
      >
        <Link to="/" style={{ fontWeight: 900, fontSize: 18 }}>
          Shuel Cloths Shop
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <Link to="/" className="pill">
            Shop
          </Link>

          {user ? (
            <Link to="/my-orders" className="pill">
              My Orders
            </Link>
          ) : null}

          <Link to="/cart" style={{ position: "relative" }} className="pill">
            🛍️
            {totalItems > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  background: "#111",
                  color: "#fff",
                  borderRadius: 999,
                  fontSize: 12,
                  padding: "2px 7px",
                  fontWeight: 900,
                }}
              >
                {totalItems}
              </span>
            )}
          </Link>

          {!user ? (
            <>
              <Link to="/login" className="pill">
                Login
              </Link>
              <Link to="/register" className="pill">
                Register
              </Link>
            </>
          ) : (
            <>
              <span style={{ color: "var(--muted)", fontSize: 13 }}>
                {user.email}
              </span>

              <button className="btn btn-ghost" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}