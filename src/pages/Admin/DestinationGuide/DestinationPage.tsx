import { useEffect, useState } from "react";
import type { Continent, Country, State, City } from "../../../models/Destinations";
import "../../../css/AdminForms.css";
import { DestinationGuideDrawer } from "./DestinationDrawer";
import {
  addDestinationGuide,
  updateDestinationGuide,
  deleteDestinationGuide,
  fetchAllDestinationGuides,
} from "../../../api/adminApi";
import AlertMessage from "../../../components/Common/AlertMessage";
import { BASE_URL } from "../../../utils/constatnts";
import { formatThumbnailForDisplay } from "../../../utils/imageUtils";

const DestinationGuidePage: React.FC = () => {
  const [destinationGuides, setDestinationGuides] = useState<any[]>([]);
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
      const res = await fetchAllDestinationGuides();
      const data = res.data.data;
      setDestinationGuides(data.destinationData || []);
      setCities(data.cityData || []);
      setContinents(data.continentData || []);
      setCountries(data.countryData || []);
      setStates(data.stateData || []);
    } catch {
      setAlert({ type: "danger", message: "Failed to fetch destination guides" });
      setDestinationGuides([]);
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
      const res = await deleteDestinationGuide(id);
      setAlert({ type: "success", message: res.data.message });
      fetchAllData();
    } catch {
      setAlert({ type: "danger", message: "Error while deleting destination guide" });
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const requestData: any = {
        title: data.title,
        overview: data.overview,
        continentId: data.continent,
        countryId: data.country,
        stateId: data.state,
        cityId: data.city,
        continent: getNameById(continents, data.continent),
        country: getNameById(countries, data.country),
        state: getNameById(states, data.state),
        city: getNameById(cities, data.city),
        highlights: JSON.stringify(data.highlights || []),
        travelTips: JSON.stringify(data.travelTips || []),
        bestTimeToVisit: JSON.stringify(data.bestTimeToVisit),
        attractions: JSON.stringify(data.attractions || []),
        hotels: JSON.stringify(data.hotels || []),
        restaurants: JSON.stringify(data.restaurants || []),
        avgRating: data.avgRating || "0",
        isFeatured: data.isFeatured ? "true" : "false",
        status: data.status || "Active",
      };

      // Only include thumbnail if it's a new base64 image or required for new entry
      if (data.thumbnail && data.thumbnail.startsWith("data:image") && data.thumbnail.length > 100) {
        requestData.thumbnail = data.thumbnail;
      }

      const response = editData
        ? await updateDestinationGuide(requestData, editData.id)
        : await addDestinationGuide(requestData);

      setAlert({ type: "success", message: response.data.message });
      setDrawerOpen(false);
      setClearData(true);
      fetchAllData();
    } catch (error: any) {
      const message = error.response?.data?.message || "Error while saving destination guide details";
      setAlert({ type: "danger", message });
    }
  };

  const getNameById = (list: any[], id: string) => {
    const found = list.find((item) => item.id === id);
    return found ? found.name : "";
  };

  const paginatedDestinations = destinationGuides.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(destinationGuides.length / pageSize);

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
        <h3 className="fw-bold">Destination Guide Management</h3>
        <button className="btn btn-primary" onClick={onAdd}>
          + Add Destination Guide
        </button>
      </div>

      <div className="table-responsive bg-white rounded shadow-sm p-3">
        <table className="table align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Thumbnail</th>
              <th>Title</th>
              <th>City</th>
              <th>Avg Rating</th>
              <th>Status</th>
              <th>Featured</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDestinations.map((item, index) => (
              <tr key={item.id}>
                <td>{(currentPage - 1) * pageSize + index + 1}</td>
                <td>
                  <img
                    src={formatThumbnailForDisplay(item.thumbnail, BASE_URL)}
                    alt={item.title}
                    style={{
                      width: 60,
                      height: 40,
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "";
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </td>
                <td>{item.title}</td>
                <td>{item.city}</td>
                <td>{item.avgRating?.toFixed(1) || "0.0"}</td>
                <td>{item.status || "Active"}</td>
                <td>{item.isFeatured ? "Yes" : "No"}</td>
                <td className="text-end">
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => onEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!paginatedDestinations.length && (
              <tr>
                <td colSpan={10} className="text-center text-muted">
                  No destination guides found
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
              <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
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

      <DestinationGuideDrawer
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

export default DestinationGuidePage;
