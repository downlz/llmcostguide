/**
 * Core data types for LLMCostGuide application
 */

/**
 * @typedef {Object} Model
 * @property {string} id - Unique identifier
 * @property {string} model_name - Model name
 * @property {'OpenRouter'|'TogetherAI'} provider - Provider name
 * @property {number} context_limit - Context window size
 * @property {number} input_price_per_1M_tokens - Input token price per 1K tokens
 * @property {number} output_price_per_1M_tokens - Output token price per 1K tokens
 * @property {number|null} caching_price_per_1M_tokens - Caching token price per 1K tokens
 * @property {'Text'|'Images'|'Videos'|'Embeddings'} model_type - Model type
 * @property {string} added_on - Creation date
 * @property {string} updated_on - Update date
 * @property {string} external_model_id - External model ID
 * @property {string} context_window - Human-readable context size
 * @property {string} description - Model description
 * @property {boolean} is_active - Active status
 */

/**
 * @typedef {Object} TableColumn
 * @property {string} id - Column identifier
 * @property {string} label - Column label
 * @property {boolean} sortable - Whether column is sortable
 * @property {'left'|'right'|'center'=} align - Text alignment
 * @property {string=} width - Column width
 * @property {Function=} render - Custom render function
 */

/**
 * @typedef {Object} SortConfig
 * @property {string} key - Sort key
 * @property {'asc'|'desc'} direction - Sort direction
 */

/**
 * @typedef {Object} Provider
 * @property {string} label - Provider display name
 * @property {string} value - Provider value
 * @property {string=} logo - Provider logo URL
 * @property {string=} color - Provider color
 */

/**
 * @typedef {Object} ImportResult
 * @property {boolean} success - Import success status
 * @property {string} message - Result message
 * @property {number} recordsAdded - Number of records added
 * @property {number} recordsUpdated - Number of records updated
 * @property {Array<ImportError>} errors - Import errors
 */

/**
 * @typedef {Object} ImportError
 * @property {number} row - Row number
 * @property {string} field - Field name
 * @property {string} message - Error message
 * @property {any} data - Raw data
 */

/**
 * @typedef {Object} UseSearchReturn
 * @property {string} searchQuery - Current search query
 * @property {Function} setSearchQuery - Function to set search query
 * @property {Array} filteredData - Filtered data
 * @property {boolean} isSearching - Search loading state
 */

/**
 * @typedef {Object} UseSortingReturn
 * @property {SortConfig} sortConfig - Current sort configuration
 * @property {Function} setSortConfig - Function to set sort configuration
 * @property {Array} sortedData - Sorted data
 */

/**
 * @typedef {Object} UsePricingDataReturn
 * @property {Array<Model>} models - Models data
 * @property {boolean} isLoading - Loading state
 * @property {Error|null} error - Error object
 * @property {Function} refetch - Refetch function
 */

// Component Props

/**
 * @typedef {Object} SearchBarProps
 * @property {string} value - Current search value
 * @property {Function} onChange - Change handler
 * @property {string=} placeholder - Placeholder text
 * @property {number=} debounceMs - Debounce delay in milliseconds
 */

/**
 * @typedef {Object} ProviderSelectorProps
 * @property {Array<string>} value - Selected providers
 * @property {Function} onChange - Change handler
 * @property {Array<Provider>} providers - Available providers
 */

/**
 * @typedef {Object} PricingTableProps
 * @property {Array<Model>} models - Models data
 * @property {boolean} isLoading - Loading state
 * @property {Function} onSort - Sort handler
 * @property {SortConfig} sortConfig - Current sort configuration
 */

/**
 * @typedef {Object} ModelCardProps
 * @property {Model} model - Model data
 * @property {Function=} onModelClick - Model click handler
 */

/**
 * @typedef {Object} DataImportProps
 * @property {Function=} onImportComplete - Import completion handler
 */

/**
 * @typedef {Object} HeaderProps
 * @property {string} searchQuery - Current search query
 * @property {Function} onSearchChange - Search change handler
 * @property {Array<string>} selectedProviders - Selected providers
 * @property {Function} onProviderChange - Provider change handler
 */

// Export all types for use in components
export {
  Model,
  TableColumn,
  SortConfig,
  Provider,
  ImportResult,
  ImportError,
  UseSearchReturn,
  UseSortingReturn,
  UsePricingDataReturn
};