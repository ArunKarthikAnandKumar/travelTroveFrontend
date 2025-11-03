import React, { useEffect, useState, useRef } from "react";
import { compressImage, formatThumbnailForDisplay, validateImageFile, getBase64SizeKB } from "../../../utils/imageUtils";

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
  isPrivate?: boolean;
}

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

type Props = {
  show: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
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
    thumbnail: '',
    isPrivate: false
  });
  
  const [newRequirement, setNewRequirement] = useState('');
  const [newInclusion, setNewInclusion] = useState('');
  const [newExclusion, setNewExclusion] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
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
      setPreviewImage(compressedBase64);
      setFormData(prev => ({ ...prev, thumbnail: compressedBase64 }));
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
    setPreviewImage("");
    setFormData(prev => ({ ...prev, thumbnail: '' }));
    if(fileInputRef.current){
      fileInputRef.current.value = "";
    }
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
    
    // Validate thumbnail for new entries
    if (!editData && !formData.thumbnail) {
      alert("Please select a thumbnail image");
      return;
    }
    
    // Validate thumbnail size if present
    if (formData.thumbnail && typeof formData.thumbnail === 'string') {
      const sizeInKB = getBase64SizeKB(formData.thumbnail);
      if (sizeInKB > 500) {
        alert(`Image is too large (${sizeInKB.toFixed(0)}KB). Maximum allowed is 500KB.`);
        return;
      }
    }
    
    // Prepare JSON data with base64 thumbnail
    const selectedItinerary = itineraries.find((itinerary) => itinerary._id === formData.itineraryId);
    const requestData: any = {
      ...formData,
      // Only send thumbnail if it's a valid base64 data URL
      thumbnail: formData.thumbnail && formData.thumbnail.startsWith("data:image") && formData.thumbnail.length > 100 ? formData.thumbnail : null,
    };
    
    if (selectedItinerary) {
      requestData.itenaryName = selectedItinerary.title;
    }
    
    onSave(requestData);
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
        thumbnail: '',
        isPrivate: false
      });
      setPreviewImage('');
      setFormData(prev => ({ ...prev, thumbnail: '' }));
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
        thumbnail: editData.thumbnail || '',
        isPrivate: editData.isPrivate || false
      });
      if (editData.thumbnail && typeof editData.thumbnail === 'string') {
        const formattedThumbnail = formatThumbnailForDisplay(editData.thumbnail);
        setPreviewImage(formattedThumbnail);
        setFormData(prev => ({ ...prev, thumbnail: editData.thumbnail as string }));
      } else {
        setPreviewImage('');
        setFormData(prev => ({ ...prev, thumbnail: '' }));
      }
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
              <div className="mb-3">
                <label className="form-label">Group Thumbnail {!editData && '*'}</label>
                <div className="d-flex align-items-center">
                  <div className="me-3" style={{ width: '150px', height: '100px', border: '1px dashed #ddd', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover', borderRadius: '4px' }} 
                      />
                    ) : (
                      <span className="text-muted small">No image selected</span>
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
                      disabled={isCompressing}
                    >
                      {isCompressing ? 'Compressing...' : 'Choose File'}
                    </button>
                    {previewImage && (
                      <button 
                        type="button" 
                        className="btn btn-outline-danger btn-sm ms-2"
                        onClick={handleRemoveImage}
                      >
                        Remove
                      </button>
                    )}
                    {isCompressing && (
                      <div className="mt-2 text-muted">
                        <small>Compressing image...</small>
                      </div>
                    )}
                    <div className="form-text mt-1">Recommended size: 800x400px, max 5MB</div>
                  </div>
                </div>
              </div>

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

              <div className="mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isPrivate"
                    checked={formData.isPrivate || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPrivate: e.target.checked }))}
                  />
                  <label className="form-check-label" htmlFor="isPrivate">
                    Private Group (Only invited users can join)
                  </label>
                </div>
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

