import { useEffect, useState } from "react";
import type { City, State, Country, Continent } from "../../../models/Destinations";
import "../../../css/AdminForms.css";
import { CityDrawer } from "./CityDrawer";
import {
  addCity,
  deleteCity,
  fetchAllCities,
  updateCity,
} from "../../../api/adminApi";
import AlertMessage from "../../../components/Common/AlertMessage";
import { BASE_URL } from "../../../utils/constatnts";

const CityPage: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [continents, setContinents] = useState<Continent[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState<City | null>(null);

  const [clearData,setClearData]=useState(false)

  const [alert, setAlert] = useState<{
    type: "success" | "danger";
    message: string;
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const response = await fetchAllCities();
      const data = response.data.data;
      setCities(data.cityData || []);
      setContinents(data.continentData || []);
      setCountries(data.countryData || []);
      setStates(data.stateData || []);
      
    } catch {
      setAlert({ type: "danger", message: "Failed to fetch city data" });
      setCities([]);
    }
  };

  const paginatedCities = cities.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(cities.length / pageSize);

  const onAdd = () => {
    setClearData(false)
    setEditData(null);
    setDrawerOpen(true);
  };

  const onEdit = (city: City) => {
    const continentObj = continents.find((c) => c.name === city.continent);
    const countryObj = countries.find((c) => c.name === city.country);
    const stateObj = states.find((s) => s.name === city.state);

    setEditData({
      ...city,
      continent: continentObj?.id || "",
      country: countryObj?.id || "",
      state: stateObj?.id || "",
    });
    setDrawerOpen(true);
    setClearData(false)
  };

  const onDelete = async (id: string) => {
    try {
      const res = await deleteCity(id);
      setAlert({ type: "success", message: res.data.message });
      fetchAllData();
    } catch {
      setAlert({ type: "danger", message: "Error while deleting city" });
    }
  };

 const handleSubmit = async (data: any) => {
  try {
    const continent = continents.find((c) => c.id === data.continent);
    const country = countries.find((c) => c.id === data.country);
    const state = states.find((s) => s.id === data.state);

    console.log(data);

    if (!continent || !country || !state) {
      setAlert({ type: "danger", message: "Invalid location selection" });
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("shortDesc", data.shortDesc);
    formData.append("longDesc", data.longDesc);
    formData.append("continentId", continent.id);
    formData.append("countryId", country.id);
    formData.append("stateId", state.id);
    formData.append("continent", continent.name);
    formData.append("country", country.name);
    formData.append("state", state.name);

    // Convert comma-separated or array data into clean JSON arrays
    formData.append(
      "highlights",
      Array.isArray(data.highlights)
        ?data.highlights
        : JSON.stringify((data.highlights || "").split(",").map((s: string) => s.trim()).filter(Boolean))
    );

    formData.append(
      "tips",
      Array.isArray(data.tips)
        ? JSON.stringify(data.tips)
        : JSON.stringify((data.tips || "").split(",").map((s: string) => s.trim()).filter(Boolean))
    );

    formData.append(
      "adventureActivities",
      Array.isArray(data.adventureActivities)
        ? JSON.stringify(data.adventureActivities)
        : JSON.stringify((data.adventureActivities || "").split(",").map((s: string) => {
            return s.trim();
        }).filter(Boolean))
    );

    formData.append(
      "bestTimeToVisit",
      JSON.stringify(data.bestTimeToVisit || [])
    );

    if (data.thumbnailFile) {
      formData.append("thumbnail", data.thumbnailFile);
    }

    const response = editData
      ? await updateCity(formData, editData.id)
      : await addCity(formData);

    setAlert({ type: "success", message: response.data.message });
    setDrawerOpen(false);
    setClearData(true);
    fetchAllData();
  } catch (error: any) {
    console.log(error);
    const message =
      error.response?.data?.message || "Error while saving city details";
    setAlert({ type: "danger", message });
  }
};

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
        <h3 className="fw-bold">City Management</h3>
        <button className="btn btn-primary" onClick={onAdd}>
          + Add City
        </button>
      </div>

      <div className="table-responsive bg-white rounded shadow-sm p-3">
        <table className="table align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Thumbnail</th>
              <th>City</th>
              <th>State</th>
              <th>Country</th>
              <th>Continent</th>
              <th>Highlights</th>
              <th>Best Time</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCities.map((city, index) => (
              <tr key={city.id}>
                <td>{(currentPage - 1) * pageSize + index + 1}</td>
                <td>
                  <img
                    src={`${BASE_URL}/${city.thumbnail}`}
                    alt={city.name}
                    style={{
                      width: 60,
                      height: 40,
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />
                </td>
                <td>{city.name}</td>
                <td>{city.state}</td>
                <td>{city.country}</td>
                <td>{city.continent}</td>
                <td>
                  {city.highlights?.length
                    ? city.highlights.slice(0, 2).join(", ") + "..."
                    : "-"}
                </td>
                <td>
                  {city.bestTimeToVisit?.months?.length
                    ? city.bestTimeToVisit.months.join(", ")
                    : "-"}
                </td>
                <td className="text-end">
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => onEdit(city)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(city.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!paginatedCities.length && (
              <tr>
                <td colSpan={10} className="text-center text-muted">
                  No cities found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      <CityDrawer
        show={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSubmit}
        editData={editData}
        continentData={continents}
        countryData={countries}
        stateData={states}
        clearData={clearData}
      />
          {drawerOpen && (
                    <div className="overlay" onClick={() => setDrawerOpen(false)}></div>
                )}
    </div>
  );
};

export default CityPage;
