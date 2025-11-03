import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { compressImage, validateImageFile, getBase64SizeKB } from "../../utils/imageUtils";
import {
  getAllItineraries,
  createTravelGroup,
} from "../../api/userServices";
import { getToken } from "../../utils/token";

interface Itinerary {
  _id: string;
  title: string;
}

const CreateTravelGroup: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    itineraryId: '',
    maxMembers: 10,
    startDate: '',
    endDate: '',
    pricePerPerson: 0,
    status: 'upcoming' as 'upcoming' | 'ongoing' | 'completed' | 'cancelled',
    meetingPoint: '',
    meetingTime: '',
    requirements: [] as string[],
    inclusions: [] as string[],
    exclusions: [] as string[],
    isPrivate: false,
    thumbnail: ''
  });

  const [newRequirement, setNewRequirement] = useState('');
  const [newInclusion, setNewInclusion] = useState('');
  const [newExclusion, setNewExclusion] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      setLoading(true);
      const response = await getAllItineraries();
      setItineraries(response.data?.itineraryData || []);
    } catch (error: any) {
      alert('Failed to load itineraries. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (name: string, value: number) => {
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
      if (fileInputRef.current) {
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
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage("");
    setFormData(prev => ({ ...prev, thumbnail: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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

      if (type === 'requirement') setNewRequirement('');
      else if (type === 'inclusion') setNewInclusion('');
      else setNewExclusion('');
    } else {
      alert(`This ${type} already exists`);
    }
  };

  const removeItem = (type: 'requirements' | 'inclusions' | 'exclusions', item: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter(i => i !== item)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.thumbnail) {
      alert("Please select a thumbnail image");
      return;
    }

    if (formData.thumbnail && typeof formData.thumbnail === 'string') {
      const sizeInKB = getBase64SizeKB(formData.thumbnail);
      if (sizeInKB > 500) {
        alert(`Image is too large (${sizeInKB.toFixed(0)}KB). Maximum allowed is 500KB.`);
        return;
      }
    }

    try {
      setSubmitting(true);
      const selectedItinerary = itineraries.find((itinerary) => itinerary._id === formData.itineraryId);

      // Send as JSON with base64 thumbnail (backend route expects JSON)
      const requestData: any = {
        name: formData.name,
        description: formData.description,
        itineraryId: formData.itineraryId,
        itenaryName: selectedItinerary?.title || '',
        maxMembers: formData.maxMembers,
        startDate: formData.startDate,
        endDate: formData.endDate,
        pricePerPerson: formData.pricePerPerson,
        status: formData.status,
        meetingPoint: formData.meetingPoint,
        meetingTime: formData.meetingTime,
        requirements: JSON.stringify(formData.requirements),
        inclusions: JSON.stringify(formData.inclusions),
        exclusions: JSON.stringify(formData.exclusions),
        isPrivate: formData.isPrivate.toString(),
        thumbnail: formData.thumbnail && formData.thumbnail.startsWith("data:image") && formData.thumbnail.length > 100 ? formData.thumbnail : null,
      };

      const response = await createTravelGroup(requestData);
      if (response.success || response.error === false) {
        alert(response.message || "Travel group created successfully!");
        navigate('/user/travel-groups');
      } else {
        alert(response.message || "Failed to create travel group");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to create travel group. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Create New Travel Group</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/user/travel-groups')}>
          <i className="bi bi-arrow-left"></i> Back
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header fw-semibold">Basic Information</div>
          <div className="card-body">
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
                  checked={formData.isPrivate}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPrivate: e.target.checked }))}
                />
                <label className="form-check-label" htmlFor="isPrivate">
                  Private Group (Only invited users can join)
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header fw-semibold">Group Details</div>
          <div className="card-body">
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
          </div>
        </div>

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header fw-semibold">Requirements</div>
          <div className="card-body">
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
        </div>

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header fw-semibold">Inclusions</div>
          <div className="card-body">
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
        </div>

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header fw-semibold">Exclusions</div>
          <div className="card-body">
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
        </div>

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header fw-semibold">Thumbnail *</div>
          <div className="card-body">
            <input
              type="file"
              className="form-control"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              disabled={isCompressing}
            />
            {isCompressing && (
              <div className="mt-2 text-muted">
                <small>Compressing image...</small>
              </div>
            )}
            {previewImage && !isCompressing && (
              <div className="mt-3 text-center">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="rounded shadow-sm"
                  style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }}
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
          <button type="submit" className="btn btn-success w-50 me-2 shadow-sm" disabled={submitting}>
            {submitting ? "Creating..." : "Create Travel Group"}
          </button>
          <button type="button" className="btn btn-secondary w-50 shadow-sm" onClick={() => navigate('/user/travel-groups')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTravelGroup;

