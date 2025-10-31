import React, { useEffect, useRef, useState } from "react";
import { Continent, Country, State } from "../../../models/Destinations"
import { BASE_URL } from "../../../utils/constants";


type Props = {
    show:boolean;
    onClose:() => void;
    onSave:(data: any) => void;
    editData: State | null;
    clearData:boolean
    continentData:Continent[],
    countryData:Country[]
};

export const StateDrawer: React.FC<Props> = ({
    show,
    onClose,
    onSave,
    editData,
    clearData,
    continentData,
    countryData
    
}) => {
    const [name, setName] = useState("");
    const [continent, setContinent] = useState("");
    const [country, setCountry] = useState("");
    const [popularFor,setPopularFor]=useState<string[]>([])
      const [input, setInput] = useState("");

    const [shortDesc, setShortDesc] = useState("");
    const [longDesc, setLongDesc] = useState("");
    const [thumbnail, setThumbnail] = useState<string>("");
    const [thumbnailFile,setThumbnailFile]=useState<File|null>(null)
    const fileInputRef=useRef<HTMLInputElement>(null)

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      if (!popularFor.includes(input.trim())) {
        setPopularFor([...popularFor, input.trim()]);
      }
      setInput("");
    }
  };

  const removeWord = (word: string) => {
    setPopularFor(popularFor.filter((w) => w !== word));
  };

    const filteredCountries=(contiId:string)=>{
        let filteredData=countryData.filter(ele=>ele.continentId==contiId)
        console.log('filtDat',filteredData)
        return filteredData

    }

    useEffect(() => {
        if (editData) {
            let popForArray=editData.popularFor.split(",")
            setContinent(editData.continentId)
            setCountry(editData.countryId)
            setName(editData.name);
            setPopularFor(popForArray)
            setShortDesc(editData.shortDesc);
            setLongDesc(editData.longDesc);
            setThumbnail(`${BASE_URL}/${editData.thumbnail}`);
           
        }
        else {
            setName("");
            setShortDesc("");
            setLongDesc("");
            setThumbnail("");
            setContinent("")
            setPopularFor([])
            setCountry("")
        }
    }, [editData,clearData]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setThumbnailFile(file)
        const reader = new FileReader();
        reader.onloadend = () => setThumbnail(reader.result as string);
        reader.readAsDataURL(file);
    };
    const handleRemoveImage = () => {
        
        setThumbnail("");
        setThumbnailFile(null);
        if(fileInputRef.current){
            fileInputRef.current.value=""
        }
    }
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !shortDesc.trim() || !longDesc.trim()) return;
        onSave({
            id: editData ? editData.id : `Date.now()`,
            name,
            continent,
            country,
            popularFor,
            shortDesc,
            longDesc,
            thumbnail,
            thumbnailFile,
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
    <h5 className="fw-bold mb-0">{editData ? "Edit State" : "Add State"}</h5>
    <button type="button" className="btn-close" onClick={onClose}></button>
  </div>

  <div
    className="drawer-body p-4"
    style={{ maxHeight: "80vh", overflowY: "auto" }}
  >
    <form onSubmit={handleSubmit} className="needs-validation">
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header fw-semibold text-dark">State Details</div>
        <div className="card-body">
          <label className="form-label fw-semibold">
            Select Continent <span className="text-danger">*</span>
          </label>
          <select
            name="continent"
            id="continent"
            className="form-control mb-3"
            value={continent}
            onChange={(e) => {
              setContinent(e.target.value);
              setCountry("");
            }}
            required
          >
            <option value="">Select a Continent</option>
            {continentData.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <label className="form-label fw-semibold">
            Select Country <span className="text-danger">*</span>
          </label>
          <select
            name="country"
            id="country"
            className="form-control mb-3"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          >
            <option value="">Select a Country</option>
            {continent && filteredCountries(continent).length !== 0 ? (
              filteredCountries(continent).map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))
            ) : (
              <option value="">No Data Found For Selected Continent</option>
            )}
          </select>

          <label className="form-label fw-semibold">State Name</label>
          <input
            type="text"
            className="form-control mb-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter State Name"
            required
          />

          <label className="form-label fw-semibold">Short Description</label>
          <textarea
            className="form-control mb-2"
            rows={2}
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            placeholder="Give a quick overview of the state"
          ></textarea>

          <label className="form-label fw-semibold">Long Description</label>
          <textarea
            className="form-control mb-2"
            rows={4}
            value={longDesc}
            onChange={(e) => setLongDesc(e.target.value)}
            placeholder="Give a detailed overview of the state"
          ></textarea>

          <label className="form-label fw-semibold mt-3">Popular For</label>
          <input
            className="form-control mb-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type and press Enter or comma"
          />
          <div
            className="mt-2 p-2 border rounded bg-light"
            style={{
              minHeight: "48px",
              borderColor: "#dee2e6",
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
            }}
          >
            {popularFor.length === 0 ? (
              <span style={{ color: "#6c757d", fontSize: "0.9rem" }}>
                No items added yet.
              </span>
            ) : (
              popularFor.map((word) => (
                <span
                  key={word}
                  className="badge bg-primary d-flex align-items-center"
                  style={{
                    padding: "8px 10px",
                    fontSize: "0.85rem",
                    borderRadius: "12px",
                    display: "inline-flex",
                    gap: "6px",
                  }}
                >
                  {word}
                  <button
                    onClick={() => removeWord(word)}
                    type="button"
                    className="btn-close btn-close-white btn-sm ms-1"
                    aria-label="Remove"
                    style={{
                      fontSize: "0.5rem",
                      opacity: 0.8,
                    }}
                  ></button>
                </span>
              ))
            )}
          </div>

          <label className="form-label fw-semibold mt-3">Thumbnail Image</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleImageUpload}
          />
          {thumbnail && (
            <div className="mt-3 text-center">
              <img
                src={thumbnail}
                alt="Thumbnail Preview"
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

      <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-success w-50 me-2 shadow-sm">
            {editData ? "Edit State" : "Add State"}
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