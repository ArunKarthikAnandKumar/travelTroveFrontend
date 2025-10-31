import React, { useEffect, useState } from "react";
import { Continent, Country, State, City } from "../../../models/Destinations";
import { BASE_URL } from "../../../utils/constants";

type Props = {
  show: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editData: any | null;
  clearData: boolean;
  continentData: Continent[];
  countryData: Country[];
  stateData: State[];
  cityData: City[];
};

export const DestinationGuideDrawer: React.FC<Props> = ({
  show,
  onClose,
  onSave,
  editData,
  clearData,
  continentData,
  countryData,
  stateData,
  cityData,
}) => {
  const [continent, setContinent] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  const [title, setTitle] = useState("");
  const [overview, setOverview] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const [highlights, setHighlights] = useState<string[]>([]);
  const [travelTips, setTravelTips] = useState<string[]>([]);
  const [highlightInput, setHighlightInput] = useState("");
  const [tipInput, setTipInput] = useState("");

  const [bestMonths, setBestMonths] = useState<string[]>([]);
  const [monthInput, setMonthInput] = useState("");
  const [bestReason, setBestReason] = useState("");

  const [attractions, setAttractions] = useState<string[]>([]);
  const [hotels, setHotels] = useState<string[]>([]);
  const [restaurants, setRestaurants] = useState<string[]>([]);
  const [avgRating, setAvgRating] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState("Active");

  const handleArrayInput = (
    e: React.KeyboardEvent<HTMLInputElement>,
    arr: string[],
    setArr: React.Dispatch<React.SetStateAction<string[]>>,
    inputValue: string,
    setInputValue: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault();
      if (!arr.includes(inputValue.trim()))
        setArr([...arr, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeItem = (
    word: string,
    arr: string[],
    setArr: React.Dispatch<React.SetStateAction<string[]>>
  ) => setArr(arr.filter((w) => w !== word));

  const filteredCountries = (contiId: string) =>
    countryData.filter((ele) => ele.continentId === contiId);
  const filteredStates = (countryId: string) =>
    stateData.filter((ele) => ele.countryId === countryId);
  const filteredCities = (stateId: string) =>
    cityData.filter((ele) => ele.stateId === stateId);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setThumbnail(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setThumbnail("");
    setThumbnailFile(null);
  };

  useEffect(() => {
    if (editData) {
      setContinent(editData.continentId || "");
      setCountry(editData.countryId || "");
      setState(editData.stateId || "");
      setCity(editData.cityId || "");
      setTitle(editData.title || "");
      setOverview(editData.overview || "");
      setThumbnail(
        editData.thumbnail ? `${BASE_URL}/${editData.thumbnail}` : ""
      );
      setHighlights(editData.highlights || []);
      setTravelTips(editData.travelTips || []);
      setBestMonths(editData.bestTimeToVisit?.months || []);
      setBestReason(editData.bestTimeToVisit?.reason || "");
      setAttractions(editData.attractions || []);
      setHotels(editData.hotels || []);
      setRestaurants(editData.restaurants || []);
      setAvgRating(editData.avgRating?.toString() || "");
      setIsFeatured(editData.isFeatured || false);
      setStatus(editData.status || "Active");
    } else if (clearData) {
      setContinent("");
      setCountry("");
      setState("");
      setCity("");
      setTitle("");
      setOverview("");
      setThumbnail("");
      setHighlights([]);
      setTravelTips([]);
      setBestMonths([]);
      setBestReason("");
      setAttractions([]);
      setHotels([]);
      setRestaurants([]);
      setAvgRating("");
      setIsFeatured(false);
      setStatus("Active");
    }
  }, [editData, clearData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      continent,
      country,
      state,
      city,
      title,
      overview,
      thumbnail,
      thumbnailFile,
      highlights,
      travelTips,
      bestTimeToVisit: { months: bestMonths, reason: bestReason },
      attractions,
      hotels,
      restaurants,
      avgRating,
      isFeatured,
      status,
    });
  };

  return (
    <div
      className={`drawer ${show ? "drawer-show" : ""}`}
      style={{
        width: window.innerWidth < 768 ? "100%" : "750px",
        background: "#f8f9fa",
        borderLeft: "2px solid #dee2e6",
      }}
    >
      <div
        className="drawer-header border-bottom bg-white shadow-sm p-3 d-flex justify-content-between align-items-center"
        style={{ position: "sticky", top: 0, zIndex: 5 }}
      >
        <h5 className="fw-bold mb-0">
          {editData ? "Edit Destination Guide" : "Add Destination Guide"}
        </h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>

      <div
        className="drawer-body p-4"
        style={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        <form onSubmit={handleSubmit}>
          {/* Location Section */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header fw-semibold">Location Details</div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Continent</label>
                  <select
                    className="form-select"
                    value={continent}
                    onChange={(e) => {
                      setContinent(e.target.value);
                      setCountry("");
                    }}
                  >
                    <option value="">Select</option>
                    {continentData.map((conti) => (
                      <option key={conti.id} value={conti.id}>
                        {conti.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Country</label>
                  <select
                    className="form-select"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option value="">Select</option>
                    {filteredCountries(continent).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">State</label>
                  <select
                    className="form-select"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  >
                    <option value="">Select</option>
                    {filteredStates(country).map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">City</label>
                  <select
                    className="form-select"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    <option value="">Select</option>
                    {filteredCities(state).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Destination Info */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header fw-semibold">Destination Info</div>
            <div className="card-body">
              <label className="form-label fw-semibold">Title</label>
              <input
                type="text"
                className="form-control mb-3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Destination Title"
                required
              />

              <label className="form-label fw-semibold">Overview</label>
              <textarea
                className="form-control mb-3"
                rows={3}
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                placeholder="Write an overview..."
              ></textarea>

              <label className="form-label fw-semibold">Thumbnail</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {thumbnail && (
                <div className="mt-3 text-center">
                  <img
                    src={thumbnail}
                    alt="Preview"
                    className="rounded shadow-sm"
                    style={{
                      width: "100%",
                      maxHeight: "200px",
                      objectFit: "cover",
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger mt-2"
                    onClick={handleRemoveImage}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Highlights & Tips */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header fw-semibold">Highlights & Travel Tips</div>
            <div className="card-body">
              {[ 
                { label: "Highlights", items: highlights, setItems: setHighlights, inputValue: highlightInput, setInputValue: setHighlightInput },
                { label: "Travel Tips", items: travelTips, setItems: setTravelTips, inputValue: tipInput, setInputValue: setTipInput }
              ].map(({ label, items, setItems, inputValue, setInputValue }, idx) => (
                <div key={idx} className="mb-3">
                  <label className="form-label fw-semibold">{label}</label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder={`Type and press Enter to add ${label}`}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) =>
                      handleArrayInput(e, items, setItems, inputValue, setInputValue)
                    }
                  />
                  {items.map((item, i) => (
                    <div
                      key={i}
                      className="d-flex justify-content-between align-items-start p-2 rounded border mb-2 bg-white"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        className="btn-close"
                        style={{ fontSize: "0.7rem" }}
                        onClick={() => removeItem(item, items, setItems)}
                      ></button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Best Time To Visit */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header fw-semibold">Best Time to Visit</div>
            <div className="card-body">
              <label className="form-label">Months</label>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Type and press Enter (e.g. October)"
                value={monthInput}
                onChange={(e) => setMonthInput(e.target.value)}
                onKeyDown={(e) =>
                  handleArrayInput(e, bestMonths, setBestMonths, monthInput, setMonthInput)
                }
              />
              {bestMonths.map((m, i) => (
                <div
                  key={i}
                  className="d-flex justify-content-between align-items-start p-2 rounded border mb-2 bg-white"
                >
                  <span>{m}</span>
                  <button
                    type="button"
                    className="btn-close"
                    style={{ fontSize: "0.7rem" }}
                    onClick={() => removeItem(m, bestMonths, setBestMonths)}
                  ></button>
                </div>
              ))}

              <label className="form-label">Reason</label>
              <textarea
                className="form-control"
                rows={2}
                value={bestReason}
                onChange={(e) => setBestReason(e.target.value)}
                placeholder="Explain why this period is ideal"
              ></textarea>
            </div>
          </div>

          {/* Admin Controls */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header fw-semibold">Admin Controls</div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Average Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    value={avgRating}
                    onChange={(e) => setAvgRating(e.target.value)}
                    placeholder="0 - 5"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Featured</label>
                  <select
                    className="form-select"
                    value={isFeatured ? "true" : "false"}
                    onChange={(e) => setIsFeatured(e.target.value === "true")}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-success w-50 me-2 shadow-sm">
              {editData ? "Update Guide" : "Add Guide"}
            </button>
            <button
              type="button"
              className="btn btn-secondary w-50 shadow-sm"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
