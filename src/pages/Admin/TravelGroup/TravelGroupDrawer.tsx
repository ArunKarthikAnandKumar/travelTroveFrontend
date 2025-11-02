import React, { useEffect, useState, useRef } from "react";
import { BASE_URL } from "../../../utils/constatnts";

// Define Itinerary type since the import is missing
interface Itinerary {
  _id: string;
  title: string;
  // Add other properties as needed
}

// Define TravelGroup type
interface TravelGroup {
  _id?: string;
  name: string;
  description: string;
  itineraryId: string;
  itineraryName?: string;
  maxMembers: number;
  startDate: string;
  endDate: string;
  pricePerPerson: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  meetingPoint: string;
  meetingTime: string;
  requirements: string[];
  inclusions: string[];
  exclusions: string[];
  thumbnail?: string | File;
}

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

type Props = {
  show: boolean;
  onClose: () => void;
  onSave: (data: FormData) => void;
  editData: TravelGroup | null;
  itineraries: Itinerary[];
  clearData: boolean;
};

export const TravelGroupDrawer: React.FC<Props> = ({
  show,
  onClose,
  onSave,
  editData,
  itineraries,
  clearData
}) => {
  const [formData, setFormData] = useState<TravelGroup>({
    name: '',
    description: '',
    itineraryId: '',
    maxMembers: 10,
    startDate: '',
    endDate: '',
    pricePerPerson: 0,
    status: 'upcoming',
    meetingPoint: '',
    meetingTime: '',
    requirements: [],
    inclusions: [],
    exclusions: [],
    thumbnail: ''
  });
  
  const [newRequirement, setNewRequirement] = useState('');
  const [newInclusion, setNewInclusion] = useState('');
  const [newExclusion, setNewExclusion] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle number input changes
  const handleNumberChange = (name: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle date changes
  const handleDateChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(909)
    if (file) {
      console.log('inside file')
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be smaller than 5MB');
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      setThumbnailFile(file);
    }
  };

 const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setThumbnailFile(file);
  setFormData(prev => ({ ...prev, thumbnail: file }));

  const reader = new FileReader();
  reader.onloadend = () => setPreviewImage(reader.result as string);
  reader.readAsDataURL(file);
};

  
    const handleRemoveImage = () => {
      setPreviewImage("");
      setThumbnailFile(null);
    };
  

  // Handle add item (requirement, inclusion, exclusion)
  const addItem = (type: 'requirement' | 'inclusion' | 'exclusion') => {
    const value = type === 'requirement' ? newRequirement : 
                 type === 'inclusion' ? newInclusion : newExclusion;
    
    if (!value.trim()) {
      alert(`Please enter a ${type}`);
      return;
    }
    
    const field = `${type}s` as 'requirements' | 'inclusions' | 'exclusions';
    
    if (!formData[field].includes(value)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value]
      }));
      
      // Clear input
      if (type === 'requirement') setNewRequirement('');
      else if (type === 'inclusion') setNewInclusion('');
      else setNewExclusion('');
    } else {
      alert(`This ${type} already exists`);
    }
  };

  // Handle remove item
  const removeItem = (type: 'requirements' | 'inclusions' | 'exclusions', item: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter(i => i !== item)
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create FormData object to handle file upload
    const formDataObj = new FormData();
    
    // Append all form fields to FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'thumbnail') {
        return;
      }
      if (Array.isArray(value)) {
        // Handle arrays (requirements, inclusions, exclusions)
        value.forEach(item => formDataObj.append(key, item));
      } else if (value !== null && value !== undefined) {
        formDataObj.append(key, String(value));
      }
    });

    if (thumbnailFile) {
      console.log(thumbnailFile)

      formDataObj.append('thumbnail', thumbnailFile);
    } else if (typeof formData.thumbnail === 'string' && formData.thumbnail) {
      console.log(1234)
      formDataObj.append('thumbnail', formData.thumbnail);
    }

    if (formData.itineraryId) {
      console.log(itineraries)
      formDataObj.set('itineraryId', formData.itineraryId);
      formDataObj.set('itineraryId', formData.itineraryId);
      const selectedItinerary = itineraries.find((itinerary) => itinerary._id === formData.itineraryId);
      if (selectedItinerary) {
        formDataObj.set('itenaryName', selectedItinerary.title);
        formDataObj.set('itenaryName', selectedItinerary.title);
      }
    }
    
    onSave(formDataObj);
  };

  // Reset form when clearData changes
  useEffect(() => {
    if (clearData) {
      setFormData({
        name: '',
        description: '',
        itineraryId: '',
        maxMembers: 10,
        startDate: '',
        endDate: '',
        pricePerPerson: 0,
        status: 'upcoming',
        meetingPoint: '',
        meetingTime: '',
        requirements: [],
        inclusions: [],
        exclusions: [],
        thumbnail: ''
      });
      setPreviewImage('');
      setThumbnailFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [clearData]);

  // Set form data when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || '',
        description: editData.description || '',
        itineraryId: editData.itineraryId || '',
        maxMembers: editData.maxMembers || 10,
        startDate: editData.startDate ? new Date(editData.startDate).toISOString().split('T')[0] : '',
        endDate: editData.endDate ? new Date(editData.endDate).toISOString().split('T')[0] : '',
        pricePerPerson: editData.pricePerPerson || 0,
        status: editData.status || 'upcoming',
        meetingPoint: editData.meetingPoint || '',
        meetingTime: editData.meetingTime || '',
        requirements: editData.requirements || [],
        inclusions: editData.inclusions || [],
        exclusions: editData.exclusions || [],
        thumbnail: editData.thumbnail || ''
      });
      setThumbnailFile(null);

      if (editData.thumbnail && typeof editData.thumbnail === 'string') {
        setPreviewImage(`${BASE_URL}/${editData.thumbnail}`);
      } else if (editData.thumbnail instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(editData.thumbnail);
      }
    } else {
      setThumbnailFile(null);
    }
  }, [editData]);

  if (!show) return null;

  return (
    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg" style={{ maxWidth: '900px' }}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{editData ? 'Edit' : 'Add New'} Travel Group</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <form onSubmit={handleSubmit}>
              {/* Thumbnail Upload */}
              {/* <div className="mb-3">
                <label className="form-label">Group Thumbnail</label>
                <div className="d-flex align-items-center">
                  <div className="me-3" style={{ width: '150px', height: '100px', border: '1px dashed #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                      />
                    ) : (
                      <span>No image selected</span>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose File
                    </button>
                    <div className="form-text">Recommended size: 800x400px, max 5MB</div>
                  </div>
                </div>
              </div> */}

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Group Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Itinerary *</label>
                  <select 
                    className="form-select"
                    name="itineraryId"
                    value={formData.itineraryId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Itinerary</option>
                    {itineraries.map(itinerary => (
                      <option key={itinerary._id} value={itinerary._id}>
                        {itinerary.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Start Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">End Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Max Members *</label>
                  <input
                    type="number"
                    className="form-control"
                    name="maxMembers"
                    min="1"
                    value={formData.maxMembers}
                    onChange={(e) => handleNumberChange('maxMembers', parseInt(e.target.value) || 0)}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Price Per Person (INR) *</label>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      className="form-control"
                      name="pricePerPerson"
                      value={formData.pricePerPerson}
                      onChange={(e) => handleNumberChange('pricePerPerson', parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Status *</label>
                  <select 
                    className="form-select"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Meeting Point *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="meetingPoint"
                    value={formData.meetingPoint}
                    onChange={handleInputChange}
                    placeholder="E.g., Main Airport, Hotel Lobby"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Meeting Time *</label>
                <input
                  type="text"
                  className="form-control"
                  name="meetingTime"
                  value={formData.meetingTime}
                  onChange={handleInputChange}
                  placeholder="E.g., 9:00 AM at the hotel lobby"
                  required
                />
              </div>

              {/* Requirements */}
              <div className="mb-3">
                <label className="form-label">Requirements</label>
                <div className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="E.g., Passport, Hiking shoes, etc."
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                  />
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={() => addItem('requirement')}
                  >
                    Add
                  </button>
                </div>
                <div className="d-flex flex-wrap gap-1">
                  {formData.requirements.map((item, index) => (
                    <span key={index} className="badge bg-secondary me-1 mb-1">
                      {item}
                      <button 
                        type="button" 
                        className="btn-close btn-close-white ms-2" 
                        style={{ fontSize: '0.5rem' }}
                        onClick={() => removeItem('requirements', item)}
                        aria-label="Remove"
                      ></button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Inclusions */}
              <div className="mb-3">
                <label className="form-label">Inclusions</label>
                <div className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="E.g., Airport transfers, Breakfast, etc."
                    value={newInclusion}
                    onChange={(e) => setNewInclusion(e.target.value)}
                  />
                  <button 
                    className="btn btn-outline-primary" 
                    type="button"
                    onClick={() => addItem('inclusion')}
                  >
                    Add
                  </button>
                </div>
                <div className="d-flex flex-wrap gap-1">
                  {formData.inclusions.map((item, index) => (
                    <span key={index} className="badge bg-primary me-1 mb-1">
                      {item}
                      <button 
                        type="button" 
                        className="btn-close btn-close-white ms-2" 
                        style={{ fontSize: '0.5rem' }}
                        onClick={() => removeItem('inclusions', item)}
                        aria-label="Remove"
                      ></button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Exclusions */}
              <div className="mb-3">
                <label className="form-label">Exclusions</label>
                <div className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="E.g., Airfare, Travel insurance, etc."
                    value={newExclusion}
                    onChange={(e) => setNewExclusion(e.target.value)}
                  />
                  <button 
                    className="btn btn-outline-danger" 
                    type="button"
                    onClick={() => addItem('exclusion')}
                  >
                    Add
                  </button>
                </div>
                <div className="d-flex flex-wrap gap-1">
                  {formData.exclusions.map((item, index) => (
                    <span key={index} className="badge bg-danger me-1 mb-1">
                      {item}
                      <button 
                        type="button" 
                        className="btn-close btn-close-white ms-2" 
                        style={{ fontSize: '0.5rem' }}
                        onClick={() => removeItem('exclusions', item)}
                        aria-label="Remove"
                      ></button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="d-flex justify-content-end mt-4">
                <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editData ? 'Update' : 'Create'} Travel Group
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

