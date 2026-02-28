import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { useAuthStore } from "../../state/auth.store";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    setMsg("");

    const res = login({ email, password });
    if (!res.ok) {
      setMsg(res.message);
      return;
    }

    // redirect based on role
    const isAdmin = (email || "").trim().toLowerCase() === "shuelkiin@gmail.com";
    navigate(isAdmin ? "/admin/dashboard" : "/", { replace: true });
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ marginTop: 24 }}>
        <div className="card" style={{ maxWidth: 420, margin: "0 auto", padding: 18 }}>
          <h2 style={{ marginTop: 0 }}>Login</h2>

          {msg ? (
            <div
              style={{
                marginBottom: 12,
                padding: 10,
                borderRadius: 12,
                border: "1px solid var(--border)",
                background: "#fff",
                color: "#b91c1c",
                fontWeight: 700,
              }}
            >
              {msg}
            </div>
          ) : null}

          <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 14 }}>Email</span>
              <input
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                autoComplete="email"
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 14 }}>Password</span>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </label>

            <button className="btn btn-dark" style={{ width: "100%" }}>
              Login
            </button>
          </form>

          <div style={{ marginTop: 12, color: "var(--muted)", fontSize: 13 }}>
            Don’t have an account?{" "}
            <Link to="/register" style={{ textDecoration: "underline" }}>
              Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}