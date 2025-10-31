import { Routes, Route } from "react-router-dom";
import UserLayout from "../layout/UserLayout";
import NotFound from "../pages/Visitor/NotFound";
import Profile from "../pages/User/Profile";

const UserRoutes: React.FC = () => {
  console.log("Inside UserRoutes");

  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;
