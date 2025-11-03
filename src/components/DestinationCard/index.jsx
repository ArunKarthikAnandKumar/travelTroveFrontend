import React from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../utils/constatnts';
import { formatThumbnailForDisplay, PLACEHOLDER_IMAGE } from '../../utils/imageUtils';
import './DestinationCard.css';

const DestinationCard = ({ destination }) => {
  // Handle undefined/null destination
  if (!destination || typeof destination !== 'object') {
    return (
      <div className="card destination-card h-100">
        <div className="card-body">
          <p className="card-text text-muted">Destination information unavailable</p>
        </div>
      </div>
    );
  }

  // Safe destructuring with fallbacks - backend returns flat structure
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

  // Ensure we have an id
  if (!id) {
    return (
      <div className="card destination-card h-100">
        <div className="card-body">
          <p className="card-text text-muted">Invalid destination data</p>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="card h-100"
      style={{
        border: 'none',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        marginBottom: '0'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}
    >
      <Link to={`/destinations/${id}`} className="text-decoration-none text-dark">
        <div className="position-relative" style={{ height: '220px', width: '100%' }}>
          <img 
            src={formatThumbnailForDisplay(thumbnail, BASE_URL)}
            className="card-img-top" 
            alt={title || 'Destination image'}
            style={{ 
              height: '220px', 
              objectFit: 'cover', 
              width: '100%',
              display: 'block',
              position: 'absolute',
              top: 0,
              left: 0
            }}
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER_IMAGE;
            }}
          />
          <div 
            className="image-fallback"
            style={{
              height: '220px',
              width: '100%',
              backgroundColor: '#e9ecef',
              display: thumbnail ? 'none' : 'block',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 0
            }}
          />
          {avgRating > 0 && (
            <div className="position-absolute top-0 end-0 m-2 bg-warning px-2 py-1 rounded" style={{ zIndex: 2 }}>
              <i className="fas fa-star text-white me-1"></i>
              <span className="text-white fw-bold">{avgRating.toFixed(1)}</span>
            </div>
          )}
          {highlights && highlights.length > 0 && highlights[0] && (
            <div className="position-absolute top-0 start-0 m-2" style={{ maxWidth: 'calc(100% - 80px)', zIndex: 2 }}>
              <span 
                className="badge bg-success text-white" 
                style={{ 
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                  display: 'inline-block',
                  padding: '0.35em 0.65em',
                  fontSize: '0.875rem'
                }}
                title={highlights[0]}
              >
                {highlights[0]}
              </span>
            </div>
          )}
        </div>
        
        <div 
          className="card-body d-flex flex-column" 
          style={{ padding: '1.25rem', minHeight: '200px' }}
        >
          <h5 
            className="card-title mb-2" 
            style={{ 
              fontSize: '1.15rem',
              fontWeight: '600',
              lineHeight: '1.4',
              minHeight: '3em',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {title || 'Untitled Destination'}
          </h5>
          <h6 
            className="text-muted mb-3" 
            style={{ fontSize: '0.875rem' }}
          >
            {formatLocation()}
          </h6>
          
          <p 
            className="flex-grow-1 mb-3" 
            style={{ 
              fontSize: '0.9rem',
              color: '#6c757d',
              lineHeight: '1.5',
              minHeight: '3em',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {overview && overview.length > 150 ? `${overview.substring(0, 150)}...` : (overview || 'No description available')}
          </p>
          
          <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
            <span className="text-primary fw-semibold" style={{ fontSize: '0.9rem' }}>
              View Details <i className="fas fa-arrow-right ms-1"></i>
            </span>
            {continent && (
              <span className="badge bg-light text-dark" style={{ fontSize: '0.75rem' }}>
                {continent}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default DestinationCard;
