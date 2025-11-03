import React, { useEffect, useRef, useState } from "react";
import type { Continent, Country } from "../../../models/Destinations";
import { compressImage, formatThumbnailForDisplay, validateImageFile, getBase64SizeKB } from "../../../utils/imageUtils";


type Props = {
    show:boolean;
    onClose:() => void;
    onSave:(data: any) => void;
    editData: Country | null;
    clearData:boolean
    continentData:Continent[]
};

export const CountryDrawer: React.FC<Props> = ({
    show,
    onClose,
    onSave,
    editData,
    clearData,
    continentData
}) => {
    const [name, setName] = useState("");
    const [continent, setContinent] = useState("");
    const [shortDesc, setShortDesc] = useState("");
    const [longDesc, setLongDesc] = useState("");
    const [thumbnail, setThumbnail] = useState<string>("");
    const [isCompressing, setIsCompressing] = useState(false);
    const fileInputRef=useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (editData) {
            setContinent(editData.continentId)
            setName(editData.name);
            setShortDesc(editData.shortDesc);
            setLongDesc(editData.longDesc);
            // Format thumbnail for display - extract base64 if backend added path prefix
            const formattedThumbnail = formatThumbnailForDisplay(editData.thumbnail || "");
            setThumbnail(formattedThumbnail);
           
        }else if(clearData){
                setName("");
            setShortDesc("");
            setLongDesc("");
            setThumbnail("");
            setContinent("")

        } 
        else {
            setName("");
            setShortDesc("");
            setLongDesc("");
            setThumbnail("");
            setContinent("")
        }
    }, [editData,clearData]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        // Validate file
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
            fileInputRef.current.value=""
        }
    }
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !shortDesc.trim() || !longDesc.trim()) return;
        
        // Prepare data object
        const submitData: any = {
            id: editData ? editData.id : `Date.now()`,
            name,
            continent,
            shortDesc,
            longDesc
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
            // Require file when adding new country
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
  }}
>
  <div className="drawer-header border-bottom bg-white shadow-sm p-3 d-flex justify-content-between align-items-center">
    <h5 className="fw-bold mb-0">
      {editData ? "Edit Country" : "Add Country"}
    </h5>
    <button type="button" className="btn-close" onClick={onClose}></button>
  </div>

  <div
    className="drawer-body p-4"
    style={{ maxHeight: "80vh", overflowY: "auto" }}
  >
    <form onSubmit={handleSubmit} className="needs-validation">
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header fw-semibold text-dark">Country Details</div>
        <div className="card-body">
          <label className="form-label fw-semibold">
            Select Continent <span className="text-danger">*</span>
          </label>
          <select
            name="continent"
            id="continent"
            className="form-control mb-3"
            value={continent}
            onChange={(e) => setContinent(e.target.value)}
            required
          >
            <option value="">Select a Continent</option>
            {continentData.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <label className="form-label fw-semibold">Country Name</label>
          <input
            type="text"
            className="form-control mb-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Country Name"
            required
          />

          <label className="form-label fw-semibold">Short Description</label>
          <textarea
            className="form-control mb-2"
            rows={2}
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            placeholder="Give a quick overview of the country"
          ></textarea>

          <label className="form-label fw-semibold">Long Description</label>
          <textarea
            className="form-control mb-2"
            rows={4}
            value={longDesc}
            onChange={(e) => setLongDesc(e.target.value)}
            placeholder="Give a detailed overview of the country"
          ></textarea>

          <label className="form-label fw-semibold mt-3">Thumbnail Image</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="form-control"
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
            {editData ? "Edit Country" : "Add Country"}
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