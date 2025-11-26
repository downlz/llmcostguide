import { DateTime } from 'luxon';

/**
 * Utility functions for formatting data in LLMCostGuide
 */

/**
 * Clean and convert price value to number
 * @param {any} price - Price value (could be string, number, etc.)
 * @returns {number|null} Cleaned numeric value or null
 */
const cleanPriceValue = (price) => {
  if (price === null || price === undefined) {
    return null;
  }
  
  // Handle string values with currency symbols
  if (typeof price === 'string') {
    // Remove currency symbols, spaces, and convert to number
    const cleaned = price.replace(/[$,\s]/g, '').trim();
    const numValue = parseFloat(cleaned);
    return isNaN(numValue) ? null : numValue;
  }
  
  // Handle numeric values
  if (typeof price === 'number') {
    return isNaN(price) ? null : price;
  }
  
  return null;
};

/**
 * Format price as currency
 * @param {any} price - Price value (number or string)
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
  const cleanPrice = cleanPriceValue(price);
  
  if (cleanPrice === null) {
    return 'N/A';
  }
  
  if (cleanPrice === 0) {
    return 'Free';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  }).format(cleanPrice);
};

/**
 * Format price per 1K tokens
 * @param {any} price - Price from database (could be per 1K or per 1M depending on provider)
 * @param {string} provider - Provider name to determine pricing unit
 * @returns {string} Formatted price value converted to per 1K tokens
 */
export const formatPricePer1KTokens = (price, provider) => {
  const cleanPrice = cleanPriceValue(price);
  
  if (cleanPrice === null) {
    return 'N/A';
  }
  
  if (cleanPrice === 0) {
    return 'Free';
  }
  
  // Convert price to per 1K tokens based on provider
  let pricePer1K = cleanPrice;
  if (provider === 'OpenRouter' && cleanPrice > 0) {
    // OpenRouter prices are already per 1K tokens
    pricePer1K = cleanPrice * 1000000 ;
  } else {
    // Other providers store prices per 1M tokens, so divide by 1000
    pricePer1K = cleanPrice;
  }
  
  return formatPrice(pricePer1K);
};

/**
 * Format context limit
 * @param {number} limit - Context limit
 * @returns {string} Formatted context size
 */
export const formatContextLimit = (limit) => {
  if (!limit || isNaN(limit)) {
    return 'N/A';
  }
  
  if (limit >= 1000000) {
    return `${(limit / 1000000).toFixed(1)}M`;
  } else if (limit >= 1000) {
    return `${(limit / 1000).toFixed(0)}K`;
  } else {
    return limit.toString();
  }
};

/**
 * Format context window (human readable)
 * @param {number} limit - Context limit
 * @returns {string} Human readable context window
 */
export const formatContextWindow = (limit) => {
  const formatted = formatContextLimit(limit);
  return `${formatted} Context`;
};

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) {
    return 'N/A';
  }
  
  try {
    const date = DateTime.fromISO(dateString);
    if (!date.isValid) {
      return 'Invalid Date';
    }
    
    return date.toFormat('MMM dd, yyyy');
  } catch (error) {
    return 'Invalid Date';
  }
};

/**
 * Format relative time (e.g., "2 days ago")
 * @param {string} dateString - ISO date string
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) {
    return 'Unknown';
  }
  
  try {
    const date = DateTime.fromISO(dateString);
    if (!date.isValid) {
      return 'Invalid Date';
    }
    
    const now = DateTime.now();
    const diff = now.diff(date, ['days', 'hours', 'minutes']);
    
    if (diff.days > 7) {
      return date.toFormat('MMM dd, yyyy');
    } else if (diff.days > 0) {
      return `${Math.floor(diff.days)} day${Math.floor(diff.days) === 1 ? '' : 's'} ago`;
    } else if (diff.hours > 0) {
      return `${Math.floor(diff.hours)} hour${Math.floor(diff.hours) === 1 ? '' : 's'} ago`;
    } else if (diff.minutes > 0) {
      return `${Math.floor(diff.minutes)} minute${Math.floor(diff.minutes) === 1 ? '' : 's'} ago`;
    } else {
      return 'Just now';
    }
  } catch (error) {
    return 'Invalid Date';
  }
};

/**
 * Get provider badge styling
 * @param {string} provider - Provider name
 * @returns {Object} Styling configuration
 */
export const getProviderBadge = (provider) => {
  const providerConfig = {
    OpenRouter: {
      color: '#00d4aa',
      backgroundColor: '#e6fff9',
      textColor: '#006644',
    },
    TogetherAI: {
      color: '#6366f1',
      backgroundColor: '#eef2ff',
      textColor: '#3730a3',
    },
    'Moonshot AI': {
      color: '#8b5cf6',
      backgroundColor: '#f3e8ff',
      textColor: '#6d28d9',
    },
  };
  
  return providerConfig[provider] || {
    color: '#666',
    backgroundColor: '#f5f5f5',
    textColor: '#333',
  };
};

/**
 * Get model type icon and styling
 * @param {string} type - Model type
 * @returns {Object} Type configuration
 */
export const getModelTypeConfig = (type) => {
  const typeConfig = {
    Text: {
      icon: '📝',
      color: '#2196f3',
      backgroundColor: '#e3f2fd',
    },
    Images: {
      icon: '🖼️',
      color: '#ff9800',
      backgroundColor: '#fff3e0',
    },
    Videos: {
      icon: '🎥',
      color: '#e91e63',
      backgroundColor: '#fce4ec',
    },
    Embeddings: {
      icon: '🔢',
      color: '#4caf50',
      backgroundColor: '#e8f5e8',
    },
  };
  
  return typeConfig[type] || {
    icon: '🤖',
    color: '#666',
    backgroundColor: '#f5f5f5',
  };
};

/**
 * Format percentage
 * @param {number} value - Percentage value (0-100)
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }
  
  return `${value.toFixed(1)}%`;
};

/**
 * Format number with thousand separators
 * @param {number} value - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  
  return new Intl.NumberFormat('en-US').format(value);
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Get price comparison styling
 * @param {number} price - Price to compare
 * @param {Array<number>} prices - Array of all prices for comparison
 * @returns {Object} Comparison styling
 */
export const getPriceComparisonStyle = (price, prices) => {
  if (!price || !prices || prices.length === 0) {
    return { color: '#666', fontWeight: 'normal' };
  }
  
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  
  if (price === minPrice) {
    return { color: '#4caf50', fontWeight: 'bold' };
  } else if (price === maxPrice) {
    return { color: '#f44336', fontWeight: 'bold' };
  } else {
    return { color: '#666', fontWeight: 'normal' };
  }
};

/**
 * Calculate savings percentage
 * @param {number} originalPrice - Original price
 * @param {number} currentPrice - Current price
 * @returns {number} Savings percentage
 */
export const calculateSavingsPercentage = (originalPrice, currentPrice) => {
  if (!originalPrice || !currentPrice || originalPrice === 0) {
    return 0;
  }
  
  return ((originalPrice - currentPrice) / originalPrice) * 100;
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) {
    return '0 B';
  }
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generate slug from text
 * @param {string} text - Text to convert to slug
 * @returns {string} Generated slug
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};