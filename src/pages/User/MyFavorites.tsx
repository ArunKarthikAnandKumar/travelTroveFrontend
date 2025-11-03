import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyFavorites, removeDestinationFromFavorites, removeItineraryFromFavorites } from '../../api/userServices';
import { BASE_URL } from '../../utils/constatnts';
import { formatThumbnailForDisplay, PLACEHOLDER_IMAGE } from '../../utils/imageUtils';
import DestinationCard from '../../components/DestinationCard';

const MyFavorites: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await getMyFavorites();
      if (response.error) {
        setError(response.message);
      } else {
        setFavorites(response.data);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDestination = async (destinationId: string) => {
    if (!window.confirm('Are you sure you want to remove this destination from favorites?')) {
      return;
    }

    try {
      await removeDestinationFromFavorites(destinationId);
      fetchFavorites(); // Refresh list
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to remove favorite');
    }
  };

  const handleRemoveItinerary = async (itineraryId: string) => {
    if (!window.confirm('Are you sure you want to remove this itinerary from favorites?')) {
      return;
    }

    try {
      await removeItineraryFromFavorites(itineraryId);
      fetchFavorites(); // Refresh list
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to remove favorite');
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

  const destinations = favorites?.destinations || [];
  const itineraries = favorites?.itineraries || [];

  return (
    <div className="container my-5">
      <div className="mb-4">
        <h2 className="mb-3">
          <i className="bi bi-heart-fill text-danger me-2"></i>
          My Favorites
        </h2>
        <p className="text-muted">Manage your favorite destinations and itineraries</p>
      </div>

      {/* Destinations Section */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Favorite Destinations</h4>
          <span className="badge bg-primary">{destinations.length}</span>
        </div>

        {destinations.length > 0 ? (
          <div className="row">
            {destinations.map((destination: any) => (
              <div key={destination._id || destination.id} className="col-md-6 col-lg-4 mb-4">
                <div className="position-relative">
                  <DestinationCard destination={destination} />
                  <div className="position-absolute top-0 end-0 m-2">
                    <button
                      className="btn btn-sm btn-danger rounded-circle"
                      onClick={() => handleRemoveDestination(destination._id || destination.id)}
                      title="Remove from favorites"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info">
            No favorite destinations yet. Explore destinations and add them to your favorites!
          </div>
        )}
      </div>

      {/* Itineraries Section */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Favorite Itineraries</h4>
          <span className="badge bg-primary">{itineraries.length}</span>
        </div>

        {itineraries.length > 0 ? (
          <div className="row">
            {itineraries.map((itinerary: any) => (
              <div key={itinerary._id || itinerary.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100">
                  <div className="position-relative">
                    <img
                      className="card-img-top"
                      src={formatThumbnailForDisplay(itinerary.thumbnail, BASE_URL)}
                      alt={itinerary.title}
                      style={{ height: '200px', objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                      }}
                    />
                    <div className="position-absolute top-0 end-0 m-2">
                      <button
                        className="btn btn-sm btn-danger rounded-circle"
                        onClick={() => handleRemoveItinerary(itinerary._id || itinerary.id)}
                        title="Remove from favorites"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{itinerary.title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      {itinerary.durationDays} Days
                    </h6>
                    <p className="card-text">
                      {itinerary.city}, {itinerary.country}
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-primary">{itinerary.type}</span>
                      {itinerary.avgRating > 0 && (
                        <small className="text-muted">
                          ⭐ {itinerary.avgRating.toFixed(1)}
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info">
            No favorite itineraries yet. Browse itineraries and add them to your favorites!
          </div>
        )}
      </div>

      {/* Empty State */}
      {destinations.length === 0 && itineraries.length === 0 && (
        <div className="card text-center py-5">
          <div className="card-body">
            <i className="bi bi-heart-fill text-muted mb-3" style={{ fontSize: '4rem' }}></i>
            <h4 className="text-muted">No favorites yet</h4>
            <p className="text-muted">
              Start exploring destinations and itineraries to add them to your favorites collection.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/')}
            >
              Explore Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyFavorites;

