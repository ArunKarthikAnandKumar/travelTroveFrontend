import React, { useEffect, useRef, useState } from "react";
import type { Continent, Country, State } from "../../../models/Destinations";
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
};

export const CityDrawer: React.FC<Props> = ({
  show,
  onClose,
  onSave,
  editData,
  clearData,
  continentData,
  countryData,
  stateData,
}) => {
  const [name, setName] = useState("");
  const [continent, setContinent] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [popularFor, setPopularFor] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [shortDescImage, setShortDescImage] = useState("");
  const [longDescImage, setLongDescImage] = useState("");
  const [historyImage, seHistoryImage] = useState("");
  const [compressingField, setCompressingField] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [history, setHistory] = useState("");
  const [tips, setTips] = useState<string[]>([]);
  const [adventureActivities, setAdventureActivities] = useState<string[]>([]);
  const [months, setMonths] = useState<string[]>([]);
  const [reason, setReason] = useState("");
 
  const [input, setInput] = useState("");

  const [highlightInput,setHighlightInput]=useState("")
  const [travelTripInput,setTravelTripInput]=useState("")
  const [adventureInput,setAdventureInput]=useState("")



  const handleKeyDownArray = (
    e: React.KeyboardEvent<HTMLInputElement>,
    arr: string[],
    setArr: React.Dispatch<React.SetStateAction<string[]>>,
    name:string,
    inputValue:string,
    setInputValue: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault();
      if (!arr.includes(inputValue.trim())) setArr([...arr, inputValue.trim()]);
     setInputValue("")
      
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

  const handleImageUploadGeneric = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: (v: string) => void,
    fieldName: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const validation = validateImageFile(file, 10);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }
    
    setCompressingField(fieldName);
    try {
      const compressedBase64 = await compressImage(file, 600, 600, 300);
      const sizeInKB = getBase64SizeKB(compressedBase64);
      if (sizeInKB > 400) {
        alert(`Warning: Image compressed to ${sizeInKB.toFixed(0)}KB. For best results, try a smaller image.`);
      }
      setPreview(compressedBase64);
    } catch (error) {
      console.error('Error compressing image:', error);
      alert('Error processing image. Please try again.');
    } finally {
      setCompressingField(null);
    }
  };
  const handleRemoveGenericImage = (
    setPreview: (v: string) => void
  ) => {
    setPreview("");
  };

  

  useEffect(() => {
    if (editData) {
      setName(editData.name || "");
      setContinent(editData.continentId || "");
      setCountry(editData.countryId || "");
      setState(editData.stateId || "");
      setPopularFor(editData.popularFor || "");
      setShortDesc(editData.shortDesc || "");
      setLongDesc(editData.longDesc || "");
      // Format thumbnail for display - extract base64 if backend added path prefix
      const formattedThumbnail = formatThumbnailForDisplay(editData.thumbnail || "");
      setThumbnail(formattedThumbnail);
      if(editData.shortDescImage) {
        const formattedShort = formatThumbnailForDisplay(editData.shortDescImage || "");
        setShortDescImage(formattedShort);
      }
      if(editData.longDescImage) {
        const formattedLong = formatThumbnailForDisplay(editData.longDescImage || "");
        setLongDescImage(formattedLong);
      }
      if(editData.historyImage) {
        const formattedHistory = formatThumbnailForDisplay(editData.historyImage || "");
        seHistoryImage(formattedHistory);
      }
      setHighlights(editData.highlights || []);
      setHistory(editData.history || "");
      setTips(editData.tips || []);
      setAdventureActivities(editData.adventureActivities || []);
      setMonths(editData.bestTimeToVisit?.months || []);
      setReason(editData.bestTimeToVisit?.reason || "");
    }else if(clearData){
      setName("");
      setContinent("");
      setCountry("");
      setState("");
      setPopularFor("");
      setShortDesc("");
      setLongDesc("");
      setThumbnail("");
      setShortDescImage("");
      setLongDescImage("");
      seHistoryImage("");
      setHighlights([]);
      setHistory("");
      setTips([]);
      setAdventureActivities([]);
      setMonths([]);
      setReason("");
    } 
    else {
      setName("");
      setContinent("");
      setCountry("");
      setState("");
      setPopularFor("");
      setShortDesc("");
      setLongDesc("");
      setThumbnail("");
      setShortDescImage("");
      setLongDescImage("");
      seHistoryImage("");
      setHighlights([]);
      setHistory("");
      setTips([]);
      setAdventureActivities([]);
      setMonths([]);
      setReason("");
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
      popularFor,
      shortDesc,
      longDesc,
      highlights,
      history,
      tips,
      adventureActivities,
      bestTimeToVisit: { months, reason },
    };
    
    // Only send thumbnail if it's a valid base64 data URL (newly uploaded image)
    // Check if thumbnail starts with data:image and has substantial content
    if (thumbnail && thumbnail.startsWith('data:image') && thumbnail.length > 100) {
      // Final size check before submitting
      const sizeInKB = getBase64SizeKB(thumbnail);
      if (sizeInKB > 500) {
        alert(`Thumbnail image is too large (${sizeInKB.toFixed(0)}KB). Maximum allowed is 500KB. Please select a smaller image.`);
        return;
      }
      submitData.thumbnail = thumbnail;
    } else if (!editData) {
      // Require file when adding new city
      alert("Please select a thumbnail image");
      return;
    }
    // If editing and no new image, don't include thumbnail (backend will keep existing)
    
    // Handle other images (shortDescImage, longDescImage, historyImage)
    // Only send if they are valid base64 data URLs
    if (shortDescImage && shortDescImage.startsWith('data:image') && shortDescImage.length > 100) {
      const sizeInKB = getBase64SizeKB(shortDescImage);
      if (sizeInKB > 500) {
        alert(`Short description image is too large (${sizeInKB.toFixed(0)}KB). Maximum allowed is 500KB.`);
        return;
      }
      submitData.shortDescImage = shortDescImage;
    }
    
    if (longDescImage && longDescImage.startsWith('data:image') && longDescImage.length > 100) {
      const sizeInKB = getBase64SizeKB(longDescImage);
      if (sizeInKB > 500) {
        alert(`Long description image is too large (${sizeInKB.toFixed(0)}KB). Maximum allowed is 500KB.`);
        return;
      }
      submitData.longDescImage = longDescImage;
    }
    
    if (historyImage && historyImage.startsWith('data:image') && historyImage.length > 100) {
      const sizeInKB = getBase64SizeKB(historyImage);
      if (sizeInKB > 500) {
        alert(`History image is too large (${sizeInKB.toFixed(0)}KB). Maximum allowed is 500KB.`);
        return;
      }
      submitData.historyImage = historyImage;
    }
    
    onSave(submitData);
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
        {editData ? "Edit City Details" : "Add New City"}
      </h5>
      <button type="button" className="btn-close" onClick={onClose}></button>
    </div>

    <div className="drawer-body p-4" style={{ maxHeight: "80vh", overflowY: "auto" }}>
      <form onSubmit={handleSubmit} className="needs-validation">

        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header  fw-semibold">
            Location Details
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Continent</label>
                <select
                  className="form-select"
                  value={continent}
                  onChange={(e) => {
                    setContinent(e.target.value);
                    setCountry("");
                  }}
                >
                  <option value="">Select Continent</option>
                  {continentData.map((conti) => (
                    <option key={conti.id} value={conti.id}>
                      {conti.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Country</label>
                <select
                  className="form-select"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option value="">Select Country</option>
                  {filteredCountries(continent).map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">State</label>
                <select
                  className="form-select"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="">Select State</option>
                  {filteredStates(country).map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header  fw-semibold text-dark">
           City Details
          </div>
          <div className="card-body">
            <label className="form-label fw-semibold">City Name</label>
            <input
              type="text"
              className="form-control mb-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter City Name"
              required
            />

            <label className="form-label fw-semibold">Short Description</label>
            <textarea
              className="form-control mb-2"
              rows={2}
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="Give a quick overview of the city"
            ></textarea>
            <label className="form-label fw-semibold">Long Description</label>
            <textarea
              className="form-control mb-2"
              rows={2}
              value={longDesc}
              onChange={(e) => setLongDesc(e.target.value)}
              placeholder="Give a detailed overview of the city"
            ></textarea>

            

            <label className="form-label fw-semibold mt-3">Thumbnail Image</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={(e) =>
                handleImageUploadGeneric(e, setThumbnail, "thumbnail")
              }
              disabled={compressingField === "thumbnail"}
            />
            {compressingField === "thumbnail" && (
              <div className="mt-2 text-center text-muted">
                <small>Compressing image...</small>
              </div>
            )}
            {thumbnail && compressingField !== "thumbnail" && (
              <div className="mt-3 text-center">
                <img
                  src={thumbnail}
                  alt="Thumbnail Preview"
                  className="rounded shadow-sm"
                  style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger mt-2"
                  onClick={() =>
                    handleRemoveGenericImage(setThumbnail)
                  }
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

       <div className="card shadow-sm border-0 mb-4">
  <div className="card-header fw-semibold">Experiences & Tips</div>
<div className="card-body">
  {[
    {
      label: "Highlights",
      desc: "Describe unique features or memorable moments that make this city stand out.",
      items: highlights,
      setItems: setHighlights,
      inputValue: highlightInput,
      setInputValue: setHighlightInput,
      key: "highlights",
    },
    {
      label: "Travel Tips",
      desc: "Write helpful travel tips or advice for visitors coming to this city.",
      items: tips,
      setItems: setTips,
      inputValue: travelTripInput,
      setInputValue: setTravelTripInput,
      key: "tips",
    },
    {
      label: "Adventure Activities",
      desc: "List or describe thrilling activities or outdoor experiences available here.",
      items: adventureActivities,
      setItems: setAdventureActivities,
      inputValue: adventureInput,
      setInputValue: setAdventureInput,
      key: "adventures",
    },
  ].map(({ label, desc, items, setItems, inputValue, setInputValue, key }) => (
    <div
      key={key}
      className="p-3 mb-4 border rounded-3 shadow-sm bg-white"
      style={{ transition: "0.3s", borderColor: "#dee2e6" }}
    >
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="fw-semibold mb-0 text-dark">{label}</h6>
        </div>
        <p className="text-muted small mb-3">{desc}</p>

        <input
          type="text"
          className="form-control mb-3"
          style={{
            borderRadius: "10px",
            border: "1px solid #ced4da",
            boxShadow: "none",
          }}
          placeholder={`Type and press Enter to add ${label.toLowerCase()}`}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) =>
            handleKeyDownArray(
              e,
              items,
              setItems,
              key,
              inputValue,
              setInputValue
            )
          }
        />

        {/* Sentence-style display */}
        <div className="d-flex flex-column gap-2">
          {items.length === 0 ? (
            <span className="text-muted small fst-italic">
              No {label.toLowerCase()} added yet.
            </span>
          ) : (
            items.map((item, idx) => (
              <div
                key={idx}
                className="d-flex justify-content-between align-items-start p-3 rounded-3 shadow-sm"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #dee2e6",
                  fontSize: "0.95rem",
                  lineHeight: "1.4",
                  color: "#212529",
                }}
              >
                <div className="pe-3">{item}</div>
                <button
                  type="button"
                  className="btn-close"
                  style={{
                    fontSize: "0.75rem",
                    opacity: "0.7",
                    marginTop: "2px",
                  }}
                  onClick={() => removeWord(item, items, setItems)}
                ></button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  ))}
</div>

</div>


        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header fw-semibold text-dark">
          Best Time to Visit
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label fw-semibold">Select Months</label>
              <div className="d-flex flex-wrap gap-2">
                {[
                  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                ].map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`btn btn-sm ${
                      months.includes(m)
                        ? "btn-success"
                        : "btn-outline-secondary"
                    }`}
                    onClick={() =>
                      setMonths((prev) =>
                        prev.includes(m)
                          ? prev.filter((x) => x !== m)
                          : [...prev, m]
                      )
                    }
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <label className="form-label fw-semibold">Reason</label>
            <textarea
              className="form-control"
              rows={2}
              placeholder="Why is this the best time?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-success w-50 me-2 shadow-sm">
            {editData ? "Update City" : "Add City"}
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

