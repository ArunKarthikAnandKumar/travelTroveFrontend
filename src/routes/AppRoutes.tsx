import { Routes, Route } from "react-router-dom";
import VisitorRoutes from "./VisitorRoutes";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import AdminLogin from "../pages/Admin/AdminLogin";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Visitor routes (homepage and general visitor pages) */}
      <Route path="/*" element={<VisitorRoutes />} />

      {/* User routes */}
      <Route path="/user/*" element={<UserRoutes />} />

      {/* Admin login route */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin routes */}
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
};

export default AppRoutes;
