import { useState, useEffect, useMemo } from 'react';
import { debounce } from '../utils/formatters.js';
import { SEARCH_CONFIG } from '../utils/constants.js';

/**
 * Custom hook for handling search functionality with debouncing
 * @param {Array} data - Data to search through
 * @param {Array<string>} searchFields - Fields to search in
 * @param {number} debounceMs - Debounce delay in milliseconds
 * @returns {Object} Search functionality
 */
export const useSearch = (data, searchFields, debounceMs = SEARCH_CONFIG.debounceMs) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce((query) => {
      setIsSearching(false);
    }, debounceMs),
    [debounceMs]
  );

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      return data;
    }

    const query = searchQuery.toLowerCase().trim();
    const searchTerms = query.split(' ').filter(term => term.length > 0);

    return data.filter(item => {
      // Search in all specified fields
      const searchString = searchFields
        .map(field => {
          const value = item[field];
          return value ? String(value).toLowerCase() : '';
        })
        .join(' ');

      // All search terms must be present (AND logic)
      return searchTerms.every(term => searchString.includes(term));
    });
  }, [data, searchQuery, searchFields]);

  // Handle search query change
  const handleSearchChange = (newQuery) => {
    setSearchQuery(newQuery);
    
    // Show searching state if query is not empty
    if (newQuery && newQuery.trim().length > 0) {
      setIsSearching(true);
      debouncedSearch(newQuery);
    } else {
      setIsSearching(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };

  // Get search statistics
  const searchStats = useMemo(() => ({
    totalItems: data.length,
    filteredItems: filteredData.length,
    hasActiveSearch: searchQuery.trim().length > 0,
    searchTerms: searchQuery.toLowerCase().trim().split(' ').filter(term => term.length > 0),
  }), [data, filteredData, searchQuery]);

  return {
    searchQuery,
    setSearchQuery: handleSearchChange,
    clearSearch,
    filteredData,
    isSearching,
    searchStats,
  };
};

export default useSearch;