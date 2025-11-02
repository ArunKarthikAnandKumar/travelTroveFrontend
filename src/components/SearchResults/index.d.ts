import React from 'react';

export interface SearchResultsProps {
  filters?: {
    search?: string;
    continent?: string;
    country?: string;
    state?: string;
    city?: string;
  };
  searchTriggered?: boolean;
}

declare const SearchResults: React.FC<SearchResultsProps>;
export default SearchResults;

