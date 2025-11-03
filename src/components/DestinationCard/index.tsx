import React from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../utils/constatnts';
import { formatThumbnailForDisplay, PLACEHOLDER_IMAGE } from '../../utils/imageUtils';
import './DestinationCard.css';

interface DestinationCardProps {
  destination: {
    id?: string;
    title?: string;
    overview?: string | null;
    thumbnail?: string | null;
    city?: string;
    state?: string | null;
    country?: string;
    continent?: string;
    avgRating?: number | null;
    highlights?: string[] | null;
  } | null | undefined;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  // Handle undefined/null destination with comprehensive check
  if (!destination || typeof destination !== 'object') {
    return (
      <div className="card h-100 destination-card">
        <div className="card-body">
          <p className="card-text text-muted">Destination information unavailable</p>
        </div>
      </div>
    );
  }

  // Safe destructuring with fallbacks
  const { 
    id = '', 
    title = '', 
    overview = '', 
    thumbnail = null, 
    city = '', 
    state = '', 
    country = '', 
    continent = '', 
    avgRating = 0, 
    highlights = [] 
  } = destination || {};
  
  // Format location string
  const formatLocation = () => {
    return [city, state, country].filter(Boolean).join(', ') || 'Location not specified';
  };

  // Render star rating
  const renderRating = () => {
    if (!avgRating) return <span className="text-muted small">No ratings yet</span>;
    
    const fullStars = Math.floor(avgRating);
    const hasHalfStar = avgRating % 1 >= 0.5;
    
    return (
      <div className="d-flex align-items-center">
        <div className="me-2">
          {[...Array(5)].map((_, i) => (
            <i
              key={i}
              className={`bi bi-star-fill ${i < fullStars ? 'text-warning' : 'text-muted'}`}
              style={{ opacity: i < fullStars || (i === fullStars && hasHalfStar) ? 1 : 0.3 }}
            />
          ))}
        </div>
        <span className="text-muted small">
          {avgRating.toFixed(1)} ({Math.floor(Math.random() * 100)} reviews)
        </span>
      </div>
    );
  };

  // Ensure we have an id before rendering the link
  if (!id) {
    return (
      <div className="card h-100 destination-card">
        <div className="card-body">
          <p className="card-text text-muted">Invalid destination data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-100 destination-card">
      <Link to={`/destinations/${id}`} className="text-decoration-none text-dark">
        <div className="position-relative">
          <img 
            src={formatThumbnailForDisplay(thumbnail, BASE_URL)} 
            alt={title || 'Destination image'}
            className="card-img-top"
            style={{ height: '200px', objectFit: 'cover' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
            }}
          />
          {highlights && highlights.length > 0 && highlights[0] && (
            <div className="position-absolute top-0 end-0 m-2">
              <span className="badge bg-success">
                {highlights[0]}
              </span>
            </div>
          )}
        </div>
        
        <div className="card-body d-flex flex-column">
          <h5 className="card-title h5 mb-2">{title || 'Untitled Destination'}</h5>
          <h6 className="card-subtitle text-muted mb-2 small">
            {formatLocation()}
          </h6>
          {renderRating()}
          <p className="card-text mt-2 flex-grow-1">
            {overview && overview.length > 100 ? `${overview.substring(0, 100)}...` : (overview || 'No description available')}
          </p>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <span className="text-primary fw-medium">View Details</span>
            {continent && <span className="text-muted small">{continent}</span>}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default DestinationCard;
