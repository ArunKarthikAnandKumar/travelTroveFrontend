import React from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = ({ onSearch }) => {
  const popularSearches = [
    { name: 'Paris', type: 'city' },
    { name: 'Japan', type: 'country' },
    { name: 'Bali', type: 'island' },
    { name: 'New York', type: 'city' },
  ];

  return (
    <section className="hero-section">
      <div className="hero-overlay">
        <div className="container h-100">
          <div className="hero-content text-center text-white">
            <h1 className="display-4 fw-bold mb-4">Discover Your Next Adventure</h1>
            <p className="lead mb-5">Find the perfect destination for your next trip with our curated travel guides</p>
            
            <div className="search-box mx-auto">
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Search destinations..."
                  id="hero-search-input"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      onSearch({ search: e.target.value.trim() });
                    }
                  }}
                />
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => {
                    const input = document.getElementById('hero-search-input');
                    if (input && input.value.trim()) {
                      onSearch({ search: input.value.trim() });
                    }
                  }}
                >
                  <i className="fas fa-search me-2"></i> Search
                </button>
              </div>
              
              <div className="popular-searches mt-3">
                <span className="text-white-50 me-2">Popular:</span>
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    className="btn btn-outline-light btn-sm me-2 mb-2"
                    onClick={() => onSearch({ search: search.name })}
                  >
                    {search.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="hero-stats mt-5 pt-4">
              <div className="row g-4">
                <div className="col-md-3 col-6">
                  <div className="stat-item">
                    <h3 className="display-6 fw-bold mb-1">500+</h3>
                    <p className="mb-0">Destinations</p>
                  </div>
                </div>
                <div className="col-md-3 col-6">
                  <div className="stat-item">
                    <h3 className="display-6 fw-bold mb-1">10K+</h3>
                    <p className="mb-0">Travel Guides</p>
                  </div>
                </div>
                <div className="col-md-3 col-6">
                  <div className="stat-item">
                    <h3 className="display-6 fw-bold mb-1">50K+</h3>
                    <p className="mb-0">Happy Travelers</p>
                  </div>
                </div>
                <div className="col-md-3 col-6">
                  <div className="stat-item">
                    <h3 className="display-6 fw-bold mb-1">24/7</h3>
                    <p className="mb-0">Support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
