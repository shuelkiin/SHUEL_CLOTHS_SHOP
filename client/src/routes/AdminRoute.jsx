import { Navigate } from "react-router-dom";
import { useAuthStore } from "../state/auth.store";

export default function AdminRoute({ children }) {
  const user = useAuthStore((s) => s.user);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return children;
}