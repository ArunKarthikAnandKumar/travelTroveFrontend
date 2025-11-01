import { useEffect, useState } from "react";
import type { Continent, Country, State, City } from "../../../models/Destinations";
import "../../../css/AdminForms.css";
import { ItineraryDrawer } from "./ItenaryDrawer";
import {
  addItinerary,
  updateItinerary,
  deleteItinerary,
  fetchAllItineraries,
} from "../../../api/adminApi";
import AlertMessage from "../../../components/Common/AlertMessage";
import { BASE_URL } from "../../../utils/constatnts";

const ItineraryPage: React.FC = () => {
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [continents, setContinents] = useState<Continent[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [attractions, setAttractions] = useState<any[]>([]);

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
      const res = await fetchAllItineraries();
      const data = res.data.data;
      setItineraries(data.itineraryData || []);
      setContinents(data.continentData || []);
      setCountries(data.countryData || []);
      setStates(data.stateData || []);
      setCities(data.cityData || []);
      setHotels(data.hotelData || []);
      setRestaurants(data.restaurantData || []);
      setAttractions(data.attractionData || []);
    } catch {
      setAlert({ type: "danger", message: "Failed to fetch itinerary data" });
      setItineraries([]);
    }
  };

  const onAdd = () => {
    setEditData(null);
    setClearData(false);
    setDrawerOpen(true);
  };

  const onEdit = (item: any) => {
    setEditData(item);
    setDrawerOpen(true);
    setClearData(false);
  };

  const onDelete = async (id: string) => {
    try {
      const res = await deleteItinerary(id);
      setAlert({ type: "success", message: res.data.message });
      fetchAllData();
    } catch {
      setAlert({ type: "danger", message: "Error while deleting itinerary" });
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const formData = new FormData();

      formData.append("type", data.type);
      formData.append("title", data.title);
      formData.append("durationDays", data.durationDays);

      formData.append("continentId", data.continentId || data.continent || "");
      formData.append("countryId", data.countryId || data.country || "");
      formData.append("stateId", data.stateId || data.state || "");
      formData.append("cityId", data.cityId || data.city || "");

      formData.append("continent", data.continent || getNameById(continents, data.continentId || data.continent));
      formData.append("country", data.country || getNameById(countries, data.countryId || data.country));
      formData.append("state", data.state || getNameById(states, data.stateId || data.state));
      formData.append("city", data.city || getNameById(cities, data.cityId || data.city));

      formData.append("days", JSON.stringify(data.days || []));
      formData.append("inclusions", JSON.stringify(data.inclusions || []));
      formData.append("exclusions", JSON.stringify(data.exclusions || []));
      formData.append("priceRange", data.priceRange || "");
      formData.append("bestTimeToVisit", JSON.stringify(data.bestTimeToVisit || []));
      formData.append("tags", JSON.stringify(data.tags || []));

      if (data.thumbnailFile) {
        formData.append("thumbnail", data.thumbnailFile);
      }

      const response = editData
        ? await updateItinerary(formData, editData.id)
        : await addItinerary(formData);

      setAlert({ type: "success", message: response.data.message });
      setDrawerOpen(false);
      setClearData(true);
      fetchAllData();
    } catch (error: any) {
      const message = error.response?.data?.message || "Error while saving itinerary";
      setAlert({ type: "danger", message });
    }
  };
  const getNameById = (list: any[], id: string) => {
    const found = list.find((item) => item.id === id);
    return found ? found.name : "";
  };

  const paginatedItineraries = itineraries.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(itineraries.length / pageSize);

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
        <h3 className="fw-bold">Itinerary Management</h3>
        <button className="btn btn-primary" onClick={onAdd}>
          + Add Itinerary
        </button>
      </div>

      <div className="table-responsive bg-white rounded shadow-sm p-3">
        <table className="table align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Thumbnail</th>
              <th>Title</th>
              <th>Type</th>
              <th>City</th>
              <th>Duration</th>
              <th>Price Range</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItineraries.map((itinerary, index) => (
              <tr key={itinerary.id}>
                <td>{(currentPage - 1) * pageSize + index + 1}</td>
                <td>
                  <img
                    src={`${BASE_URL}/${itinerary.thumbnail}`}
                    alt={itinerary.title}
                    style={{
                      width: 60,
                      height: 40,
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />
                </td>
                <td>{itinerary.title}</td>
                <td>{itinerary.type}</td>
                <td>{itinerary.city}</td>
                <td>{itinerary.durationDays} days</td>
                <td>{itinerary.priceRange || "-"}</td>
                <td className="text-end">
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => onEdit(itinerary)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(itinerary.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!paginatedItineraries.length && (
              <tr>
                <td colSpan={10} className="text-center text-muted">
                  No itineraries found
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
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
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

      <ItineraryDrawer
        show={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSubmit}
        editData={editData}
        clearData={clearData}
        continentData={continents}
        countryData={countries}
        stateData={states}
        cityData={cities}
        attractionData={attractions}
        hotelData={hotels}
        restaurantData={restaurants}
      />
       {drawerOpen && (
                    <div className="overlay" onClick={() => setDrawerOpen(false)}></div>
                )}
    </div>
  );
};

export default ItineraryPage;
