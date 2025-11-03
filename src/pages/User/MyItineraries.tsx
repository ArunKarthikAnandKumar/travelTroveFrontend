import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllItineraries } from '../../api/userServices';
import { BASE_URL } from '../../utils/constatnts';
import { formatThumbnailForDisplay, PLACEHOLDER_IMAGE } from '../../utils/imageUtils';
import { getToken } from '../../utils/token';

const MyItineraries: React.FC = () => {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      setLoading(true);
      const response = await getAllItineraries();
      if (response.error === false) {
        setItineraries(response.data.itineraryData || []);
      } else {
        setError(response.message || 'Failed to fetch itineraries');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to fetch itineraries');
    } finally {
      setLoading(false);
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

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">
          <h5 className="alert-heading">Error</h5>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-3">My Itineraries</h2>
          <p className="text-muted">Manage your travel itineraries</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            const token = getToken();
            if (!token) {
              alert('Please login to create an itinerary');
              navigate('/login');
              return;
            }
            navigate('/user/create-itinerary');
          }}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Create Itinerary
        </button>
      </div>

      {itineraries.length > 0 ? (
        <div className="row">
          {itineraries.map((itinerary) => (
            <div key={itinerary.id || itinerary._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <img
                  className="card-img-top"
                  src={formatThumbnailForDisplay(itinerary.thumbnail, BASE_URL)}
                  alt={itinerary.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                  }}
                />
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2" style={{ gap: '0.5rem' }}>
                    <h5 className="card-title h5 mb-0" style={{ wordWrap: 'break-word', overflowWrap: 'break-word', flex: '1', minWidth: 0 }}>{itinerary.title}</h5>
                    <span className="badge bg-primary" style={{ flexShrink: 0 }}>{itinerary.type}</span>
                  </div>
                  
                  <h6 className="card-subtitle text-muted mb-3">
                    <i className="bi bi-geo-alt-fill me-2"></i>
                    {itinerary.city}, {itinerary.country}
                  </h6>
                  
                  <p className="card-text flex-grow-1">
                    {itinerary.overview || 'No description available'}
                  </p>
                  
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-calendar me-2 text-muted"></i>
                      <small className="text-muted">
                        {itinerary.durationDays} Days
                      </small>
                    </div>
                    {itinerary.avgRating > 0 && (
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-star-fill text-warning me-2"></i>
                        <small className="text-muted">
                          {itinerary.avgRating.toFixed(1)} ({itinerary.reviews?.length || 0} reviews)
                        </small>
                      </div>
                    )}
                    {itinerary.priceRange && (
                      <span className="badge bg-success mt-2">
                        {itinerary.priceRange}
                      </span>
                    )}
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm flex-fill"
                      onClick={() => {
                        const itineraryId = itinerary.id || itinerary._id;
                        navigate(`/itineraries/${itineraryId}`);
                      }}
                    >
                      <i className="bi bi-eye me-2"></i>
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-5">
          <div className="card-body">
            <i className="bi bi-calendar text-muted mb-3" style={{ fontSize: '4rem' }}></i>
            <h4 className="text-muted">No itineraries yet</h4>
            <p className="text-muted">
              Create your first travel itinerary and start planning your next adventure!
            </p>
            <button 
              className="btn btn-primary" 
              onClick={() => {
                const token = getToken();
                if (!token) {
                  alert('Please login to create an itinerary');
                  navigate('/login');
                  return;
                }
                navigate('/user/create-itinerary');
              }}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Create Itinerary
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyItineraries;

