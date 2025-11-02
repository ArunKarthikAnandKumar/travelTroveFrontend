import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import NotFound from "../pages/Visitor/NotFound";
import AdminHome from "../pages/Admin/AdminHome";
import ContinentPage from "../pages/Admin/Continent/ContinentPage";
import CountryPage from "../pages/Admin/Country/CountryPage";
import StatePage from "../pages/Admin/State/StatePage";
import CityPage from "../pages/Admin/City/CityPage";
import AttractionPage from "../pages/Admin/Attraction/AttractionPage";
import RestaurantPage from "../pages/Admin/Restaurant/RestaurantPage";
import HotelPage from "../pages/Admin/Hotel/HotelPage";
import DestinationGuidePage from "../pages/Admin/DestinationGuide/DestinationPage";
import ItineraryPage from "../pages/Admin/Itenary/ItenaryPage";
import TravelGroupPage from "../pages/Admin/TravelGroup/TravelGroupPage";

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/home" element={<AdminHome />} />
        <Route path="/continents" element={<ContinentPage />} />
        <Route path="/countries" element={<CountryPage />} />
        <Route path="/states" element={<StatePage />} />
        <Route path="/cities" element={<CityPage />} />
        <Route path="/attractions" element={<AttractionPage />} />
        <Route path="/restaurants" element={<RestaurantPage />} />
        <Route path="/hotels" element={<HotelPage />} />
        <Route path="/itinerary" element={<ItineraryPage />} />
        <Route path="/destinationGuides" element={<DestinationGuidePage />} />
        <Route path="/travel-groups" element={<TravelGroupPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
