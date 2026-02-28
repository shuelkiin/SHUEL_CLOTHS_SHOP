import { Link } from "react-router-dom";
import { useProductsStore } from "../../state/products.store";

export default function Footer() {
  const categories = useProductsStore((s) => s.categories) || [];
  const year = new Date().getFullYear();

  // keep it short and SEO-friendly (avoid huge category spam)
  const topCats = categories.filter((c) => c && c !== "All").slice(0, 6);

  return (
    <footer
      style={{
        marginTop: 26,
        borderTop: "1px solid var(--border)",
        background: "#fff",
      }}
    >
      <div className="container" style={{ paddingTop: 22, paddingBottom: 18 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
            gap: 18,
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ fontWeight: 900, fontSize: 18 }}>Shuel cloths shop</div>
            <p style={{ margin: "10px 0 0", color: "var(--muted)", lineHeight: 1.6 }}>
              Clean fits, simple checkout, and fast support. Browse our latest
              items, add to cart, and pay securely with M-Pesa.
            </p>

            <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a
                href="https://wa.me/254757355998?text=Hi%20I%20want%20to%20order%20from%20your%20shop"
                target="_blank"
                rel="noreferrer"
                className="pill"
                style={{ textDecoration: "none" }}
              >
                WhatsApp 💬
              </a>
<a
  href="https://instagram.com/its_shuel"
  target="_blank"
  rel="noreferrer"
  className="pill"
  style={{ textDecoration: "none" }}
>
  Instagram 📸
</a>
              <a
                href="mailto:shuelkiin@gmail.com"
                className="pill"
                style={{ textDecoration: "none" }}
              >
                Email ✉️
              </a>
            </div>

            <div style={{ marginTop: 10, color: "var(--muted)", fontSize: 12 }}>
              Location: Nairobi / Ruiru, Kenya
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div style={{ fontWeight: 900, marginBottom: 10 }}>Quick Links</div>
            <div style={{ display: "grid", gap: 8, color: "var(--muted)" }}>
              <Link to="/" style={{ textDecoration: "underline" }}>Shop</Link>
              <Link to="/cart" style={{ textDecoration: "underline" }}>Cart</Link>
              <Link to="/my-orders" style={{ textDecoration: "underline" }}>My Orders</Link>
              <Link to="/login" style={{ textDecoration: "underline" }}>Login</Link>
              <Link to="/register" style={{ textDecoration: "underline" }}>Create Account</Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <div style={{ fontWeight: 900, marginBottom: 10 }}>Categories</div>
            {topCats.length ? (
              <div style={{ display: "grid", gap: 8, color: "var(--muted)" }}>
                {topCats.map((c) => (
                  <Link key={c} to="/" style={{ textDecoration: "underline" }}>
                    {c}
                  </Link>
                ))}
              </div>
            ) : (
              <div style={{ color: "var(--muted)" }}>Add categories in Admin.</div>
            )}
            <div style={{ marginTop: 10, color: "var(--muted)", fontSize: 12 }}>
              Tip: Use search + category filters to find items faster.
            </div>
          </div>

          {/* Policies / Business */}
          <div>
            <div style={{ fontWeight: 900, marginBottom: 10 }}>Customer Care</div>
            <div style={{ display: "grid", gap: 8, color: "var(--muted)" }}>
              <span>Delivery: Same day/Next day (depends on location)</span>
              <span>Payments: M-Pesa</span>
              <span>Support: WhatsApp & Email</span>
              <span>Hours: Mon–Sat, 9am–7pm</span>
            </div>

            <div
              style={{
                marginTop: 12,
                padding: 12,
                borderRadius: 14,
                border: "1px solid var(--border)",
                background: "var(--bg)",
                color: "var(--muted)",
                fontSize: 12,
                lineHeight: 1.6,
              }}
            >
              Returns & exchanges are handled case-by-case. Contact us on WhatsApp
              with your order/receipt number.
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div
          style={{
            marginTop: 18,
            paddingTop: 14,
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            color: "var(--muted)",
            fontSize: 12,
          }}
        >
          <div>© {year} Shuel ClothS shop. All rights reserved.</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <span>Secure checkout</span>
            <span>•</span>
            <span>Fast support</span>
            <span>•</span>
            <span>Kenya 🇰🇪</span>
          </div>
        </div>
      </div>

      {/* responsive */}
      <style>{`
        @media (max-width: 900px){
          footer .container > div:first-child{
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 560px){
          footer .container > div:first-child{
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}