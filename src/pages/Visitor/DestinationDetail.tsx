import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getDetailedDestination,
  addDestinationReview,
  addDestinationToFavorites,
  removeDestinationFromFavorites,
} from '../../api/userServices';
import { getToken } from '../../utils/token';
import { BASE_URL } from '../../utils/constatnts';
import { formatThumbnailForDisplay, PLACEHOLDER_IMAGE } from '../../utils/imageUtils';
import './DestinationDetail.css';

const DestinationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [destination, setDestination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'attraction' | 'hotel' | 'restaurant' | null>(null);

  const isAuthenticated = !!getToken();

  useEffect(() => {
    fetchDestination();
  }, [id]);

  const fetchDestination = async () => {
    try {
      setLoading(true);
      const response = await getDetailedDestination(id!);
      if (response.error) {
        setError(response.message);
      } else {
        // Normalize id/_id - use id if available, otherwise _id
        const data = response.data;
        if (data && !data.id && data._id) {
          data.id = data._id;
        }
        setDestination(data);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to fetch destination details');
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
      const destinationId = destination?.id || destination?._id || id;
      if (isFavorite) {
        await removeDestinationFromFavorites(destinationId);
        setIsFavorite(false);
      } else {
        await addDestinationToFavorites(destinationId);
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
      const destinationId = destination?.id || destination?._id || id;
      await addDestinationReview(destinationId, { rating: reviewRating, comment: reviewComment });
      alert('Review added successfully!');
      setReviewRating(0);
      setReviewComment('');
      setShowReviewForm(false);
      fetchDestination();
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
            className={`bi bi-star-fill ${i < fullStars ? 'text-warning' : 'text-muted'}`}
            style={{ opacity: i < fullStars ? 1 : 0.3 }}
          />
        ))}
        <span className="ms-2">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (loading)
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );

  if (error || !destination)
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-danger">
          <h5>Error</h5>
          <p>{error || 'Destination not found'}</p>
          <button className="btn btn-outline-danger" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    );

  return (
    <div className="destination-detail-page detail-page">
      <div className="container py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button className="btn btn-outline-primary" onClick={() => navigate(-1)}>
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
            <div className="main-section bg-white rounded shadow-sm p-4 p-lg-5 mb-4">
              {/* Hero Image with placeholder background */}
              <div
                className="rounded mb-4"
                style={{
                  height: '400px',
                  width: '100%',
                  position: 'relative',
                  background: destination.thumbnail ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  overflow: 'hidden',
                }}
              >
                {destination.thumbnail ? (
                  <img
                    src={formatThumbnailForDisplay(destination.thumbnail, BASE_URL)}
                    alt={destination.title}
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

              <h1 className="fw-bold mb-3" style={{ wordWrap: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal' }}>{destination.title}</h1>
              <p className="text-muted">
                <i className="bi bi-geo-alt-fill me-2"></i>
                {[destination.city, destination.state, destination.country, destination.continent]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            </div>

            {/* Short Description */}
            {destination.overview && (
              <div className="content-section bg-white rounded shadow-sm p-4 p-lg-5 mb-4">
                <h4 className="fw-semibold mb-3">Short Description</h4>
                <p className="text-muted">{destination.overview}</p>
              </div>
            )}

            {/* Long Description - using overview if it's long, or history/culture combined */}
            {(destination.description || (destination.history && destination.culture)) && (
              <div className="content-section bg-white rounded shadow-sm p-4 p-lg-5 mb-4">
                <h4 className="fw-semibold mb-3">Detailed Description</h4>
                {destination.description ? (
                  <p className="text-muted">{destination.description}</p>
                ) : (
                  <div className="text-muted">
                    {destination.history && (
                      <div className="mb-3">
                        <strong>Historical Background:</strong>
                        <p className="mb-0 mt-2">{destination.history}</p>
                      </div>
                    )}
                    {destination.culture && (
                      <div>
                        <strong>Cultural Insights:</strong>
                        <p className="mb-0 mt-2">{destination.culture}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Highlights */}
            {destination.highlights?.length > 0 && (
              <div className="content-section bg-white rounded shadow-sm p-4 p-lg-5 mb-4">
                <h4 className="fw-semibold mb-3">Highlights</h4>
                <ul className="ps-3">
                  {destination.highlights.map((item: string, i: number) => (
                    <li key={i} className="mb-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Travel Tips */}
            {destination.travelTips?.length > 0 && (
              <div className="content-section bg-white rounded shadow-sm p-4 p-lg-5 mb-4">
                <h4 className="fw-semibold mb-3">Travel Tips</h4>
                <ul className="ps-3">
                  {destination.travelTips.map((tip: string, i: number) => (
                    <li key={i} className="mb-2">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Best Time to Visit */}
            {destination.bestTimeToVisit && (
              <div className="content-section bg-white rounded shadow-sm p-4 p-lg-5 mb-4">
                <h4 className="fw-semibold mb-3">Best Time to Visit</h4>
                {destination.bestTimeToVisit.months?.length > 0 && (
                  <div className="mb-2">
                    <strong>Months:</strong>{' '}
                    {destination.bestTimeToVisit.months.join(', ')}
                  </div>
                )}
                {destination.bestTimeToVisit.reason && (
                  <p className="text-muted mb-0">
                    {destination.bestTimeToVisit.reason}
                  </p>
                )}
              </div>
            )}

            {/* Attractions */}
            {destination.attractions?.length > 0 && (
              <div className="content-section bg-white rounded shadow-sm p-4 p-lg-5 mb-4">
                <h4 className="fw-semibold mb-3">Attractions</h4>
                <div className="row g-3">
                  {destination.attractions.map((attraction: any, i: number) => (
                    <div key={i} className="col-md-6 col-lg-4">
                      <div 
                        className="card border-0 shadow-sm h-100" 
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setSelectedItem(attraction);
                          setModalType('attraction');
                        }}
                      >
                        <div
                          className="card-img-top"
                          style={{
                            height: '200px',
                            position: 'relative',
                            background: attraction.thumbnail ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            overflow: 'hidden',
                          }}
                        >
                          {attraction.thumbnail ? (
                            <img
                              src={formatThumbnailForDisplay(attraction.thumbnail, BASE_URL)}
                              alt={attraction.name || 'Attraction'}
                              style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                const parent = (e.target as HTMLImageElement).parentElement;
                                if (parent) {
                                  parent.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                                }
                              }}
                            />
                          ) : (
                            <div className="d-flex align-items-center justify-content-center text-white h-100">
                              <i className="bi bi-image" style={{ fontSize: '2rem', opacity: 0.5 }}></i>
                            </div>
                          )}
                        </div>
                        <div className="card-body">
                          <h6 className="card-title fw-bold">{attraction.name || 'Attraction'}</h6>
                          {attraction.shortDesc && (
                            <p className="card-text small text-muted mb-2">
                              {attraction.shortDesc}
                            </p>
                          )}
                          {attraction.location && (
                            <p className="card-text small mb-1">
                              <i className="bi bi-geo-alt text-primary me-1"></i>
                              <span className="text-muted">{attraction.location}</span>
                            </p>
                          )}
                          <div className="d-flex justify-content-between align-items-center mt-2">
                            {attraction.rating && (
                              <small className="text-warning">
                                <i className="bi bi-star-fill"></i> {attraction.rating}
                              </small>
                            )}
                            {attraction.category && (
                              <span className="badge bg-secondary small">{attraction.category}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hotels */}
            {destination.hotels?.length > 0 && (
              <div className="content-section bg-white rounded shadow-sm p-4 p-lg-5 mb-4">
                <h4 className="fw-semibold mb-3">Hotels</h4>
                <div className="row g-3">
                  {destination.hotels.map((hotel: any, i: number) => (
                    <div key={i} className="col-md-6 col-lg-4">
                      <div 
                        className="card border-0 shadow-sm h-100"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setSelectedItem(hotel);
                          setModalType('hotel');
                        }}
                      >
                        <div
                          className="card-img-top"
                          style={{
                            height: '200px',
                            position: 'relative',
                            background: hotel.thumbnail ? 'transparent' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            overflow: 'hidden',
                          }}
                        >
                          {hotel.thumbnail ? (
                            <img
                              src={formatThumbnailForDisplay(hotel.thumbnail, BASE_URL)}
                              alt={hotel.name || 'Hotel'}
                              style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                const parent = (e.target as HTMLImageElement).parentElement;
                                if (parent) {
                                  parent.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
                                }
                              }}
                            />
                          ) : (
                            <div className="d-flex align-items-center justify-content-center text-white h-100">
                              <i className="bi bi-image" style={{ fontSize: '2rem', opacity: 0.5 }}></i>
                            </div>
                          )}
                        </div>
                        <div className="card-body">
                          <h6 className="card-title fw-bold">{hotel.name || 'Hotel'}</h6>
                          {hotel.shortDesc && (
                            <p className="card-text small text-muted mb-2">
                              {hotel.shortDesc}
                            </p>
                          )}
                          {hotel.location?.address && (
                            <p className="card-text small mb-1">
                              <i className="bi bi-geo-alt text-primary me-1"></i>
                              <span className="text-muted">{hotel.location.address}</span>
                            </p>
                          )}
                          <div className="d-flex justify-content-between align-items-center mt-2">
                            {hotel.priceRange && (
                              <small className="text-success fw-semibold">
                                {hotel.priceRange}
                              </small>
                            )}
                            {hotel.rating && (
                              <small className="text-warning">
                                <i className="bi bi-star-fill"></i> {hotel.rating}
                              </small>
                            )}
                          </div>
                          {hotel.amenities && hotel.amenities.length > 0 && (
                            <div className="mt-2">
                              {hotel.amenities.slice(0, 3).map((amenity: string, idx: number) => (
                                <span key={idx} className="badge bg-light text-dark me-1 small">
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Restaurants */}
            {destination.restaurants?.length > 0 && (
              <div className="content-section bg-white rounded shadow-sm p-4 p-lg-5 mb-4">
                <h4 className="fw-semibold mb-3">Restaurants</h4>
                <div className="row g-3">
                  {destination.restaurants.map((restaurant: any, i: number) => (
                    <div key={i} className="col-md-6 col-lg-4">
                      <div 
                        className="card border-0 shadow-sm h-100"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setSelectedItem(restaurant);
                          setModalType('restaurant');
                        }}
                      >
                        <div
                          className="card-img-top"
                          style={{
                            height: '200px',
                            position: 'relative',
                            background: restaurant.thumbnail ? 'transparent' : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                            overflow: 'hidden',
                          }}
                        >
                          {restaurant.thumbnail ? (
                            <img
                              src={formatThumbnailForDisplay(restaurant.thumbnail, BASE_URL)}
                              alt={restaurant.name || 'Restaurant'}
                              style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                const parent = (e.target as HTMLImageElement).parentElement;
                                if (parent) {
                                  parent.style.background = 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
                                }
                              }}
                            />
                          ) : (
                            <div className="d-flex align-items-center justify-content-center text-white h-100">
                              <i className="bi bi-image" style={{ fontSize: '2rem', opacity: 0.5 }}></i>
                            </div>
                          )}
                        </div>
                        <div className="card-body">
                          <h6 className="card-title fw-bold">{restaurant.name || 'Restaurant'}</h6>
                          {restaurant.shortDesc && (
                            <p className="card-text small text-muted mb-2">
                              {restaurant.shortDesc}
                            </p>
                          )}
                          <div className="d-flex justify-content-between align-items-center mt-2">
                            {restaurant.cuisineType && Array.isArray(restaurant.cuisineType) && restaurant.cuisineType.length > 0 && (
                              <small className="text-primary fw-semibold">
                                <i className="bi bi-fork-knife me-1"></i>
                                {restaurant.cuisineType[0]}
                              </small>
                            )}
                            {restaurant.averageCost && (
                              <small className="text-muted">{restaurant.averageCost}</small>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="content-section bg-white rounded shadow-sm p-4 p-lg-5 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-semibold mb-0">Reviews</h4>
                {isAuthenticated ? (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                  >
                    Add Review
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

              {showReviewForm && (
                <div className="bg-light p-3 rounded border mb-3">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Rating</label>
                    <div>
                      {[1, 2, 3, 4, 5].map((r) => (
                        <button
                          key={r}
                          className={`btn ${
                            reviewRating >= r ? 'btn-warning' : 'btn-outline-secondary'
                          } btn-sm me-1`}
                          onClick={() => setReviewRating(r)}
                        >
                          <i className="bi bi-star-fill"></i>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Comment</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                    />
                  </div>
                  <div>
                    <button
                      className="btn btn-primary"
                      onClick={handleAddReview}
                      disabled={submittingReview || reviewRating === 0}
                    >
                      {submittingReview ? 'Submitting...' : 'Submit'}
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

              {destination.reviews?.length ? (
                destination.reviews.map((rev: any, i: number) => (
                  <div key={i} className="bg-light rounded border p-3 mb-2">
                    {renderStars(rev.rating)}
                    <p className="mt-2 mb-0">{rev.comment}</p>
                    <small className="text-muted">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                ))
              ) : (
                <p className="text-muted mb-0">No reviews yet.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="sidebar bg-white rounded shadow-sm p-4 p-lg-5 sticky-top">
              <div className="text-center mb-4">
                {renderStars(destination.avgRating || 0)}
                <p className="text-muted mt-2">
                  Based on {destination.reviews?.length || 0} review(s)
                </p>
              </div>
              <hr />
              <h6 className="fw-bold mb-3">Quick Info</h6>
              <p><strong>City:</strong> {destination.city}</p>
              {destination.state && <p><strong>State:</strong> {destination.state}</p>}
              <p><strong>Country:</strong> {destination.country}</p>
              <p><strong>Continent:</strong> {destination.continent}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && modalType && (
        <div 
          className="modal fade show" 
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => {
            setSelectedItem(null);
            setModalType(null);
          }}
        >
          <div 
            className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{selectedItem.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setSelectedItem(null);
                    setModalType(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                {/* Image */}
                <div
                  className="rounded mb-4"
                  style={{
                    height: '300px',
                    width: '100%',
                    position: 'relative',
                    background: selectedItem.thumbnail ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    overflow: 'hidden',
                  }}
                >
                  {selectedItem.thumbnail ? (
                    <img
                      src={formatThumbnailForDisplay(selectedItem.thumbnail, BASE_URL)}
                      alt={selectedItem.name}
                      style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const parent = (e.target as HTMLImageElement).parentElement;
                        if (parent) {
                          parent.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                        }
                      }}
                    />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center text-white h-100">
                      <div className="text-center">
                        <i className="bi bi-image" style={{ fontSize: '4rem', opacity: 0.5 }}></i>
                        <p className="mt-3 mb-0" style={{ opacity: 0.7 }}>No Image Available</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Attraction Details */}
                {modalType === 'attraction' && (
                  <>
                    {selectedItem.shortDesc && (
                      <div className="mb-3">
                        <h6 className="fw-bold mb-2">Description</h6>
                        <p className="text-muted">{selectedItem.shortDesc}</p>
                      </div>
                    )}
                    {selectedItem.longDesc && (
                      <div className="mb-3">
                        <h6 className="fw-bold mb-2">Detailed Description</h6>
                        <p className="text-muted">{selectedItem.longDesc}</p>
                      </div>
                    )}
                    <div className="row mb-3">
                      {selectedItem.location && (
                        <div className="col-md-6 mb-2">
                          <h6 className="fw-bold mb-1"><i className="bi bi-geo-alt text-primary me-2"></i>Location</h6>
                          <p className="text-muted mb-0">{selectedItem.location}</p>
                        </div>
                      )}
                      {selectedItem.city && (
                        <div className="col-md-6 mb-2">
                          <h6 className="fw-bold mb-1"><i className="bi bi-building text-primary me-2"></i>City</h6>
                          <p className="text-muted mb-0">{selectedItem.city}, {selectedItem.state}, {selectedItem.country}</p>
                        </div>
                      )}
                      {selectedItem.entryFee && (
                        <div className="col-md-6 mb-2">
                          <h6 className="fw-bold mb-1"><i className="bi bi-cash text-success me-2"></i>Entry Fee</h6>
                          <p className="text-muted mb-0">{selectedItem.entryFee}</p>
                        </div>
                      )}
                      {selectedItem.openingHours && (
                        <div className="col-md-6 mb-2">
                          <h6 className="fw-bold mb-1"><i className="bi bi-clock text-info me-2"></i>Opening Hours</h6>
                          <p className="text-muted mb-0">{selectedItem.openingHours}</p>
                        </div>
                      )}
                      {selectedItem.bestTimeToVisit && (
                        <div className="col-md-6 mb-2">
                          <h6 className="fw-bold mb-1"><i className="bi bi-calendar-check text-warning me-2"></i>Best Time to Visit</h6>
                          <p className="text-muted mb-0">{selectedItem.bestTimeToVisit}</p>
                        </div>
                      )}
                      {selectedItem.rating && (
                        <div className="col-md-6 mb-2">
                          <h6 className="fw-bold mb-1"><i className="bi bi-star-fill text-warning me-2"></i>Rating</h6>
                          <p className="text-muted mb-0">{selectedItem.rating}/5</p>
                        </div>
                      )}
                      {selectedItem.category && (
                        <div className="col-md-6 mb-2">
                          <h6 className="fw-bold mb-1"><i className="bi bi-tag text-secondary me-2"></i>Category</h6>
                          <p className="text-muted mb-0">{selectedItem.category}</p>
                        </div>
                      )}
                    </div>
                    {selectedItem.highlights && selectedItem.highlights.length > 0 && (
                      <div className="mb-3">
                        <h6 className="fw-bold mb-2">Highlights</h6>
                        <ul className="list-unstyled">
                          {selectedItem.highlights.map((highlight: string, idx: number) => (
                            <li key={idx} className="mb-1">
                              <i className="bi bi-check-circle text-success me-2"></i>
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedItem.tips && selectedItem.tips.length > 0 && (
                      <div className="mb-3">
                        <h6 className="fw-bold mb-2">Travel Tips</h6>
                        <ul className="list-unstyled">
                          {selectedItem.tips.map((tip: string, idx: number) => (
                            <li key={idx} className="mb-1">
                              <i className="bi bi-lightbulb text-warning me-2"></i>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedItem.popularFor && selectedItem.popularFor.length > 0 && (
                      <div className="mb-3">
                        <h6 className="fw-bold mb-2">Popular For</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {selectedItem.popularFor.map((item: string, idx: number) => (
                            <span key={idx} className="badge bg-primary">{item}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Hotel Details */}
                {modalType === 'hotel' && (
                  <>
                    {selectedItem.shortDesc && (
                      <div className="mb-3">
                        <h6 className="fw-bold mb-2">Description</h6>
                        <p className="text-muted">{selectedItem.shortDesc}</p>
                      </div>
                    )}
                    {selectedItem.longDesc && (
                      <div className="mb-3">
                        <h6 className="fw-bold mb-2">Detailed Description</h6>
                        <p className="text-muted">{selectedItem.longDesc}</p>
                      </div>
                    )}
                    <div className="row mb-3">
                      {selectedItem.location?.address && (
                        <div className="col-md-12 mb-2">
                          <h6 className="fw-bold mb-1"><i className="bi bi-geo-alt text-primary me-2"></i>Address</h6>
                          <p className="text-muted mb-0">{selectedItem.location.address}</p>
                        </div>
                      )}
                      {selectedItem.city && (
                        <div className="col-md-6 mb-2">
                          <h6 className="fw-bold mb-1"><i className="bi bi-building text-primary me-2"></i>Location</h6>
                          <p className="text-muted mb-0">{selectedItem.city}, {selectedItem.state}, {selectedItem.country}</p>
                        </div>
                      )}
                      {selectedItem.priceRange && (
                        <div className="col-md-6 mb-2">
                          <h6 className="fw-bold mb-1"><i className="bi bi-cash text-success me-2"></i>Price Range</h6>
                          <p className="text-muted mb-0">{selectedItem.priceRange}</p>
                        </div>
                      )}
                      {selectedItem.rating && (
                        <div className="col-md-6 mb-2">
                          <h6 className="fw-bold mb-1"><i className="bi bi-star-fill text-warning me-2"></i>Rating</h6>
                          <p className="text-muted mb-0">{selectedItem.rating}/5</p>
                        </div>
                      )}
                      {selectedItem.checkInTime && (
                        <div className="col-md-6 mb-2">
                          <h6 className="fw-bold mb-1"><i className="bi bi-door-open text-info me-2"></i>Check-in</h6>
                          <p className="text-muted mb-0">{selectedItem.checkInTime}</p>
                        </div>
                      )}
                      {selectedItem.checkOutTime && (
                        <div className="col-md-6 mb-2">
                          <h6 className="fw-bold mb-1"><i className="bi bi-door-closed text-info me-2"></i>Check-out</h6>
                          <p className="text-muted mb-0">{selectedItem.checkOutTime}</p>
                        </div>
                      )}
                      {selectedItem.contactNumber && (
                        <div className="col-md-6 mb-2">
                          <h6 className="fw-bold mb-1"><i className="bi bi-telephone text-primary me-2"></i>Contact</h6>
                          <p className="text-muted mb-0">{selectedItem.contactNumber}</p>
                        </div>
                      )}
                      {selectedItem.email && (
                        <div className="col-md-6 mb-2">
                          <h6 className="fw-bold mb-1"><i className="bi bi-envelope text-primary me-2"></i>Email</h6>
                          <p className="text-muted mb-0">{selectedItem.email}</p>
                        </div>
                      )}
                      {selectedItem.website && (
                        <div className="col-md-12 mb-2">
                          <h6 className="fw-bold mb-1"><i className="bi bi-globe text-primary me-2"></i>Website</h6>
                          <a href={selectedItem.website} target="_blank" rel="noopener noreferrer" className="text-primary">
                            {selectedItem.website}
                          </a>
                        </div>
                      )}
                    </div>
                    {selectedItem.roomTypes && selectedItem.roomTypes.length > 0 && (
                      <div className="mb-3">
                        <h6 className="fw-bold mb-2">Room Types</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {selectedItem.roomTypes.map((type: string, idx: number) => (
                            <span key={idx} className="badge bg-info">{type}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedItem.amenities && selectedItem.amenities.length > 0 && (
                      <div className="mb-3">
                        <h6 className="fw-bold mb-2">Amenities</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {selectedItem.amenities.map((amenity: string, idx: number) => (
                            <span key={idx} className="badge bg-light text-dark">{amenity}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedItem.facilities && selectedItem.facilities.length > 0 && (
                      <div className="mb-3">
                        <h6 className="fw-bold mb-2">Facilities</h6>
                        <ul className="list-unstyled">
                          {selectedItem.facilities.map((facility: string, idx: number) => (
                            <li key={idx} className="mb-1">
                              <i className="bi bi-check-circle text-success me-2"></i>
                              {facility}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedItem.popularFor && selectedItem.popularFor.length > 0 && (
                      <div className="mb-3">
                        <h6 className="fw-bold mb-2">Popular For</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {selectedItem.popularFor.map((item: string, idx: number) => (
                            <span key={idx} className="badge bg-primary">{item}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Restaurant Details */}
                {modalType === 'restaurant' && (
                  <>
                    {selectedItem.shortDesc && (
                      <div className="mb-3">
                        <h6 className="fw-bold mb-2">Description</h6>
                        <p className="text-muted">{selectedItem.shortDesc}</p>
                      </div>
                    )}
                    {selectedItem.longDesc && (
                      <div className="mb-3">
                        <h6 className="fw-bold mb-2">Detailed Description</h6>
                        <p className="text-muted">{selectedItem.longDesc}</p>
                      </div>
                    )}
                    <div className="row mb-3">
                      {selectedItem.city && (
                        <div className="col-md-6 mb-2">
                          <h6 className="fw-bold mb-1"><i className="bi bi-building text-primary me-2"></i>Location</h6>
                          <p className="text-muted mb-0">{selectedItem.city}, {selectedItem.state}, {selectedItem.country}</p>
                        </div>
                      )}
                      {selectedItem.cuisineType && Array.isArray(selectedItem.cuisineType) && selectedItem.cuisineType.length > 0 && (
                        <div className="col-md-6 mb-2">
                          <h6 className="fw-bold mb-1"><i className="bi bi-fork-knife text-primary me-2"></i>Cuisine Type</h6>
                          <div className="d-flex flex-wrap gap-1">
                            {selectedItem.cuisineType.map((cuisine: string, idx: number) => (
                              <span key={idx} className="badge bg-primary">{cuisine}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedItem.averageCost && (
                        <div className="col-md-6 mb-2">
                          <h6 className="fw-bold mb-1"><i className="bi bi-cash text-success me-2"></i>Average Cost</h6>
                          <p className="text-muted mb-0">{selectedItem.averageCost}</p>
                        </div>
                      )}
                      {selectedItem.openingHours && (
                        <div className="col-md-6 mb-2">
                          <h6 className="fw-bold mb-1"><i className="bi bi-clock text-info me-2"></i>Opening Hours</h6>
                          <p className="text-muted mb-0">{selectedItem.openingHours}</p>
                        </div>
                      )}
                      {selectedItem.contactNumber && (
                        <div className="col-md-6 mb-2">
                          <h6 className="fw-bold mb-1"><i className="bi bi-telephone text-primary me-2"></i>Contact</h6>
                          <p className="text-muted mb-0">{selectedItem.contactNumber}</p>
                        </div>
                      )}
                    </div>
                    {selectedItem.facilities && selectedItem.facilities.length > 0 && (
                      <div className="mb-3">
                        <h6 className="fw-bold mb-2">Facilities</h6>
                        <ul className="list-unstyled">
                          {selectedItem.facilities.map((facility: string, idx: number) => (
                            <li key={idx} className="mb-1">
                              <i className="bi bi-check-circle text-success me-2"></i>
                              {facility}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedItem.popularFor && selectedItem.popularFor.length > 0 && (
                      <div className="mb-3">
                        <h6 className="fw-bold mb-2">Popular For</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {selectedItem.popularFor.map((item: string, idx: number) => (
                            <span key={idx} className="badge bg-primary">{item}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedItem(null);
                    setModalType(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationDetail;
