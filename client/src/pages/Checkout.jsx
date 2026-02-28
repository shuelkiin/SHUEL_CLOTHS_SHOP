import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { useCartStore } from "../state/cart.store";
import { useProductsStore } from "../state/products.store";
import { useOrdersStore } from "../state/orders.store";
import { useAuthStore } from "../state/auth.store";

function normalizePhone(raw) {
  const s = String(raw || "").trim();

  // allow only digits + optional leading +
  const cleaned = s.replace(/[^\d+]/g, "");

  // Basic Kenya normalization examples:
  // 07xxxxxxxx -> 2547xxxxxxxx
  // 01xxxxxxxx -> 2541xxxxxxxx
  // +2547xxxxxxx -> 2547xxxxxxx
  // 2547xxxxxxx stays
  if (cleaned.startsWith("+254")) return cleaned.slice(1);
  if (cleaned.startsWith("254")) return cleaned;
  if (cleaned.startsWith("07") && cleaned.length === 10) return "254" + cleaned.slice(1);
  if (cleaned.startsWith("01") && cleaned.length === 10) return "254" + cleaned.slice(1);

  // fallback: return cleaned as user typed
  return cleaned;
}

function isPhoneValidKenya(p) {
  // minimal validation: 2547xxxxxxxx or 2541xxxxxxxx (12 digits)
  const s = String(p || "");
  return /^254[71]\d{8}$/.test(s);
}

export default function Checkout() {
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const totalPrice = useCartStore((s) => s.totalPrice);
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const decrementStockFromCart = useProductsStore((s) => s.decrementStockFromCart);
  const createOrder = useOrdersStore((s) => s.createOrder);

  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | waiting
  const [error, setError] = useState("");

  // ✅ Autofill phone from saved profile (once on load, and when user changes)
  useEffect(() => {
    const saved = String(user?.phone || "").trim();
    if (saved && !phone) setPhone(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.phone]);

  const normalizedPhone = useMemo(() => normalizePhone(phone), [phone]);
  const canPay = useMemo(() => {
    if (!items.length) return false;
    if (!normalizedPhone) return false;
    return isPhoneValidKenya(normalizedPhone);
  }, [items.length, normalizedPhone]);

  function handlePay(e) {
    e.preventDefault();
    setError("");

    if (!items.length) {
      setError("Your cart is empty.");
      return;
    }

    if (!normalizedPhone) {
      setError("Enter your M-Pesa phone number.");
      return;
    }

    if (!isPhoneValidKenya(normalizedPhone)) {
      setError("Enter a valid number (e.g. 07XXXXXXXX or 2547XXXXXXXX).");
      return;
    }

    setStatus("sending");

    setTimeout(() => {
      setStatus("waiting");
    }, 1200);

    setTimeout(() => {
      // ✅ success (mock)
      decrementStockFromCart(items);

      const orderId = createOrder({
        phone: normalizedPhone,
        customerEmail: user?.email || "",
        customerName: user?.name || "",
        items,
        total: totalPrice(),
      });

      // ✅ Save phone to user's profile so next time it autofills
      if (user?.email) {
        updateProfile({ phone: normalizedPhone });
      }

      clearCart();
      navigate(`/receipt/${orderId}`, { replace: true });
    }, 3500);
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ marginTop: 24 }}>
        <div className="card" style={{ maxWidth: 520, margin: "0 auto", padding: 18 }}>
          <h2 style={{ marginTop: 0 }}>Checkout</h2>

          <div
            style={{
              background: "#f6f7f9",
              borderRadius: 12,
              padding: 12,
              marginBottom: 16,
              border: "1px solid var(--border)",
            }}
          >
            <strong>Total Amount</strong>
            <div style={{ fontSize: 22, marginTop: 4 }}>KSh {totalPrice()}</div>
          </div>

          {error ? (
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
              {error}
            </div>
          ) : null}

          <form onSubmit={handlePay} style={{ display: "grid", gap: 14 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 14 }}>M-Pesa Phone Number</span>
              <input
                className="input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07XXXXXXXX or 2547XXXXXXXX"
                inputMode="tel"
              />
              <span style={{ fontSize: 12, color: "var(--muted)" }}>
                Will charge: <strong style={{ color: "#111" }}>{normalizedPhone || "-"}</strong>
              </span>
            </label>

            <button
              className="btn btn-green"
              disabled={status !== "idle" || !canPay}
              style={{
                fontSize: 16,
                opacity: status !== "idle" || !canPay ? 0.7 : 1,
              }}
            >
              {status === "idle" && "Pay with M-Pesa"}
              {status === "sending" && "Sending STK Push…"}
              {status === "waiting" && "Waiting for confirmation…"}
            </button>
          </form>

          {status === "waiting" ? (
            <p style={{ marginTop: 12 }}>
              Check your phone and enter your M-Pesa PIN to complete payment.
            </p>
          ) : null}

          <div style={{ marginTop: 12, color: "var(--muted)", fontSize: 12, lineHeight: 1.55 }}>
            Tip: You can edit the phone anytime. After a successful payment, we save it to your profile so it auto-fills next checkout.
          </div>
        </div>
      </div>
    </>
  );
}