import React, { useEffect, useState } from "react";
import type { Continent, Country, State, City } from "../../../models/Destinations";
import { BASE_URL } from "../../../utils/constatnts";

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

export const AttractionDrawer: React.FC<Props> = ({
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
  const [name, setName] = useState("");
  const [continent, setContinent] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [tips, setTips] = useState<string[]>([]);
  const [bestTimeToVisit, setBestTimeToVisit] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [popularFor, setPopularFor] = useState("");

  const [highlightInput, setHighlightInput] = useState("");
  const [tipInput, setTipInput] = useState("");

  const handleKeyDownArray = (
    e: React.KeyboardEvent<HTMLInputElement>,
    arr: string[],
    setArr: React.Dispatch<React.SetStateAction<string[]>>,
    inputValue: string,
    setInputValue: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault();
      if (!arr.includes(inputValue.trim())) setArr([...arr, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeWord = (
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
      setName(editData.name || "");
      setContinent(editData.continentId || "");
      setCountry(editData.countryId || "");
      setState(editData.stateId || "");
      setCity(editData.cityId || "");
      setShortDesc(editData.shortDesc || "");
      setLongDesc(editData.longDesc || "");
      setThumbnail(editData.thumbnail ? `${BASE_URL}/${editData.thumbnail}` : "");
      setHighlights(editData.highlights || []);
      setTips(editData.tips || []);
      setBestTimeToVisit(editData.bestTimeToVisit || "");
      setEntryFee(editData.entryFee || "");
      setOpeningHours(editData.openingHours || "");
      setPopularFor(editData.popularFor || "");
    } else {
      setName("");
      setContinent("");
      setCountry("");
      setState("");
      setCity("");
      setShortDesc("");
      setLongDesc("");
      setThumbnail("");
      setHighlights([]);
      setTips([]);
      setBestTimeToVisit("");
      setEntryFee("");
      setOpeningHours("");
      setPopularFor("");
    }
  }, [editData, clearData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      continent,
      country,
      state,
      city,
      shortDesc,
      longDesc,
      thumbnail,
      thumbnailFile,
      highlights,
      tips,
      bestTimeToVisit,
      entryFee,
      openingHours,
      popularFor,
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
      <div className="drawer-header border-bottom bg-white shadow-sm p-3 d-flex justify-content-between align-items-center">
        <h5 className="fw-bold mb-0">
          {editData ? "Edit Attraction Details" : "Add New Attraction"}
        </h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>

      <div className="drawer-body p-4" style={{ maxHeight: "80vh", overflowY: "auto" }}>
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
                    {filteredCities(state).map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Attraction Details */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header fw-semibold">Attraction Details</div>
            <div className="card-body">
              <label className="form-label fw-semibold">Attraction Name</label>
              <input
                type="text"
                className="form-control mb-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Attraction Name"
                required
              />

              <label className="form-label fw-semibold">Short Description</label>
              <textarea
                className="form-control mb-3"
                rows={2}
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
              ></textarea>

              <label className="form-label fw-semibold">Long Description</label>
              <textarea
                className="form-control mb-3"
                rows={3}
                value={longDesc}
                onChange={(e) => setLongDesc(e.target.value)}
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

          {/* Highlights and Tips */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header fw-semibold">Highlights & Tips</div>
            <div className="card-body">
              {[
                {
                  label: "Highlights",
                  desc: "Notable features or key experiences.",
                  items: highlights,
                  setItems: setHighlights,
                  inputValue: highlightInput,
                  setInputValue: setHighlightInput,
                },
                {
                  label: "Tips",
                  desc: "Helpful advice or information for visitors.",
                  items: tips,
                  setItems: setTips,
                  inputValue: tipInput,
                  setInputValue: setTipInput,
                },
              ].map(({ label, desc, items, setItems, inputValue, setInputValue }, idx) => (
                <div key={idx} className="mb-4">
                  <label className="form-label fw-semibold">{label}</label>
                  <p className="text-muted small">{desc}</p>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder={`Type and press Enter to add ${label}`}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) =>
                      handleKeyDownArray(e, items, setItems, inputValue, setInputValue)
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
                        onClick={() => removeWord(item, items, setItems)}
                      ></button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header fw-semibold">Additional Info</div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Best Time to Visit</label>
                  <input
                    type="text"
                    className="form-control"
                    value={bestTimeToVisit}
                    onChange={(e) => setBestTimeToVisit(e.target.value)}
                    placeholder="e.g. October to February"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Entry Fee</label>
                  <input
                    type="text"
                    className="form-control"
                    value={entryFee}
                    onChange={(e) => setEntryFee(e.target.value)}
                    placeholder="e.g. ₹100 per person"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Opening Hours</label>
                  <input
                    type="text"
                    className="form-control"
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                    placeholder="e.g. 9:00 AM - 6:00 PM"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Popular For</label>
                  <input
                    type="text"
                    className="form-control"
                    value={popularFor}
                    onChange={(e) => setPopularFor(e.target.value)}
                    placeholder="e.g. Historical Architecture"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-success w-50 me-2 shadow-sm">
              {editData ? "Update Attraction" : "Add Attraction"}
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
