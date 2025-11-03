import React, { useEffect, useState, useRef } from "react";
import type { Continent, Country, State, City } from "../../../models/Destinations";
import { compressImage, formatThumbnailForDisplay, validateImageFile, getBase64SizeKB } from "../../../utils/imageUtils";

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

export const RestaurantDrawer: React.FC<Props> = ({
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
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cuisineType, setCuisineType] = useState<string[]>([]);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [popularFor, setPopularFor] = useState<string[]>([]);
  const [averageCost, setAverageCost] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const [cuisineInput, setCuisineInput] = useState("");
  const [facilityInput, setFacilityInput] = useState("");
  const [popularInput, setPopularInput] = useState("");

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const validation = validateImageFile(file, 10);
    if (!validation.isValid) {
      alert(validation.error);
      if(fileInputRef.current){
        fileInputRef.current.value = "";
      }
      return;
    }
    
    setIsCompressing(true);
    try {
      const compressedBase64 = await compressImage(file, 600, 600, 300);
      const sizeInKB = getBase64SizeKB(compressedBase64);
      if (sizeInKB > 400) {
        alert(`Warning: Image compressed to ${sizeInKB.toFixed(0)}KB. For best results, try a smaller image.`);
      }
      setThumbnail(compressedBase64);
    } catch (error) {
      console.error('Error compressing image:', error);
      alert('Error processing image. Please try again.');
      if(fileInputRef.current){
        fileInputRef.current.value = "";
      }
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemoveImage = () => {
    setThumbnail("");
    if(fileInputRef.current){
      fileInputRef.current.value = "";
    }
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
      // Format thumbnail for display - extract base64 if backend added path prefix
      const formattedThumbnail = formatThumbnailForDisplay(editData.thumbnail || "");
      setThumbnail(formattedThumbnail);
      setCuisineType(editData.cuisineType || []);
      setFacilities(editData.facilities || []);
      setPopularFor(editData.popularFor || []);
      setAverageCost(editData.averageCost || "");
      setOpeningHours(editData.openingHours || "");
      setContactNumber(editData.contactNumber || "");
    }else if(clearData){
      setName("");
      setContinent("");
      setCountry("");
      setState("");
      setCity("");
      setShortDesc("");
      setLongDesc("");
      setThumbnail("");
      setCuisineType([]);
      setFacilities([]);
      setPopularFor([]);
      setAverageCost("");
      setOpeningHours("");
      setContactNumber("");
    } 
    else {
      setName("");
      setContinent("");
      setCountry("");
      setState("");
      setCity("");
      setShortDesc("");
      setLongDesc("");
      setThumbnail("");
      setCuisineType([]);
      setFacilities([]);
      setPopularFor([]);
      setAverageCost("");
      setOpeningHours("");
      setContactNumber("");
    }
  }, [editData, clearData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare data object
    const submitData: any = {
      name,
      continent,
      country,
      state,
      city,
      shortDesc,
      longDesc,
      cuisineType,
      facilities,
      popularFor,
      averageCost,
      openingHours,
      contactNumber,
    };
    
    // Only send thumbnail if it's a valid base64 data URL (newly uploaded image)
    // Check if thumbnail starts with data:image and has substantial content
    if (thumbnail && thumbnail.startsWith('data:image') && thumbnail.length > 100) {
      // Final size check before submitting
      const sizeInKB = getBase64SizeKB(thumbnail);
      if (sizeInKB > 500) {
        alert(`Image is too large (${sizeInKB.toFixed(0)}KB). Maximum allowed is 500KB. Please select a smaller image.`);
        return;
      }
      submitData.thumbnail = thumbnail;
    } else if (!editData) {
      // Require file when adding new restaurant
      alert("Please select a thumbnail image");
      return;
    }
    // If editing and no new image, don't include thumbnail (backend will keep existing)
    
    onSave(submitData);
  };

  return (
    <div
      className={`drawer ${show ? "drawer-show" : ""}`}
      style={{
        width: window.innerWidth < 768 ? "100%" : "750px",
        background: "#f8f9fa",
        borderLeft: "2px solid #dee2e6",
        position: "fixed",
        top: "0",
        right: show ? "0" : "-100%",
        height: "100%",
        transition: "right 0.4s ease-in-out",
        zIndex: 1050,
      }}
    >
      <div
        className="border-bottom bg-white shadow-sm p-3 d-flex justify-content-between align-items-center"
        style={{ position: "sticky", top: 0, zIndex: 10 }}
      >
        <h5 className="fw-bold mb-0">
          {editData ? "Edit Restaurant Details" : "Add New Restaurant"}
        </h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>

      <div className="p-4" style={{ maxHeight: "85vh", overflowY: "auto" }}>
        <form onSubmit={handleSubmit}>
          {/* Location Section */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header fw-semibold">Location Details</div>
            <div className="card-body row g-3">
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
                  {continentData.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
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

          {/* Restaurant Info */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header fw-semibold">Restaurant Info</div>
            <div className="card-body">
              <label className="form-label fw-semibold">Name</label>
              <input
                type="text"
                className="form-control mb-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Restaurant Name"
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
                ref={fileInputRef}
                onChange={handleImageUpload}
                disabled={isCompressing}
              />
              {isCompressing && (
                <div className="mt-2 text-center text-muted">
                  <small>Compressing image...</small>
                </div>
              )}
              {thumbnail && !isCompressing && (
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

          {/* Cuisine, Facilities, Popular For */}
          {[
            {
              label: "Cuisine Type",
              desc: "Add cuisine types (e.g. South Indian, Italian).",
              items: cuisineType,
              setItems: setCuisineType,
              inputValue: cuisineInput,
              setInputValue: setCuisineInput,
            },
            {
              label: "Facilities",
              desc: "Add available facilities (e.g. Parking, Wi-Fi).",
              items: facilities,
              setItems: setFacilities,
              inputValue: facilityInput,
              setInputValue: setFacilityInput,
            },
            {
              label: "Popular For",
              desc: "Add popular dishes or features.",
              items: popularFor,
              setItems: setPopularFor,
              inputValue: popularInput,
              setInputValue: setPopularInput,
            },
          ].map(({ label, desc, items, setItems, inputValue, setInputValue }, idx) => (
            <div key={idx} className="card shadow-sm border-0 mb-4">
              <div className="card-header fw-semibold">{label}</div>
              <div className="card-body">
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
            </div>
          ))}

          {/* Additional Info */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header fw-semibold">Additional Info</div>
            <div className="card-body row g-3">
              <div className="col-md-6">
                <label className="form-label">Average Cost</label>
                <input
                  type="text"
                  className="form-control"
                  value={averageCost}
                  onChange={(e) => setAverageCost(e.target.value)}
                  placeholder="e.g. ₹800 for two"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Opening Hours</label>
                <input
                  type="text"
                  className="form-control"
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  placeholder="e.g. 10 AM – 11 PM"
                />
              </div>
              <div className="col-md-12">
                <label className="form-label">Contact Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-success w-50 me-2 shadow-sm">
              {editData ? "Update Restaurant" : "Add Restaurant"}
            </button>
            <button type="button" className="btn btn-secondary w-50 shadow-sm" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
