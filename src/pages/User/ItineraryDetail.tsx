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
import { formatThumbnailForDisplay, PLACEHOLDER_IMAGE } from '../../utils/imageUtils';

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
        // Normalize id/_id - use id if available, otherwise _id
        const data = response.data;
        if (data && !data.id && data._id) {
          data.id = data._id;
        }
        setItinerary(data);
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
      const itineraryId = itinerary?.id || itinerary?._id || id;
      if (isFavorite) {
        await removeItineraryFromFavorites(itineraryId);
        setIsFavorite(false);
      } else {
        await addItineraryToFavorites(itineraryId);
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
      const itineraryId = itinerary?.id || itinerary?._id || id;
      await addItineraryReview(itineraryId, { rating: reviewRating, comment: reviewComment });
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
    <div className="destination-detail-page detail-page">
      <div className="container py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button className="btn btn-outline-primary" onClick={() => navigate('/itineraries')}>
            <i className="bi bi-arrow-left"></i> Back
          </button>
          {isAuthenticated && (
            <button
              className={`btn ${isFavorite ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={handleToggleFavorite}
            >
              <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`}></i>{' '}
              {isFavorite ? 'Favorited' : 'Add to Favorites'}
            </button>
          )}
        </div>

        <div className="row gx-4">
          {/* Main Column */}
          <div className="col-lg-8">
            {/* Hero Section */}
            <div className="main-section bg-white rounded shadow-sm p-4 p-lg-5 mb-4">
              {/* Hero Image with placeholder background */}
              <div
                className="rounded mb-4"
                style={{
                  height: '400px',
                  width: '100%',
                  position: 'relative',
                  background: itinerary.thumbnail ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  overflow: 'hidden',
                }}
              >
                {itinerary.thumbnail ? (
                  <img
                    src={formatThumbnailForDisplay(itinerary.thumbnail, BASE_URL)}
                    alt={itinerary.title}
                    className="img-fluid"
                    style={{ height: '100%', objectFit: 'cover', width: '100%' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent) {
                        parent.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                      }
                    }}
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center text-white"
                    style={{ height: '100%' }}
                  >
                    <div className="text-center">
                      <i className="bi bi-image" style={{ fontSize: '4rem', opacity: 0.5 }}></i>
                      <p className="mt-3 mb-0" style={{ opacity: 0.7 }}>No Image Available</p>
                    </div>
                  </div>
                )}
              </div>

              <h1 className="fw-bold mb-3" style={{ wordWrap: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal' }}>{itinerary.title}</h1>
              
              <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
                <p className="text-muted mb-0">
                  <i className="bi bi-geo-alt-fill me-2"></i>
                  {[itinerary.city, itinerary.state, itinerary.country, itinerary.continent]
                    .filter(Boolean)
                    .join(', ')}
                </p>
                <span className="badge bg-primary">{itinerary.type}</span>
                {itinerary.priceRange && (
                  <span className="badge bg-success">{itinerary.priceRange}</span>
                )}
              </div>

              <div className="d-flex flex-wrap align-items-center gap-4 mb-3">
                {itinerary.avgRating > 0 && (
                  <div className="d-flex align-items-center">
                    {renderStars(itinerary.avgRating)}
                    <span className="text-muted ms-2">
                      ({itinerary.reviews?.length || 0} reviews)
                    </span>
                  </div>
                )}
                <div>
                  <i className="bi bi-calendar me-2 text-primary"></i>
                  <strong>Duration:</strong> {itinerary.durationDays} Days
                </div>
              </div>
            </div>

            {/* Overview */}
            {itinerary.overview && (
              <div className="content-section bg-white rounded shadow-sm p-4 p-lg-5 mb-4">
                <h4 className="fw-semibold mb-3">Overview</h4>
                <p className="text-muted">{itinerary.overview}</p>
              </div>
            )}

            {/* Days Itinerary */}
            {itinerary.days && itinerary.days.length > 0 && (
              <div className="content-section bg-white rounded shadow-sm p-4 p-lg-5 mb-4">
                <h4 className="fw-semibold mb-4">Daily Itinerary</h4>
                {itinerary.days.map((day: any, index: number) => (
                  <div key={index} className="card border-0 shadow-sm mb-3">
                    <div className="card-header bg-primary text-white">
                      <h5 className="mb-0 fw-bold">
                        <i className="bi bi-calendar-day me-2"></i>
                        Day {index + 1}
                        {day.title && ` - ${day.title}`}
                      </h5>
                    </div>
                    <div className="card-body">
                      {day.description && (
                        <div className="mb-3">
                          <p className="text-muted mb-0">{day.description}</p>
                        </div>
                      )}
                      
                      {day.attractions && day.attractions.length > 0 && (
                        <div className="mb-3">
                          <h6 className="fw-bold mb-2">
                            <i className="bi bi-geo-alt-fill text-primary me-2"></i>
                            Attractions
                          </h6>
                          <div className="list-group">
                            {day.attractions.map((attr: any, i: number) => (
                              <div key={i} className="list-group-item border-0 bg-light">
                                <div className="d-flex justify-content-between align-items-start">
                                  <div className="flex-grow-1">
                                    <i className="bi bi-map text-primary me-2"></i>
                                    <strong>{attr.attractionName || attr.name}</strong>
                                    {attr.notes && (
                                      <p className="text-muted small mb-0 mt-1">{attr.notes}</p>
                                    )}
                                  </div>
                                  {(attr.startTime || attr.endTime) && (
                                    <div className="text-end">
                                      {attr.startTime && (
                                        <small className="text-muted d-block">
                                          <i className="bi bi-clock me-1"></i>
                                          {attr.startTime}
                                        </small>
                                      )}
                                      {attr.endTime && (
                                        <small className="text-muted d-block">
                                          <i className="bi bi-clock-fill me-1"></i>
                                          {attr.endTime}
                                        </small>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {day.meals && (day.meals.breakfast || day.meals.lunch || day.meals.dinner) && (
                        <div className="mb-3">
                          <h6 className="fw-bold mb-2">
                            <i className="bi bi-fork-knife text-warning me-2"></i>
                            Meals
                          </h6>
                          <div className="list-group">
                            {day.meals.breakfast && (
                              <div className="list-group-item border-0 bg-light">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <i className="bi bi-sun text-warning me-2"></i>
                                    <strong>Breakfast:</strong> {day.meals.breakfast.restaurantName}
                                  </div>
                                  {day.meals.breakfast.time && (
                                    <small className="text-muted">
                                      <i className="bi bi-clock me-1"></i>
                                      {day.meals.breakfast.time}
                                    </small>
                                  )}
                                </div>
                              </div>
                            )}
                            {day.meals.lunch && (
                              <div className="list-group-item border-0 bg-light">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <i className="bi bi-sun-fill text-warning me-2"></i>
                                    <strong>Lunch:</strong> {day.meals.lunch.restaurantName}
                                  </div>
                                  {day.meals.lunch.time && (
                                    <small className="text-muted">
                                      <i className="bi bi-clock me-1"></i>
                                      {day.meals.lunch.time}
                                    </small>
                                  )}
                                </div>
                              </div>
                            )}
                            {day.meals.dinner && (
                              <div className="list-group-item border-0 bg-light">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <i className="bi bi-moon text-info me-2"></i>
                                    <strong>Dinner:</strong> {day.meals.dinner.restaurantName}
                                  </div>
                                  {day.meals.dinner.time && (
                                    <small className="text-muted">
                                      <i className="bi bi-clock me-1"></i>
                                      {day.meals.dinner.time}
                                    </small>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {day.hotelStay && (
                        <div>
                          <h6 className="fw-bold mb-2">
                            <i className="bi bi-house-door text-success me-2"></i>
                            Hotel Stay
                          </h6>
                          <div className="list-group-item border-0 bg-light">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <i className="bi bi-building text-success me-2"></i>
                                <strong>{day.hotelStay.hotelName}</strong>
                              </div>
                              {(day.hotelStay.checkIn || day.hotelStay.checkOut) && (
                                <div className="text-end">
                                  {day.hotelStay.checkIn && (
                                    <small className="text-muted d-block">
                                      <i className="bi bi-door-open me-1"></i>
                                      Check-in: {day.hotelStay.checkIn}
                                    </small>
                                  )}
                                  {day.hotelStay.checkOut && (
                                    <small className="text-muted d-block">
                                      <i className="bi bi-door-closed me-1"></i>
                                      Check-out: {day.hotelStay.checkOut}
                                    </small>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
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
                <div className="col-md-6 mb-4">
                  <div className="content-section bg-white rounded shadow-sm p-4 p-lg-5 h-100">
                    <h4 className="fw-semibold mb-3 text-success">
                      <i className="bi bi-check-circle me-2"></i>
                      Inclusions
                    </h4>
                    <ul className="list-unstyled">
                      {itinerary.inclusions.map((inc: string, i: number) => (
                        <li key={i} className="mb-2">
                          <i className="bi bi-check text-success me-2"></i>
                          {inc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {itinerary.exclusions && itinerary.exclusions.length > 0 && (
                <div className="col-md-6 mb-4">
                  <div className="content-section bg-white rounded shadow-sm p-4 p-lg-5 h-100">
                    <h4 className="fw-semibold mb-3 text-danger">
                      <i className="bi bi-x-circle me-2"></i>
                      Exclusions
                    </h4>
                    <ul className="list-unstyled">
                      {itinerary.exclusions.map((exc: string, i: number) => (
                        <li key={i} className="mb-2">
                          <i className="bi bi-x text-danger me-2"></i>
                          {exc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Best Time to Visit */}
            {itinerary.bestTimeToVisit && itinerary.bestTimeToVisit.length > 0 && (
              <div className="content-section bg-white rounded shadow-sm p-4 p-lg-5 mb-4">
                <h4 className="fw-semibold mb-3">
                  <i className="bi bi-calendar-check text-info me-2"></i>
                  Best Time to Visit
                </h4>
                <div className="d-flex flex-wrap gap-2">
                  {itinerary.bestTimeToVisit.map((time: string, i: number) => (
                    <span key={i} className="badge bg-info text-white p-2">
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {itinerary.tags && itinerary.tags.length > 0 && (
              <div className="content-section bg-white rounded shadow-sm p-4 p-lg-5 mb-4">
                <h4 className="fw-semibold mb-3">
                  <i className="bi bi-tags text-secondary me-2"></i>
                  Tags
                </h4>
                <div className="d-flex flex-wrap gap-2">
                  {itinerary.tags.map((tag: string, i: number) => (
                    <span key={i} className="badge bg-secondary p-2">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="content-section bg-white rounded shadow-sm p-4 p-lg-5 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-semibold mb-0">Reviews</h4>
                {isAuthenticated ? (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                  >
                    {showReviewForm ? 'Cancel' : 'Add Review'}
                  </button>
                ) : (
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => {
                      alert('Please login to add a review');
                      navigate('/login');
                    }}
                  >
                    Login to Add Review
                  </button>
                )}
              </div>

              {showReviewForm && isAuthenticated && (
                <div className="bg-light p-3 rounded border mb-3">
                  <h5 className="mb-3">Write a Review</h5>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Rating</label>
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
                    <label className="form-label fw-semibold">Comment</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience..."
                    />
                  </div>
                  <div>
                    <button
                      className="btn btn-primary"
                      onClick={handleAddReview}
                      disabled={submittingReview || reviewRating === 0}
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button
                      className="btn btn-outline-secondary ms-2"
                      onClick={() => {
                        setShowReviewForm(false);
                        setReviewComment('');
                        setReviewRating(0);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {itinerary.reviews && itinerary.reviews.length > 0 ? (
                <div>
                  {itinerary.reviews.map((review: any, i: number) => (
                    <div key={i} className="bg-light rounded border p-3 mb-2">
                      {renderStars(review.rating)}
                      {review.comment && (
                        <p className="mt-2 mb-0">{review.comment}</p>
                      )}
                      {review.createdAt && (
                        <small className="text-muted">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </small>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted mb-0">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="sidebar bg-white rounded shadow-sm p-4 p-lg-5 sticky-top">
              <div className="text-center mb-4">
                {itinerary.avgRating > 0 ? (
                  <>
                    {renderStars(itinerary.avgRating)}
                    <p className="text-muted mt-2">
                      Based on {itinerary.reviews?.length || 0} review(s)
                    </p>
                  </>
                ) : (
                  <p className="text-muted">No ratings yet</p>
                )}
              </div>
              <hr />
              <h6 className="fw-bold mb-3">Quick Info</h6>
              <div className="mb-2">
                <strong>Type:</strong> <span className="badge bg-primary">{itinerary.type}</span>
              </div>
              {itinerary.city && (
                <p className="mb-1"><strong>City:</strong> {itinerary.city}</p>
              )}
              {itinerary.state && (
                <p className="mb-1"><strong>State:</strong> {itinerary.state}</p>
              )}
              {itinerary.country && (
                <p className="mb-1"><strong>Country:</strong> {itinerary.country}</p>
              )}
              {itinerary.continent && (
                <p className="mb-1"><strong>Continent:</strong> {itinerary.continent}</p>
              )}
              <p className="mb-1">
                <strong>Duration:</strong> {itinerary.durationDays} Days
              </p>
              {itinerary.priceRange && (
                <p className="mb-0">
                  <strong>Price Range:</strong> <span className="text-success">{itinerary.priceRange}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryDetail;

