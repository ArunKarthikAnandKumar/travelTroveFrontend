import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchFilters from '../../components/SearchFilters';
import SearchResults from '../../components/SearchResults';
import { subscribeNewsletter } from '../../api/userServices';

const Home: React.FC = () => {
  const [searchFilters, setSearchFilters] = useState({});
  const [searchTriggered, setSearchTriggered] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (filters: any) => {
    setSearchFilters(filters);
    setSearchTriggered(true);
    // Scroll to results
    setTimeout(() => {
      const resultsSection = document.getElementById('search-results');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const navigateToDestinations = () => {
    navigate('/destinations');
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section with Prominent Search */}
      <section 
        className="bg-primary text-white py-5 mb-5" 
        style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '0 0 2rem 2rem'
        }}
      >
        <div className="container">
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold mb-3">Welcome to TravelTrove</h1>
            <p className="lead mb-4">
              Discover curated destination guides created by experienced travel experts.<br/>
              Find hidden gems and popular spots around the world.
            </p>
          </div>
          
          {/* Prominent Search Box */}
          <div className="mb-4" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 15px' }}>
            <div className="input-group" style={{ height: '56px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search for destinations, cities, countries..."
                id="home-search-input"
                style={{ 
                  fontSize: '18px',
                  border: 'none',
                  borderRadius: '0.5rem 0 0 0.5rem',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                    handleSearch({ search: (e.target as HTMLInputElement).value.trim() });
                  }
                }}
              />
              <button
                className="btn btn-light"
                onClick={() => {
                  const input = document.getElementById('home-search-input') as HTMLInputElement;
                  if (input && input.value.trim()) {
                    handleSearch({ search: input.value.trim() });
                  }
                }}
                style={{
                  border: 'none',
                  borderRadius: '0 0.5rem 0.5rem 0',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                  padding: '0 30px',
                  fontSize: '18px',
                  fontWeight: '600'
                }}
              >
                <i className="fas fa-search me-2"></i> Search
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <button className="btn btn-outline-light btn-lg" onClick={navigateToDestinations}>
              Browse All Destinations
            </button>
            <button className="btn btn-outline-light btn-lg" onClick={() => handleSearch({})}>
              View Popular Destinations
            </button>
          </div>
        </div>
      </section>

      {/* Search Filters Section */}
      <section className="search-section py-4 bg-light">
        <div className="container">
          <SearchFilters onSearch={handleSearch} />
        </div>
      </section>

      {/* Search Results Section */}
      <section id="search-results" className="results-section py-5">
        <div className="container">
          <SearchResults 
            key={JSON.stringify(searchFilters)} 
            filters={searchFilters}
            searchTriggered={searchTriggered}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div 
            style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              textAlign: 'center'
            }}
          >
            <div 
              className="p-4 bg-white rounded"
              style={{
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
              }}
            >
              <i className="fas fa-map-marked-alt fa-3x text-primary mb-3 d-block"></i>
              <h4>Curated Guides</h4>
              <p className="text-muted mb-0">
                Expert travel guides for destinations around the world
              </p>
            </div>
            <div 
              className="p-4 bg-white rounded"
              style={{
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
              }}
            >
              <i className="fas fa-users fa-3x text-primary mb-3 d-block"></i>
              <h4>Travel Groups</h4>
              <p className="text-muted mb-0">
                Join groups and plan trips with fellow travelers
              </p>
            </div>
            <div 
              className="p-4 bg-white rounded"
              style={{
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
              }}
            >
              <i className="fas fa-route fa-3x text-primary mb-3 d-block"></i>
              <h4>Custom Itineraries</h4>
              <p className="text-muted mb-0">
                Create personalized travel plans based on your preferences
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription Section */}
      <NewsletterSection />
    </div>
  );
};

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setSubmitting(true);
      const response = await subscribeNewsletter(email);
      if (response.error === false) {
        setSuccess(true);
        setEmail('');
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(response.message || 'Failed to subscribe');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to subscribe. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-5 bg-primary text-white">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <h2 className="fw-bold mb-3">Subscribe to Our Newsletter</h2>
            <p className="lead mb-4">
              Get the latest travel tips, destination guides, and exclusive offers delivered to your inbox
            </p>
            
            {success && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                <i className="bi bi-check-circle me-2"></i>
                Thank you for subscribing! Check your email for confirmation.
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSuccess(false)}
                ></button>
              </div>
            )}

            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setError(null)}
                ></button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="d-flex gap-2 justify-content-center flex-wrap">
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ maxWidth: '400px' }}
                required
              />
              <button
                type="submit"
                className="btn btn-light btn-lg"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Subscribing...
                  </>
                ) : (
                  <>
                    <i className="bi bi-envelope-check me-2"></i>Subscribe
                  </>
                )}
              </button>
            </form>
            <p className="text-white-50 mt-3 small">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;