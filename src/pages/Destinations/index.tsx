import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  getAllDestinationGuides, 
  filterDestinationGuides, 
  type DestinationGuide,
  type LocationData
} from '../../services/destinationGuideService';
import DestinationCard from '../../components/DestinationCard';
import './Destinations.css';

interface FilterState {
  search?: string;
  continentId?: string;
  countryId?: string;
  stateId?: string;
  cityId?: string;
}

const DestinationsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for all data
  const [data, setData] = useState<{
    destinations: DestinationGuide[];
    continents: LocationData[];
    countries: (LocationData & { continentId: string })[];
    states: (LocationData & { countryId: string; continentId: string })[];
    cities: (LocationData & { stateId?: string; countryId: string; continentId: string })[];
  }>({
    destinations: [],
    continents: [],
    countries: [],
    states: [],
    cities: []
  });
  
  // Get filters from URL params
  const filters = useMemo<FilterState>(() => ({
    search: searchParams.get('search') || undefined,
    continentId: searchParams.get('continentId') || undefined,
    countryId: searchParams.get('countryId') || undefined,
    stateId: searchParams.get('stateId') || undefined,
    cityId: searchParams.get('cityId') || undefined,
  }), [searchParams]);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    pages: 1
  });

  // Fetch all data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all data from the API
        const response = await getAllDestinationGuides();
        
        // Update state with all data
        setData({
          destinations: response.destinationData,
          continents: response.continentData,
          countries: response.countryData,
          states: response.stateData,
          cities: response.cityData
        });
        
        // Update pagination with total count
        setPagination(prev => ({
          ...prev,
          total: response.destinationData.length,
          pages: Math.ceil(response.destinationData.length / prev.limit)
        }));
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load destination data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Filter destinations based on current filters
  const filteredDestinations = useMemo(() => {
    return filterDestinationGuides(data.destinations, filters);
  }, [data.destinations, filters]);
  
  // Update pagination when filtered results change
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      total: filteredDestinations.length,
      pages: Math.ceil(filteredDestinations.length / prev.limit)
    }));
  }, [filteredDestinations]);
  
  // Get paginated results
  const paginatedDestinations = useMemo(() => {
    const start = (pagination.page - 1) * pagination.limit;
    return filteredDestinations.slice(start, start + pagination.limit);
  }, [filteredDestinations, pagination.page, pagination.limit]);
  
  // Get filtered location data based on current filters
  const filteredCountries = useMemo(() => {
    return filters.continentId 
      ? data.countries.filter(c => c.continentId === filters.continentId)
      : data.countries;
  }, [data.countries, filters.continentId]);
  
  const filteredStates = useMemo(() => {
    return filters.countryId 
      ? data.states.filter(s => s.countryId === filters.countryId)
      : [];
  }, [data.states, filters.countryId]);
  
  const filteredCities = useMemo(() => {
    if (filters.stateId) {
      return data.cities.filter(c => c.stateId === filters.stateId);
    } else if (filters.countryId) {
      return data.cities.filter(c => c.countryId === filters.countryId);
    }
    return [];
  }, [data.cities, filters.stateId, filters.countryId]);

  // Update URL with new filters
  const updateFilters = (newFilters: Partial<FilterState>) => {
    const params = new URLSearchParams();
    
    // Combine existing filters with new ones
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    
    // Add non-empty filters to URL
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value) params.set(key, String(value));
    });
    
    // Navigate to the new URL
    navigate({ search: params.toString() });
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const searchTerm = formData.get('search') as string;
    
    updateFilters({ 
      search: searchTerm || undefined,
      // Reset location filters when searching
      continentId: undefined,
      countryId: undefined,
      stateId: undefined,
      cityId: undefined
    });
  };
  
  const handleFilterChange = (filter: keyof FilterState, value: string | undefined) => {
    // When changing a filter, we need to clear all child filters
    // For example, changing country should clear state and city
    const updates: Partial<FilterState> = { [filter]: value };
    
    if (filter === 'continentId') {
      updates.countryId = undefined;
      updates.stateId = undefined;
      updates.cityId = undefined;
    } else if (filter === 'countryId') {
      updates.stateId = undefined;
      updates.cityId = undefined;
    } else if (filter === 'stateId') {
      updates.cityId = undefined;
    }
    
    updateFilters(updates);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    // Clear all filters by navigating to the base URL
    navigate('/destinations');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Explore Destinations</h1>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="d-flex">
          <input
            type="search"
            name="search"
            className="form-control me-2"
            placeholder="Search destinations..."
            defaultValue={filters.search}
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
          {(filters.search || filters.continentId || filters.countryId || filters.stateId ) && (
            <button type="button" className="btn btn-outline-secondary ms-2" onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      </form>

      {/* Filters */}
      <div className="mb-4">
        <h5>Filter by:</h5>
        <div className="d-flex flex-wrap gap-2">
          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={filters.continentId || ''}
            onChange={(e) => handleFilterChange('continentId', e.target.value || undefined)}
          >
            <option value="">All Continents</option>
            {data.continents.map(continent => (
              <option key={continent.id} value={continent.id}>
                {continent.name}
              </option>
            ))}
          </select>
          
          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={filters.countryId || ''}
            onChange={(e) => handleFilterChange('countryId', e.target.value || undefined)}
            disabled={!filters.continentId}
          >
            <option value="">All Countries</option>
            {filteredCountries.map(country => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
          
          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={filters.stateId || ''}
            onChange={(e) => handleFilterChange('stateId', e.target.value || undefined)}
            disabled={!filters.countryId}
          >
            <option value="">All States/Regions</option>
            {filteredStates.map(state => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>
          
          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={filters.cityId || ''}
            onChange={(e) => handleFilterChange('cityId', e.target.value || undefined)}
            disabled={!filters.countryId}
          >
            <option value="">All Cities</option>
            {filteredCities.map(city => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Finding amazing destinations for you...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="alert alert-danger my-4">
          {error}
        </div>
      )}

      {/* No Results */}
      {!loading && !error && filteredDestinations.length === 0 && (
        <div className="text-center my-5">
          <h3>No destinations found</h3>
          <p className="text-muted">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <button type="button" className="btn btn-outline-primary" onClick={clearFilters}>
            Clear all filters
          </button>
        </div>
      )}
      
      {/* No Data */}
      {!loading && !error && data.destinations.length === 0 && (
        <div className="card text-center p-5 my-5">
          <div className="card-body">
            <i className="bi bi-globe-americas display-1 text-muted mb-4"></i>
            <h3>No Destinations Available</h3>
            <p className="text-muted">
              We couldn't find any destinations. Please check back later or contact support.
            </p>
          </div>
        </div>
      )}

      {/* Destinations Grid */}
      {!loading && paginatedDestinations.length > 0 && (
        <>
          <div 
            style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem',
              marginTop: '1rem',
              marginBottom: '2rem'
            }}
          >
            {paginatedDestinations.map((destination) => (
              <div key={destination.id}>
                <DestinationCard destination={{
                  ...destination
                }} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="d-flex justify-content-center mt-5">
              <nav aria-label="Destination pagination">
                <ul className="pagination">
                  <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </button>
                  </li>
                  
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    // Show page numbers with ellipsis
                    let pageNum;
                    if (pagination.pages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.pages - 2) {
                      pageNum = pagination.pages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    
                    return (
                      <li key={pageNum} className={`page-item ${pagination.page === pageNum ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(pageNum)}>
                          {pageNum}
                        </button>
                      </li>
                    );
                  })}
                  
                  <li className={`page-item ${pagination.page === pagination.pages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DestinationsPage;
