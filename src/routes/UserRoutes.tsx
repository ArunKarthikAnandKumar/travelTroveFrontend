import { Routes, Route } from "react-router-dom";
import UserLayout from "../layout/UserLayout";
import NotFound from "../pages/Visitor/NotFound";
import Profile from "../pages/User/Profile";
import MyFavorites from "../pages/User/MyFavorites";
import MyItineraries from "../pages/User/MyItineraries";
import ItineraryDetail from "../pages/User/ItineraryDetail";
import MyTravelGroups from "../pages/User/MyTravelGroups";
import CreateItinerary from "../pages/User/CreateItinerary";
import CreateTravelGroup from "../pages/User/CreateTravelGroup";

const UserRoutes: React.FC = () => {
  console.log("Inside UserRoutes");

  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-favorites" element={<MyFavorites />} />
        <Route path="/my-itineraries" element={<MyItineraries />} />
        <Route path="/create-itinerary" element={<CreateItinerary />} />
        <Route path="/itineraries/:id" element={<ItineraryDetail />} />
        <Route path="/travel-groups" element={<MyTravelGroups />} />
        <Route path="/create-travel-group" element={<CreateTravelGroup />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;
