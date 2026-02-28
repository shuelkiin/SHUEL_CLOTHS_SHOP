export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/254757355998?text=Hi%20I%20want%20to%20order"
      target="_blank"
      rel="noreferrer"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        background: "#25D366",
        color: "#fff",
        width: 56,
        height: 56,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 26,
        boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
      }}
      title="Chat on WhatsApp"
    >
      💬
    </a>
  );
}