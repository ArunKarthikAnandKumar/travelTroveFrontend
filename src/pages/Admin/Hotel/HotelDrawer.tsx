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

export const HotelDrawer: React.FC<Props> = ({
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
  const [name, setName] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [rating, setRating] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [roomTypes, setRoomTypes] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [popularFor, setPopularFor] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [tips, setTips] = useState<string[]>([]);
  const [nearbyAttractions, setNearbyAttractions] = useState<string[]>([]);
  const [bestMonths, setBestMonths] = useState<string[]>([]);
  const [bestReason, setBestReason] = useState("");

  const [input, setInput] = useState({
    roomType: "",
    amenity: "",
    facility: "",
    popular: "",
    highlight: "",
    tip: "",
    nearby: "",
    month: "",
  });

  const handleKeyDownArray = (
    e: React.KeyboardEvent<HTMLInputElement>,
    key: keyof typeof input,
    arr: string[],
    setArr: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if ((e.key === "Enter" || e.key === ",") && input[key].trim()) {
      e.preventDefault();
      if (!arr.includes(input[key].trim()))
        setArr([...arr, input[key].trim()]);
      setInput({ ...input, [key]: "" });
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
      setName(editData.name || "");
      setContinent(editData.continentId || "");
      setCountry(editData.countryId || "");
      setState(editData.stateId || "");
      setCity(editData.cityId || "");
      setShortDesc(editData.shortDesc || "");
      setLongDesc(editData.longDesc || "");
      setThumbnail(
        editData.thumbnail ? `${BASE_URL}/${editData.thumbnail}` : ""
      );
      setRating(editData.rating || "");
      setPriceRange(editData.priceRange || "");
      setRoomTypes(editData.roomTypes || []);
      setAmenities(editData.amenities || []);
      setFacilities(editData.facilities || []);
      setPopularFor(editData.popularFor || []);
      setCheckInTime(editData.checkInTime || "");
      setCheckOutTime(editData.checkOutTime || "");
      setContactNumber(editData.contactNumber || "");
      setEmail(editData.email || "");
      setWebsite(editData.website || "");
      setAddress(editData.location?.address || "");
      setLatitude(editData.location?.latitude || "");
      setLongitude(editData.location?.longitude || "");
      setNearbyAttractions(editData.location?.nearbyAttractions || []);
      setHighlights(editData.highlights || []);
      setTips(editData.tips || []);
      setBestMonths(editData.bestTimeToVisit?.months || []);
      setBestReason(editData.bestTimeToVisit?.reason || "");
    } else {
      setName("");
      setContinent("");
      setCountry("");
      setState("");
      setCity("");
      setShortDesc("");
      setLongDesc("");
      setThumbnail("");
      setRating("");
      setPriceRange("");
      setRoomTypes([]);
      setAmenities([]);
      setFacilities([]);
      setPopularFor([]);
      setCheckInTime("");
      setCheckOutTime("");
      setContactNumber("");
      setEmail("");
      setWebsite("");
      setAddress("");
      setLatitude("");
      setLongitude("");
      setNearbyAttractions([]);
      setHighlights([]);
      setTips([]);
      setBestMonths([]);
      setBestReason("");
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
      rating,
      priceRange,
      roomTypes,
      amenities,
      facilities,
      popularFor,
      checkInTime,
      checkOutTime,
      contactNumber,
      email,
      website,
      location: { address, latitude, longitude, nearbyAttractions },
      highlights,
      tips,
      bestTimeToVisit: { months: bestMonths, reason: bestReason },
    });
  };

  return (
    <div
      className={`offcanvas offcanvas-end ${show ? "show" : ""}`}
      style={{
        width: window.innerWidth < 768 ? "100%" : "800px",
        background: "#f8f9fa",
        display: show ? "block" : "none",
      }}
    >
      <div
        className="offcanvas-header border-bottom"
        style={{ background: "#fff" }}
      >
        <h5 className="fw-bold mb-0">
          {editData ? "Edit Hotel Details" : "Add New Hotel"}
        </h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>

      <div
        className="offcanvas-body p-4"
        style={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        <form onSubmit={handleSubmit}>
          {/* Location */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header fw-semibold">Location</div>
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
                    {filteredCities(state).map((ct) => (
                      <option key={ct.id} value={ct.id}>
                        {ct.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Hotel Info */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header fw-semibold">Hotel Info</div>
            <div className="card-body">
              <label className="form-label fw-semibold">Hotel Name</label>
              <input
                type="text"
                className="form-control mb-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <label className="form-label fw-semibold">Short Description</label>
              <textarea
                className="form-control mb-3"
                rows={2}
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
              />
              <label className="form-label fw-semibold">Long Description</label>
              <textarea
                className="form-control mb-3"
                rows={3}
                value={longDesc}
                onChange={(e) => setLongDesc(e.target.value)}
              />
               <label className="form-label fw-semibold">Price Range</label>
              <input
                className="form-control col-md-6"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                 placeholder="	₹10,000–₹25,000 per night"
              />
              <label className="form-label fw-semibold">Ratings</label>
              <input
                className="form-control col-md-6"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="0 - 5"
              />
              <label className="form-label fw-semibold">Address</label>
              <textarea
                className="form-control col-md-6"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
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

          {/* Array Inputs (Amenities, Facilities, etc.) */}
          {[
            { label: "Room Types", key: "roomType", arr: roomTypes, setArr: setRoomTypes },
           
            { label: "Amenities", key: "amenity", arr: amenities, setArr: setAmenities },
            { label: "Facilities", key: "facility", arr: facilities, setArr: setFacilities },
            { label: "Popular For", key: "popular", arr: popularFor, setArr: setPopularFor },
            { label: "Nearby Attractions", key: "nearby", arr: nearbyAttractions, setArr: setNearbyAttractions },
          ].map((field, idx) => (
            <div key={idx} className="card border-0 shadow-sm mb-4">
              <div className="card-header fw-semibold">{field.label}</div>
              <div className="card-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder={`Type and press Enter to add ${field.label}`}
                  value={input[field.key as keyof typeof input]}
                  onChange={(e) =>
                    setInput({ ...input, [field.key]: e.target.value })
                  }
                  onKeyDown={(e) =>
                    handleKeyDownArray(
                      e,
                      field.key as keyof typeof input,
                      field.arr,
                      field.setArr
                    )
                  }
                />
                {field.arr.map((item, i) => (
                  <div
                    key={i}
                    className="d-flex justify-content-between align-items-start p-2 rounded border mb-2 bg-white"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      className="btn-close"
                      style={{ fontSize: "0.7rem" }}
                      onClick={() => removeItem(item, field.arr, field.setArr)}
                    ></button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Contact & Timing */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header fw-semibold">Contact & Timings</div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Check-In Time</label>
                  <input
                    type="text"
                    className="form-control"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Check-Out Time</label>
                  <input
                    type="text"
                    className="form-control"
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Contact Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="col-md-12">
                  <label className="form-label">Website</label>
                  <input
                    type="text"
                    className="form-control"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Seasonal Info */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header fw-semibold">Seasonal Info</div>
            <div className="card-body">
              <label className="form-label">Best Time (Months)</label>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Type and press Enter"
                value={input.month}
                onChange={(e) => setInput({ ...input, month: e.target.value })}
                onKeyDown={(e) =>
                  handleKeyDownArray(e, "month", bestMonths, setBestMonths)
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
              <label className="form-label mt-3">Reason</label>
              <textarea
                className="form-control"
                rows={2}
                value={bestReason}
                onChange={(e) => setBestReason(e.target.value)}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="d-flex justify-content-between">
            <button
              type="submit"
              className="btn btn-success w-50 me-2 shadow-sm"
            >
              {editData ? "Update Hotel" : "Add Hotel"}
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
