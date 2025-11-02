import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getItineraryById,
  addItineraryReview,
  addItineraryToFavorites,
  removeItineraryFromFavorites,
} from '../../api/userServices';
import { getToken } from '../../utils/token';
import { BASE_URL } from '../../utils/constatnts';

const ItineraryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const isAuthenticated = !!getToken();

  useEffect(() => {
    fetchItinerary();
  }, [id]);

  const fetchItinerary = async () => {
    try {
      setLoading(true);
      const response = await getItineraryById(id!);
      if (response.error) {
        setError(response.message);
      } else {
        setItinerary(response.data);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to fetch itinerary details');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      alert('Please login to add favorites');
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await removeItineraryFromFavorites(id!);
        setIsFavorite(false);
      } else {
        await addItineraryToFavorites(id!);
        setIsFavorite(true);
      }
    } catch (error) {
      alert('Failed to update favorite');
    }
  };

  const handleAddReview = async () => {
    if (!isAuthenticated) {
      alert('Please login to leave a review');
      navigate('/login');
      return;
    }

    if (reviewRating < 1 || reviewRating > 5) {
      alert('Please select a rating between 1 and 5');
      return;
    }

    try {
      setSubmittingReview(true);
      await addItineraryReview(id!, { rating: reviewRating, comment: reviewComment });
      alert('Review added successfully!');
      setReviewRating(0);
      setReviewComment('');
      setShowReviewForm(false);
      fetchItinerary();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    return (
      <div className="d-flex align-items-center">
        {[...Array(5)].map((_, i) => (
          <i
            key={i}
            className={`bi ${i < fullStars ? 'bi-star-fill' : 'bi-star'} text-warning`}
            style={{ fontSize: '1.2rem' }}
          />
        ))}
        <span className="ms-2">{rating.toFixed(1)}</span>
      </div>
    );
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

  if (error || !itinerary) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">
          <h5 className="alert-heading">Error</h5>
          <p>{error || 'Itinerary not found'}</p>
          <button className="btn btn-primary" onClick={() => navigate('/user/my-itineraries')}>
            Back to Itineraries
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5 detail-page">
      <div className="mb-4">
        <button className="btn btn-outline-secondary mb-3" onClick={() => navigate('/user/my-itineraries')}>
          <i className="bi bi-arrow-left me-2"></i>Back to Itineraries
        </button>
      </div>

      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-md-8">
          <h1 className="mb-3" style={{ wordWrap: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal' }}>{itinerary.title}</h1>
          <div className="d-flex align-items-center mb-3">
            <i className="bi bi-geo-alt-fill me-2 text-primary"></i>
            <span className="me-4">
              {itinerary.city}, {itinerary.state}, {itinerary.country}
            </span>
            <span className="badge bg-primary me-2">{itinerary.type}</span>
            {itinerary.priceRange && (
              <span className="badge bg-success">{itinerary.priceRange}</span>
            )}
          </div>
          {itinerary.avgRating > 0 && (
            <div className="mb-3">
              {renderStars(itinerary.avgRating)}
              <span className="text-muted ms-2">
                ({itinerary.reviews?.length || 0} reviews)
              </span>
            </div>
          )}
          <div className="mb-3">
            <i className="bi bi-calendar me-2"></i>
            <strong>Duration:</strong> {itinerary.durationDays} Days
          </div>
        </div>
        <div className="col-md-4 text-end">
          {isAuthenticated && (
            <button
              className="btn btn-outline-danger mb-2"
              onClick={handleToggleFavorite}
            >
              <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'} me-2`}></i>
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          )}
        </div>
      </div>

      {/* Thumbnail */}
      {itinerary.thumbnail && (
        <div className="mb-4">
          <img
            src={`${BASE_URL}/${itinerary.thumbnail}`}
            alt={itinerary.title}
            className="img-fluid rounded"
            style={{ maxHeight: '500px', width: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Overview */}
      {itinerary.overview && (
        <div className="mb-4">
          <h3>Overview</h3>
          <p className="lead">{itinerary.overview}</p>
        </div>
      )}

      {/* Days Itinerary */}
      {itinerary.days && itinerary.days.length > 0 && (
        <div className="mb-4">
          <h3>Itinerary Details</h3>
          {itinerary.days.map((day: any, index: number) => (
            <div key={index} className="card mb-3">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Day {index + 1}</h5>
              </div>
              <div className="card-body">
                {day.title && <h6 className="card-title">{day.title}</h6>}
                {day.description && <p className="card-text">{day.description}</p>}
                
                {day.attractions && day.attractions.length > 0 && (
                  <div className="mb-3">
                    <strong>Attractions:</strong>
                    <ul className="list-unstyled ms-3">
                      {day.attractions.map((attr: any, i: number) => (
                        <li key={i}>
                          <i className="bi bi-geo-alt me-2"></i>
                          {attr.attractionName || attr.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {day.meals && (
                  <div className="mb-3">
                    <strong>Meals:</strong>
                    <ul className="list-unstyled ms-3">
                      {day.meals.breakfast && (
                        <li><i className="bi bi-sun me-2"></i>Breakfast: {day.meals.breakfast.restaurantName}</li>
                      )}
                      {day.meals.lunch && (
                        <li><i className="bi bi-sun-fill me-2"></i>Lunch: {day.meals.lunch.restaurantName}</li>
                      )}
                      {day.meals.dinner && (
                        <li><i className="bi bi-moon me-2"></i>Dinner: {day.meals.dinner.restaurantName}</li>
                      )}
                    </ul>
                  </div>
                )}

                {day.hotelStay && (
                  <div>
                    <strong>Hotel:</strong>
                    <span className="ms-2">
                      <i className="bi bi-house-door me-2"></i>
                      {day.hotelStay.hotelName}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inclusions & Exclusions */}
      <div className="row mb-4">
        {itinerary.inclusions && itinerary.inclusions.length > 0 && (
          <div className="col-md-6">
            <h4>Inclusions</h4>
            <ul>
              {itinerary.inclusions.map((inc: string, i: number) => (
                <li key={i}>{inc}</li>
              ))}
            </ul>
          </div>
        )}
        {itinerary.exclusions && itinerary.exclusions.length > 0 && (
          <div className="col-md-6">
            <h4>Exclusions</h4>
            <ul>
              {itinerary.exclusions.map((exc: string, i: number) => (
                <li key={i}>{exc}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Best Time to Visit */}
      {itinerary.bestTimeToVisit && itinerary.bestTimeToVisit.length > 0 && (
        <div className="mb-4">
          <h4>Best Time to Visit</h4>
          <div className="d-flex flex-wrap gap-2">
            {itinerary.bestTimeToVisit.map((time: string, i: number) => (
              <span key={i} className="badge bg-info">{time}</span>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {itinerary.tags && itinerary.tags.length > 0 && (
        <div className="mb-4">
          <h4>Tags</h4>
          <div className="d-flex flex-wrap gap-2">
            {itinerary.tags.map((tag: string, i: number) => (
              <span key={i} className="badge bg-secondary">{tag}</span>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Reviews</h3>
          {isAuthenticated && (
            <button
              className="btn btn-primary"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              {showReviewForm ? 'Cancel' : 'Add Review'}
            </button>
          )}
        </div>

        {showReviewForm && isAuthenticated && (
          <div className="card mb-4">
            <div className="card-body">
              <h5>Write a Review</h5>
              <div className="mb-3">
                <label className="form-label">Rating</label>
                <div>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="btn btn-link p-0 me-1"
                      onClick={() => setReviewRating(star)}
                    >
                      <i
                        className={`bi ${
                          star <= reviewRating ? 'bi-star-fill' : 'bi-star'
                        } text-warning`}
                        style={{ fontSize: '1.5rem' }}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Comment</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience..."
                />
              </div>
              <button
                className="btn btn-primary"
                onClick={handleAddReview}
                disabled={submittingReview || reviewRating === 0}
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        )}

        {itinerary.reviews && itinerary.reviews.length > 0 ? (
          <div>
            {itinerary.reviews.map((review: any, i: number) => (
              <div key={i} className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      {renderStars(review.rating)}
                      {review.createdAt && (
                        <small className="text-muted d-block">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </small>
                      )}
                    </div>
                  </div>
                  {review.comment && <p className="mb-0">{review.comment}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
};

export default ItineraryDetail;

