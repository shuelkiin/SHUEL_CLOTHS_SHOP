import AppRoutes from "./routes/AppRoutes";
import Footer from "./components/layout/Footer";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <AppRoutes />
      </div>
      <Footer />
    </div>
  );
}