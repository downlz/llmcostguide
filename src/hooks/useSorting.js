import { useState, useMemo } from 'react';

/**
 * Custom hook for handling table sorting functionality
 * @param {Array} data - Data to sort
 * @param {Object} initialConfig - Initial sort configuration
 * @returns {Object} Sorting functionality
 */
export const useSorting = (data, initialConfig = { key: 'model_name', direction: 'asc' }) => {
  const [sortConfig, setSortConfig] = useState(initialConfig);

  // Sort data based on current configuration
  const sortedData = useMemo(() => {
    if (!sortConfig.key) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (bValue === null || bValue === undefined) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }

      // Different sorting logic based on data type
      let comparison = 0;

      // Price sorting (handle numeric values with currency formatting)
      if (sortConfig.key.includes('price')) {
        const aPrice = parseFloat(aValue) || 0;
        const bPrice = parseFloat(bValue) || 0;
        comparison = aPrice - bPrice;
      }
      // Number sorting (context limits, etc.)
      else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      }
      // Date sorting
      else if (sortConfig.key.includes('date') || sortConfig.key.includes('_on')) {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        comparison = aDate.getTime() - bDate.getTime();
      }
      // String sorting (default)
      else {
        const aString = String(aValue).toLowerCase();
        const bString = String(bValue).toLowerCase();
        comparison = aString.localeCompare(bString, undefined, { 
          sensitivity: 'base',
          numeric: true 
        });
      }

      return sortConfig.direction === 'desc' ? -comparison : comparison;
    });
  }, [data, sortConfig]);

  // Handle column sorting
  const handleSort = (columnKey) => {
    setSortConfig(prevConfig => {
      // If clicking the same column, toggle direction
      if (prevConfig.key === columnKey) {
        return {
          key: columnKey,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      
      // If clicking a different column, start with ascending order
      return {
        key: columnKey,
        direction: 'asc'
      };
    });
  };

  // Reset to default sort
  const resetSort = () => {
    setSortConfig(initialConfig);
  };

  // Check if a column is currently sorted
  const isSorted = (columnKey) => {
    return sortConfig.key === columnKey;
  };

  // Get sort direction for a specific column
  const getSortDirection = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return null;
    }
    return sortConfig.direction;
  };

  // Get next sort direction (for cycling through states)
  const getNextSortDirection = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return 'asc';
    }
    return sortConfig.direction === 'asc' ? 'desc' : null; // null means no sort
  };

  // Apply multiple sort criteria
  const multiSort = (sortCriterias) => {
    if (!Array.isArray(sortCriterias) || sortCriterias.length === 0) {
      return;
    }

    const newSortedData = [...data].sort((a, b) => {
      for (const criteria of sortCriterias) {
        const aValue = a[criteria.key];
        const bValue = b[criteria.key];
        
        let comparison = 0;
        
        // Apply same sorting logic as above
        if (criteria.key.includes('price')) {
          const aPrice = parseFloat(aValue) || 0;
          const bPrice = parseFloat(bValue) || 0;
          comparison = aPrice - bPrice;
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        } else if (criteria.key.includes('date') || criteria.key.includes('_on')) {
          const aDate = new Date(aValue);
          const bDate = new Date(bValue);
          comparison = aDate.getTime() - bDate.getTime();
        } else {
          const aString = String(aValue).toLowerCase();
          const bString = String(bValue).toLowerCase();
          comparison = aString.localeCompare(bString, undefined, { 
            sensitivity: 'base',
            numeric: true 
          });
        }
        
        if (comparison !== 0) {
          return criteria.direction === 'desc' ? -comparison : comparison;
        }
      }
      return 0;
    });

    return newSortedData;
  };

  // Sort statistics
  const sortStats = useMemo(() => ({
    isSorted: !!sortConfig.key,
    sortedColumn: sortConfig.key,
    sortDirection: sortConfig.direction,
    totalItems: data.length,
  }), [data.length, sortConfig]);

  return {
    sortConfig,
    setSortConfig,
    sortedData,
    handleSort,
    resetSort,
    isSorted,
    getSortDirection,
    getNextSortDirection,
    multiSort,
    sortStats,
  };
};

export default useSorting;