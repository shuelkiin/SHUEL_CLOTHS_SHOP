import Navbar from "../components/layout/Navbar";
import { useCartStore } from "../state/cart.store";
import { Link } from "react-router-dom";

export default function Cart() {
  const items = useCartStore((s) => s.items);
  const increaseQty = useCartStore((s) => s.increaseQty);
  const decreaseQty = useCartStore((s) => s.decreaseQty);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const totalPrice = useCartStore((s) => s.totalPrice);

  return (
    <>
      <Navbar />
      <div className="container">
        <h2 style={{ marginTop: 24 }}>Your Cart</h2>

        {items.length === 0 ? (
          <p>
            Cart is empty. <Link to="/">Go shopping</Link>
          </p>
        ) : (
          <>
            <div style={{ display: "grid", gap: 12 }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "#fff",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    padding: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: 72,
                        height: 72,
                        objectFit: "cover",
                        borderRadius: 10,
                        border: "1px solid var(--border)",
                      }}
                    />

                    <div>
                      <strong style={{ display: "block" }}>{item.name}</strong>
                      <div style={{ color: "var(--muted)", marginTop: 4 }}>
                        KSh {item.price} • Available:{" "}
                        <strong style={{ color: "#111" }}>{item.stock ?? 0}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => decreaseQty(item.id)} style={qtyBtn} aria-label="decrease">
                        −
                      </button>

                      <span style={{ minWidth: 24, textAlign: "center" }}>{item.qty}</span>

                      <button
                        onClick={() => increaseQty(item.id)}
                        style={qtyBtn}
                        aria-label="increase"
                        title={item.qty >= (item.stock ?? 0) ? "Reached max stock" : "Increase"}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#d11",
                        cursor: "pointer",
                        padding: 8,
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 18,
                background: "#fff",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <strong style={{ fontSize: 18 }}>Total: KSh {totalPrice()}</strong>

              <Link to="/checkout" style={{ textDecoration: "none" }}>
                <button className="btn btn-dark">Checkout →</button>
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}

const qtyBtn = {
  width: 34,
  height: 34,
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "#fff",
  cursor: "pointer",
};