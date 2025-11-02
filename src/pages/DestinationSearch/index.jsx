import React, { useState } from 'react';
import SearchFilters from '../../components/SearchFilters';
import SearchResults from '../../components/SearchResults';
import HeroSection from './HeroSection';
import './DestinationSearch.css';

const DestinationSearch = () => {
  const [searchFilters, setSearchFilters] = useState({});
  const [searchTriggered, setSearchTriggered] = useState(false);

  const handleSearch = (filters) => {
    setSearchFilters(filters);
    setSearchTriggered(true);
  };

  return (
    <div className="destination-search-page">
      {/* Hero Section */}
      <HeroSection onSearch={handleSearch} />

      {/* Search Filters */}
      <section className="search-section py-4 bg-light">
        <div className="container">
          <SearchFilters onSearch={handleSearch} />
        </div>
      </section>

      {/* Search Results */}
      <section className="results-section">
        <div className="container">
          <SearchResults 
            key={JSON.stringify(searchFilters)} // Force re-render when filters change
            filters={searchFilters}
            searchTriggered={searchTriggered}
          />
        </div>
      </section>
    </div>
  );
};

export default DestinationSearch;
