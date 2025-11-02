import React, { useState, useEffect } from 'react';
import { getAllDestinationGuides } from '../../services/destinationGuideService';

const SearchFilters = ({ onSearch, loading }) => {
  const [filters, setFilters] = useState({
    search: '',
    continent: '',
    country: '',
    state: '',
    city: ''
  });
  
  const [locationData, setLocationData] = useState({
    continents: [],
    countries: [],
    states: [],
    cities: []
  });

  const [filteredOptions, setFilteredOptions] = useState({
    countries: [],
    states: [],
    cities: []
  });

  // Fetch initial data for dropdowns
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await getAllDestinationGuides();
        
        setLocationData({
          continents: data.continentData || [],
          countries: data.countryData || [],
          states: data.stateData || [],
          cities: data.cityData || []
        });
      } catch (error) {
        console.error('Error fetching filter options:', error);
        setLocationData({
          continents: [],
          countries: [],
          states: [],
          cities: []
        });
      }
    };

    fetchInitialData();
  }, []);

  // Update filtered options when continent/country/state changes
  useEffect(() => {
    if (filters.continent) {
      // Find continent by name
      const selectedContinent = locationData.continents.find(c => c.name === filters.continent);
      if (selectedContinent) {
        const filteredCountries = locationData.countries.filter(
          c => c.continentId === selectedContinent.id
        );
        setFilteredOptions(prev => ({
          ...prev,
          countries: filteredCountries,
          states: [],
          cities: []
        }));
      }
    } else {
      setFilteredOptions({
        countries: [],
        states: [],
        cities: []
      });
    }
  }, [filters.continent, locationData]);

  useEffect(() => {
    if (filters.country && filters.continent) {
      const selectedContinent = locationData.continents.find(c => c.name === filters.continent);
      const selectedCountry = locationData.countries.find(
        c => c.name === filters.country && c.continentId === selectedContinent?.id
      );
      if (selectedCountry) {
        const filteredStates = locationData.states.filter(
          s => s.countryId === selectedCountry.id
        );
        setFilteredOptions(prev => ({
          ...prev,
          states: filteredStates,
          cities: []
        }));
      }
    } else if (!filters.country) {
      setFilteredOptions(prev => ({
        ...prev,
        states: [],
        cities: []
      }));
    }
  }, [filters.country, filters.continent, locationData]);

  useEffect(() => {
    if (filters.state && filters.country) {
      const selectedCountry = locationData.countries.find(c => c.name === filters.country);
      const selectedState = locationData.states.find(
        s => s.name === filters.state && s.countryId === selectedCountry?.id
      );
      if (selectedState) {
        const filteredCities = locationData.cities.filter(
          c => c.stateId === selectedState.id
        );
        setFilteredOptions(prev => ({
          ...prev,
          cities: filteredCities
        }));
      }
    } else if (!filters.state) {
      setFilteredOptions(prev => ({
        ...prev,
        cities: []
      }));
    }
  }, [filters.state, filters.country, locationData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Reset dependent filters when parent changes
    if (name === 'continent') {
      setFilters({
        ...filters,
        continent: value,
        country: '',
        state: '',
        city: ''
      });
    } else if (name === 'country') {
      setFilters({
        ...filters,
        country: value,
        state: '',
        city: ''
      });
    } else if (name === 'state') {
      setFilters({
        ...filters,
        state: value,
        city: ''
      });
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Remove empty filters
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value.trim() !== '')
    );
    onSearch(activeFilters);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      continent: '',
      country: '',
      state: '',
      city: ''
    });
    onSearch({});
  };

  return (
    <div className="p-4 mb-4 bg-white rounded shadow-sm">
      <h5 className="mb-4">Find Your Next Adventure</h5>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <div className="mb-2">
            <label htmlFor="search" className="form-label fw-semibold">Search Destinations</label>
            <input
              type="text"
              id="search"
              name="search"
              className="form-control"
              placeholder="Search by destination name, city, country, or description..."
              value={filters.search}
              onChange={handleInputChange}
              style={{ height: '45px', fontSize: '16px', width: '100%' }}
            />
          </div>
        </div>
        <div 
          style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}
        >
          <div className="mb-2">
            <label htmlFor="continent" className="form-label fw-semibold">Continent</label>
            <select
              id="continent"
              name="continent"
              className="form-select"
              value={filters.continent}
              onChange={handleInputChange}
              style={{ 
                height: '45px', 
                fontSize: '16px',
                minHeight: '45px',
                padding: '0.375rem 2rem 0.375rem 0.75rem',
                width: '100%'
              }}
            >
              <option value="">Select Continent</option>
              {locationData.continents && locationData.continents.length > 0 ? (
                locationData.continents.map((item) => (
                  <option key={item.id} value={item.name}>{item.name}</option>
                ))
              ) : null}
            </select>
          </div>
          
          <div className="mb-2">
            <label htmlFor="country" className="form-label fw-semibold">Country</label>
            <select
              id="country"
              name="country"
              className="form-select"
              value={filters.country}
              onChange={handleInputChange}
              disabled={!filters.continent}
              style={{ 
                height: '45px', 
                fontSize: '16px',
                minHeight: '45px',
                padding: '0.375rem 2rem 0.375rem 0.75rem',
                opacity: filters.continent ? 1 : 0.6,
                cursor: filters.continent ? 'pointer' : 'not-allowed',
                width: '100%'
              }}
            >
              <option value="">Select Country</option>
              {filteredOptions.countries && filteredOptions.countries.length > 0 ? (
                filteredOptions.countries.map((item) => (
                  <option key={item.id} value={item.name}>{item.name}</option>
                ))
              ) : null}
            </select>
          </div>
          
          <div className="mb-2">
            <label htmlFor="state" className="form-label fw-semibold">State/Region</label>
            <select
              id="state"
              name="state"
              className="form-select"
              value={filters.state}
              onChange={handleInputChange}
              disabled={!filters.country}
              style={{ 
                height: '45px', 
                fontSize: '16px',
                minHeight: '45px',
                padding: '0.375rem 2rem 0.375rem 0.75rem',
                opacity: filters.country ? 1 : 0.6,
                cursor: filters.country ? 'pointer' : 'not-allowed',
                width: '100%'
              }}
            >
              <option value="">Select State/Region</option>
              {filteredOptions.states && filteredOptions.states.length > 0 ? (
                filteredOptions.states.map((item) => (
                  <option key={item.id} value={item.name}>{item.name}</option>
                ))
              ) : null}
            </select>
          </div>
          
          <div className="mb-2">
            <label htmlFor="city" className="form-label fw-semibold">City</label>
            <select
              id="city"
              name="city"
              className="form-select"
              value={filters.city}
              onChange={handleInputChange}
              disabled={!filters.state}
              style={{ 
                height: '45px', 
                fontSize: '16px',
                minHeight: '45px',
                padding: '0.375rem 2rem 0.375rem 0.75rem',
                opacity: filters.state ? 1 : 0.6,
                cursor: filters.state ? 'pointer' : 'not-allowed',
                width: '100%'
              }}
            >
              <option value="">Select City</option>
              {filteredOptions.cities && filteredOptions.cities.length > 0 ? (
                filteredOptions.cities.map((item) => (
                  <option key={item.id} value={item.name}>{item.name}</option>
                ))
              ) : null}
            </select>
          </div>
        </div>
        
        <div className="d-flex justify-content-between mt-3">
          <button
            type="button"
            className="btn btn-outline-secondary" 
            onClick={clearFilters}
            disabled={loading}
            style={{ minWidth: '120px' }}
          >
            Clear Filters
          </button>
          
          <button
            type="submit"
            className="btn btn-primary" 
            disabled={loading}
            style={{ minWidth: '180px' }}
          >
            {loading ? 'Searching...' : 'Search Destinations'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchFilters;
