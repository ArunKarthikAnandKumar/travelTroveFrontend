import React, { useState, useEffect } from 'react';
import DestinationCard from '../DestinationCard';
import { searchDestinationGuides } from '../../api/destinationGuideService';
import './SearchResults.css';

const SearchResults = ({ filters = {}, searchTriggered = false }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    pages: 1
  });

  // Initial load - fetch popular destinations
  useEffect(() => {
    if (!searchTriggered) {
      const fetchPopularDestinations = async () => {
          try {
            setLoading(true);
            const data = await searchDestinationGuides({ 
              limit: 6,
              page: 1 
            });
            // Ensure all results have required fields
            const validResults = (data.data || [])
              .filter(item => item && typeof item === 'object' && item.id)
              .map(item => ({
                id: item.id || '',
                title: item.title || 'Untitled Destination',
                overview: item.overview || '',
                thumbnail: item.thumbnail || null,
                city: item.city || '',
                state: item.state || '',
                country: item.country || '',
                continent: item.continent || '',
                avgRating: item.avgRating || 0,
                highlights: Array.isArray(item.highlights) ? item.highlights : []
              }));
            setResults(validResults);
          setPagination(prev => ({
            ...prev,
            total: data.pagination?.total || 0,
            pages: data.pagination?.pages || 1
          }));
        } catch (err) {
          setError('Failed to load popular destinations. Please try again later.');
          console.error('Error fetching popular destinations:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchPopularDestinations();
    }
  }, [searchTriggered]);

  // Handle search when filters change
  useEffect(() => {
    if (searchTriggered) {
      if (Object.keys(filters).length > 0) {
        // Perform search with filters
        handleSearch(filters, 1);
      } else {
        // Show popular destinations when filters are cleared
        const fetchPopularDestinations = async () => {
          try {
            setLoading(true);
            setError(null);
            const data = await searchDestinationGuides({ 
              limit: 6,
              page: 1 
            });
            // Ensure all results have required fields
            const validResults = (data.data || [])
              .filter(item => item && typeof item === 'object' && item.id)
              .map(item => ({
                id: item.id || '',
                title: item.title || 'Untitled Destination',
                overview: item.overview || '',
                thumbnail: item.thumbnail || null,
                city: item.city || '',
                state: item.state || '',
                country: item.country || '',
                continent: item.continent || '',
                avgRating: item.avgRating || 0,
                highlights: Array.isArray(item.highlights) ? item.highlights : []
              }));
            setResults(validResults);
            setPagination(prev => ({
              ...prev,
              page: 1,
              total: data.pagination?.total || 0,
              pages: data.pagination?.pages || 1
            }));
          } catch (err) {
            setError('Failed to load destinations. Please try again later.');
            console.error('Error fetching destinations:', err);
          } finally {
            setLoading(false);
          }
        };
        fetchPopularDestinations();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, searchTriggered]);

  const handleSearch = async (searchFilters = {}, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await searchDestinationGuides({
        ...searchFilters,
        page,
        limit: pagination.limit
      });
      
      // Ensure all results have required fields and filter out invalid ones
      const validResults = (data.data || [])
        .filter(item => item && typeof item === 'object' && item.id)
        .map(item => ({
          id: item.id || '',
          title: item.title || 'Untitled Destination',
          overview: item.overview || '',
          thumbnail: item.thumbnail || null,
          city: item.city || '',
          state: item.state || '',
          country: item.country || '',
          continent: item.continent || '',
          avgRating: item.avgRating || 0,
          highlights: Array.isArray(item.highlights) ? item.highlights : []
        }));
      
      setResults(validResults);
      setPagination(prev => ({
        ...prev,
        page,
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 1
      }));
      
      // Scroll to results section
      const resultsSection = document.getElementById('search-results');
      if (resultsSection) {
        window.scrollTo({
          top: resultsSection.offsetTop - 20,
          behavior: 'smooth'
        });
      }
    } catch (err) {
      setError('An error occurred while searching. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.pages) return;
    handleSearch(filters, page);
  };

  const renderPagination = () => {
    if (pagination.pages <= 1) return null;

    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.pages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    items.push(
      <li key="prev" className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
        <button
          className="page-link"
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
        >
          Previous
        </button>
      </li>
    );

    // First page
    if (startPage > 1) {
      items.push(
        <li key={1} className={`page-item ${1 === pagination.page ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(1)}>
            {1}
          </button>
        </li>
      );
      if (startPage > 2) {
        items.push(<li key="start-ellipsis" className="page-item disabled"><span className="page-link">...</span></li>);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <li key={i} className={`page-item ${i === pagination.page ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      );
    }

    // Last page
    if (endPage < pagination.pages) {
      if (endPage < pagination.pages - 1) {
        items.push(<li key="end-ellipsis" className="page-item disabled"><span className="page-link">...</span></li>);
      }
      items.push(
        <li key={pagination.pages} className={`page-item ${pagination.pages === pagination.page ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(pagination.pages)}>
            {pagination.pages}
          </button>
        </li>
      );
    }

    // Next button
    items.push(
      <li key="next" className={`page-item ${pagination.page === pagination.pages ? 'disabled' : ''}`}>
        <button
          className="page-link"
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.pages}
        >
          Next
        </button>
      </li>
    );

    return (
      <div className="d-flex justify-content-center mt-4">
        <ul className="pagination mb-0">
          {items}
        </ul>
      </div>
    );
  };

  return (
    <section id="search-results" className="py-5">
      <div className="container">
        {error && (
          <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        )}

        {loading && results.length === 0 ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status" aria-hidden="true">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="ms-2">Loading destinations...</span>
          </div>
        ) : results.length > 0 ? (
          <>
            <h2 className="mb-4">
              {searchTriggered 
                ? `${pagination.total} ${pagination.total === 1 ? 'Destination' : 'Destinations'} Found`
                : 'Popular Destinations'
              }
            </h2>
            
            <div 
              style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem',
                marginTop: '1rem',
                marginBottom: '2rem'
              }}
            >
              {results
                .filter(destination => destination && destination.id) // Filter out invalid destinations
                .map(destination => (
                  <div key={destination.id}>
                    <DestinationCard destination={destination} />
                  </div>
              ))}
            </div>
            
            {renderPagination()}
          </>
        ) : searchTriggered && !loading ? (
          <div className="text-center py-5">
            <div className="mb-4">
              <i className="fas fa-search fa-3x text-muted mb-3"></i>
            </div>
            <h3>No destinations found</h3>
            <p className="text-muted mb-4">
              We couldn't find any destinations matching your search criteria.
            </p>
            <p className="text-muted">
              Try:
            </p>
            <ul className="list-unstyled text-muted">
              <li>• Using different keywords</li>
              <li>• Adjusting your filters</li>
              <li>• Checking your spelling</li>
              <li>• Browsing popular destinations</li>
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default SearchResults;
