import { Routes, Route } from "react-router-dom";
import VisitorLayout from "../layout/VisitorLayout";
import Home from "../pages/Visitor/Home";
import NotFound from "../pages/Visitor/NotFound";
import Login from "../pages/Visitor/Login";
import Register from "../pages/Visitor/Register";

const VisitorRoutes: React.FC = () => {
  console.log("Inside VisitorRoutes");

  return (
    <Routes>
      <Route element={<VisitorLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default VisitorRoutes;
