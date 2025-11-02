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
        setDestination(response.data);
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
      navigate('/visitor/login');
      return;
    }

    try {
      if (isFavorite) {
        await removeDestinationFromFavorites(id!);
        setIsFavorite(false);
      } else {
        await addDestinationToFavorites(id!);
        setIsFavorite(true);
      }
    } catch (error) {
      alert('Failed to update favorite');
    }
  };

  const handleAddReview = async () => {
    if (!isAuthenticated) {
      alert('Please login to leave a review');
      navigate('/visitor/login');
      return;
    }

    if (reviewRating < 1 || reviewRating > 5) {
      alert('Please select a rating between 1 and 5');
      return;
    }

    try {
      setSubmittingReview(true);
      await addDestinationReview(id!, { rating: reviewRating, comment: reviewComment });
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
              <img
                src={
                  destination.thumbnail
                    ? `${BASE_URL}/${destination.thumbnail}`
                    : 'https://via.placeholder.com/900x400?text=No+Image'
                }
                alt={destination.title}
                className="img-fluid rounded mb-4"
                style={{ height: '400px', objectFit: 'cover', width: '100%' }}
              />

              <h1 className="fw-bold mb-3" style={{ wordWrap: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal' }}>{destination.title}</h1>
              <p className="text-muted">
                <i className="bi bi-geo-alt-fill me-2"></i>
                {[destination.city, destination.state, destination.country, destination.continent]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            </div>

            {/* Details Sections */}
            {[
              { title: 'Overview', text: destination.overview },
              { title: 'History', text: destination.history },
              { title: 'Culture', text: destination.culture },
            ]
              .filter((section) => section.text)
              .map((section, i) => (
                <div key={i} className="content-section bg-white rounded shadow-sm p-4 p-lg-5 mb-4">
                  <h4 className="fw-semibold mb-3">{section.title}</h4>
                  <p className="text-muted">{section.text}</p>
                </div>
              ))}

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

            {/* Reviews */}
            <div className="content-section bg-white rounded shadow-sm p-4 p-lg-5 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-semibold mb-0">Reviews</h4>
                {isAuthenticated && (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                  >
                    Add Review
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
    </div>
  );
};

export default DestinationDetail;
