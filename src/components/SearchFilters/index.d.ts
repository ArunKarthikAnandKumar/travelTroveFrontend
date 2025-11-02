import React from 'react';

export interface SearchFiltersProps {
  onSearch: (filters: {
    search?: string;
    continent?: string;
    country?: string;
    state?: string;
    city?: string;
  }) => void;
  loading?: boolean;
}

declare const SearchFilters: React.FC<SearchFiltersProps>;
export default SearchFilters;

