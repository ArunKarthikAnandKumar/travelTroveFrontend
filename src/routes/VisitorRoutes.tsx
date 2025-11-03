import { Routes, Route } from "react-router-dom";
import VisitorLayout from "../layout/VisitorLayout";
import Home from "../pages/Visitor/Home";
import NotFound from "../pages/Visitor/NotFound";
import Login from "../pages/Visitor/Login";
import Register from "../pages/Visitor/Register";
import DestinationsPage from "../pages/Destinations";
import DestinationDetail from "../pages/Visitor/DestinationDetail";
import ContactUs from "../pages/Visitor/ContactUs";
import MyItineraries from "../pages/User/MyItineraries";
import MyTravelGroups from "../pages/User/MyTravelGroups";
import ItineraryDetail from "../pages/User/ItineraryDetail";

const VisitorRoutes: React.FC = () => {
  console.log("Inside VisitorRoutes");

  return (
    <Routes>
      <Route element={<VisitorLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/destinations/:id" element={<DestinationDetail />} />
        <Route path="/itineraries" element={<MyItineraries />} />
        <Route path="/itineraries/:id" element={<ItineraryDetail />} />
        <Route path="/travel-groups" element={<MyTravelGroups />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default VisitorRoutes;
