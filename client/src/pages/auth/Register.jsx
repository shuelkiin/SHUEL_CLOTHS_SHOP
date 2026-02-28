import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { useAuthStore } from "../../state/auth.store";

export default function Register() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    setMsg("");

    if (password !== confirm) {
      setMsg("Passwords do not match.");
      return;
    }

    const res = register({ email, password });
    if (!res.ok) {
      setMsg(res.message);
      return;
    }

    navigate("/", { replace: true });
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ marginTop: 24 }}>
        <div className="card" style={{ maxWidth: 420, margin: "0 auto", padding: 18 }}>
          <h2 style={{ marginTop: 0 }}>Create account</h2>

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
                placeholder="min 6 characters"
                autoComplete="new-password"
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 14 }}>Confirm password</span>
              <input
                className="input"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="repeat password"
                autoComplete="new-password"
              />
            </label>

            <button className="btn btn-dark" style={{ width: "100%" }}>
              Register
            </button>
          </form>

          <div style={{ marginTop: 12, color: "var(--muted)", fontSize: 13 }}>
            Already have an account?{" "}
            <Link to="/login" style={{ textDecoration: "underline" }}>
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}