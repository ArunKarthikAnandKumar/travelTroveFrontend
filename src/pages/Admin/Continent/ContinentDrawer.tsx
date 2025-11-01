import React, { useEffect, useRef, useState } from "react";
import type { Continent } from "../../../models/Destinations";
import { BASE_URL } from "../../../utils/constatnts";


type Props = {
    show: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    editData: Continent | null;
    clearData:boolean

};

export const ContinentDrawer: React.FC<Props> = ({
    show,
    onClose,
    onSave,
    editData,
    clearData
}) => {
    const [name, setName] = useState("");
    const [shortDesc, setShortDesc] = useState("");
    const [longDesc, setLongDesc] = useState("");
    const [thumbnail, setThumbnail] = useState<string>("");
    const [thumbnailFile,setThumbnailFile]=useState<File|null>(null)
    const fileInputRef=useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (editData) {
            setName(editData.name);
            setShortDesc(editData.shortDesc);
            setLongDesc(editData.longDesc);
            setThumbnail(`${BASE_URL}/${editData.thumbnail}`);
           
        }else if(clearData){
                setName("");
            setShortDesc("");
            setLongDesc("");
            setThumbnail("");

        } 
        else {
            setName("");
            setShortDesc("");
            setLongDesc("");
            setThumbnail("");
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
                <h5 className="fw-bold mb-0">
                    {editData ? "Edit Continent" : "Add Continent"}
                </h5>
                <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

             <div className="drawer-body p-4" style={{ maxHeight: "80vh", overflowY: "auto" }}>
     
                <form onSubmit={handleSubmit} className="needs-validation">
                     <div className="card shadow-sm border-0 mb-4">
          <div className="card-header  fw-semibold text-dark">
           Continent Details
          </div>
          <div className="card-body">
            <label className="form-label fw-semibold">Continent Name</label>
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
               onChange={handleImageUpload}
            />
            {thumbnail && (
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
            {editData ? "Edit Continent" : "Add Continent"}
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