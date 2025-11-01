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
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("shortDesc", data.shortDesc);
      formData.append("longDesc", data.longDesc);
      formData.append("rating", data.rating);
      formData.append("priceRange", data.priceRange);
      formData.append("checkInTime", data.checkInTime);
      formData.append("checkOutTime", data.checkOutTime);
      formData.append("contactNumber", data.contactNumber);
      formData.append("email", data.email);
      formData.append("website", data.website);

      formData.append("continentId", data.continent);
      formData.append("countryId", data.country);
      formData.append("stateId", data.state);
      formData.append("cityId", data.city);

      formData.append("continent", getNameById(continents, data.continent));
      formData.append("country", getNameById(countries, data.country));
      formData.append("state", getNameById(states, data.state));
      formData.append("city", getNameById(cities, data.city));

      formData.append("roomTypes", JSON.stringify(data.roomTypes || []));
      formData.append("amenities", JSON.stringify(data.amenities || []));
      formData.append("facilities", JSON.stringify(data.facilities || []));
      formData.append("popularFor", JSON.stringify(data.popularFor || []));
      formData.append("highlights", JSON.stringify(data.highlights || []));
      formData.append("tips", JSON.stringify(data.tips || []));

      formData.append("bestTimeToVisit", JSON.stringify(data.bestTimeToVisit || {}));

      formData.append("location", JSON.stringify({
        address: data.location?.address || "",
        latitude: data.location?.latitude || "",
        longitude: data.location?.longitude || "",
        nearbyAttractions: data.location?.nearbyAttractions || [],
      }));

      if (data.thumbnailFile) {
        formData.append("thumbnail", data.thumbnailFile);
      }

      const response = editData
        ? await updateHotel(formData, editData.id)
        : await addHotel(formData);

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
                    src={`${BASE_URL}/${hotel.thumbnail}`}
                    alt={hotel.name}
                    style={{
                      width: 60,
                      height: 40,
                      objectFit: "cover",
                      borderRadius: "6px",
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
