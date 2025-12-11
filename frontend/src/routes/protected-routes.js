import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoutes() {
  const token = localStorage.getItem("access_token");

  // Giải mã payload của JWT để lấy thông tin user
  const user = token ? JSON.parse(atob(token.split(".")[1])) : null;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user.role_id === 2) {
    return <Navigate to="/" replace />;
  }

  // Cho phép truy cập vào route con
  return <Outlet />;
}
