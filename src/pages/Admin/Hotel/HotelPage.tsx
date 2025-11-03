import { useEffect, useState } from "react";
import type { Continent, Country, State, City } from "../../../models/Destinations";
import "../../../css/AdminForms.css";
import { HotelDrawer } from "./HotelDrawer";
import {
  addHotel,
  updateHotel,
  deleteHotel,
  fetchAllHotels,
} from "../../../api/adminApi";
import AlertMessage from "../../../components/Common/AlertMessage";
import { BASE_URL } from "../../../utils/constatnts";

const HotelPage: React.FC = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [continents, setContinents] = useState<Continent[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);
  const [clearData, setClearData] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "danger"; message: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const res = await fetchAllHotels();
      const data = res.data.data;
      setHotels(data.hotelData || []);
      setCities(data.cityData || []);
      setContinents(data.continentData || []);
      setCountries(data.countryData || []);
      setStates(data.stateData || []);
    } catch {
      setAlert({ type: "danger", message: "Failed to fetch hotel data" });
      setHotels([]);
    }
  };

  const onAdd = () => {
    setEditData(null);
    setClearData(false);
    setDrawerOpen(true);
  };

  const onEdit = (hotel: any) => {
    setEditData(hotel);
    setDrawerOpen(true);
    setClearData(false);
  };

  const onDelete = async (id: string) => {
    try {
      const res = await deleteHotel(id);
      setAlert({ type: "success", message: res.data.message });
      fetchAllData();
    } catch {
      setAlert({ type: "danger", message: "Error while deleting hotel" });
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      // Prepare JSON data with base64 thumbnail (like ContinentPage/CountryPage/StatePage/CityPage/AttractionPage/RestaurantPage)
      const requestData: any = {
        name: data.name,
        shortDesc: data.shortDesc,
        longDesc: data.longDesc,
        rating: data.rating || "",
        priceRange: data.priceRange || "",
        checkInTime: data.checkInTime || "",
        checkOutTime: data.checkOutTime || "",
        contactNumber: data.contactNumber || "",
        email: data.email || "",
        website: data.website || "",
        continentId: data.continent,
        countryId: data.country,
        stateId: data.state,
        cityId: data.city,
        continent: getNameById(continents, data.continent),
        country: getNameById(countries, data.country),
        state: getNameById(states, data.state),
        city: getNameById(cities, data.city),
        roomTypes: Array.isArray(data.roomTypes) ? data.roomTypes : [],
        amenities: Array.isArray(data.amenities) ? data.amenities : [],
        facilities: Array.isArray(data.facilities) ? data.facilities : [],
        popularFor: Array.isArray(data.popularFor) ? data.popularFor : [],
        highlights: Array.isArray(data.highlights) ? data.highlights : [],
        tips: Array.isArray(data.tips) ? data.tips : [],
        bestTimeToVisit: data.bestTimeToVisit || {},
        location: {
          address: data.location?.address || "",
          latitude: data.location?.latitude || "",
          longitude: data.location?.longitude || "",
          nearbyAttractions: data.location?.nearbyAttractions || []
        }
      };

      // Only include thumbnail if it's a valid base64 image (starts with data:image and is substantial)
      // If editing and no new image uploaded, backend will keep existing thumbnail
      if (data.thumbnail && data.thumbnail.startsWith('data:image') && data.thumbnail.length > 100) {
        requestData.thumbnail = data.thumbnail;
      } else if (!editData) {
        // For new hotel, thumbnail is required (validated in drawer)
        requestData.thumbnail = data.thumbnail || null;
      }

      const response = editData
        ? await updateHotel(requestData, editData.id)
        : await addHotel(requestData);

      setAlert({ type: "success", message: response.data.message });
      setDrawerOpen(false);
      setClearData(true);
      fetchAllData();
    } catch (error: any) {
      const message = error.response?.data?.message || "Error while saving hotel details";
      setAlert({ type: "danger", message });
    }
  };

  const getNameById = (list: any[], id: string) => {
    const found = list.find((item) => item.id === id);
    return found ? found.name : "";
  };

  // Helper function to format thumbnail for display (like ContinentPage/CountryPage/StatePage/CityPage/AttractionPage/RestaurantPage)
  const formatThumbnailForDisplay = (thumbnail: string): string => {
    if (!thumbnail) return '';
    
    // If it already starts with data:image, use it directly
    if (thumbnail.startsWith('data:image')) {
      return thumbnail;
    }
    
    // If it contains "data:image" (backend might have prefixed it), extract the data URL part
    const dataImageIndex = thumbnail.indexOf('data:image');
    if (dataImageIndex !== -1) {
      // Extract everything from "data:image" onwards
      return thumbnail.substring(dataImageIndex);
    }
    
    // If it starts with assets/ or is a path, use BASE_URL
    if (thumbnail.startsWith('assets/')) {
      return `${BASE_URL}/${thumbnail}`;
    }
    
    // If it's pure base64 (no prefix), add the data URL prefix
    if (thumbnail.length > 100 && !thumbnail.includes('/')) {
      return `data:image/jpeg;base64,${thumbnail}`;
    }
    
    // Fallback: assume it's a path
    return `${BASE_URL}/${thumbnail}`;
  };

  const paginatedHotels = hotels.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(hotels.length / pageSize);

  return (
    <div className="container py-4 position-relative">
      {alert && (
        <AlertMessage
          type={alert.type}
          title={alert.type === "success" ? "Success" : "Error"}
          message={alert.message}
          onclose={() => setAlert(null)}
        />
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">Hotel Management</h3>
        <button className="btn btn-primary" onClick={onAdd}>
          + Add Hotel
        </button>
      </div>

      <div className="table-responsive bg-white rounded shadow-sm p-3">
        <table className="table align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Thumbnail</th>
              <th>Name</th>
              <th>City</th>
              <th>Rating</th>
              <th>Price Range</th>
              <th>Contact</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedHotels.map((hotel, index) => (
              <tr key={hotel.id}>
                <td>{(currentPage - 1) * pageSize + index + 1}</td>
                <td>
                  <img
                    src={formatThumbnailForDisplay(hotel.thumbnail)}
                    alt={hotel.name}
                    style={{
                      width: 60,
                      height: 40,
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                    onError={(e) => {
                      // Fallback if base64 is invalid
                      (e.target as HTMLImageElement).src = '';
                    }}
                  />
                </td>
                <td>{hotel.name}</td>
                <td>{hotel.city}</td>
                <td>{hotel.rating || "-"}</td>
                <td>{hotel.priceRange || "-"}</td>
                <td>{hotel.contactNumber || "-"}</td>
                <td className="text-end">
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => onEdit(hotel)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(hotel.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!paginatedHotels.length && (
              <tr>
                <td colSpan={10} className="text-center text-muted">
                  No hotels found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav className="d-flex justify-content-end mt-3">
          <ul className="pagination mb-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      <HotelDrawer
        show={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSubmit}
        editData={editData}
        clearData={clearData}
        continentData={continents}
        countryData={countries}
        stateData={states}
        cityData={cities}
      />
       {drawerOpen && (
                    <div className="overlay" onClick={() => setDrawerOpen(false)}></div>
                )}
    </div>
  );
};

export default HotelPage;
