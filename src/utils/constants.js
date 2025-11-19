/**
 * Application constants
 */

export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'LLMCostGuide',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
};

export const API_ENDPOINTS = {
  openrouter: import.meta.env.VITE_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/models',
  togetherai: import.meta.env.VITE_TOGETHERAI_API_URL || 'https://www.together.ai/api/pricing',
};

export const PROVIDERS = [
  {
    label: 'All Providers',
    value: 'all',
    color: '#2196f3',
  },
  {
    label: 'OpenRouter',
    value: 'OpenRouter',
    logo: 'https://openrouter.ai/images/logo.png',
    color: '#00d4aa',
  },
  {
    label: 'TogetherAI',
    value: 'TogetherAI',
    logo: 'https://together.ai/images/logo.png',
    color: '#6366f1',
  },
];

export const MODEL_TYPES = [
  { label: 'Text', value: 'Text', icon: 'text' },
  { label: 'Images', value: 'Images', icon: 'image' },
  { label: 'Videos', value: 'Videos', icon: 'video' },
  { label: 'Embeddings', value: 'Embeddings', icon: 'embed' },
];

export const SORT_OPTIONS = [
  { label: 'Model Name', value: 'model_name' },
  { label: 'Provider', value: 'provider' },
  { label: 'Input Price', value: 'input_price_per_1k_tokens' },
  { label: 'Output Price', value: 'output_price_per_1k_tokens' },
  { label: 'Context Size', value: 'context_limit' },
  { label: 'Type', value: 'model_type' },
  { label: 'Added Date', value: 'added_on' },
];

export const TABLE_COLUMNS = [
  {
    id: 'model_name',
    label: 'Model Name',
    sortable: true,
    align: 'left',
  },
  {
    id: 'provider',
    label: 'Provider',
    sortable: true,
    align: 'center',
  },
  {
    id: 'context_limit',
    label: 'Context',
    sortable: true,
    align: 'center',
  },
  {
    id: 'input_price_per_1M_tokens',
    label: 'Input Price',
    sortable: true,
    align: 'right',
  },
  {
    id: 'output_price_per_1M_tokens',
    label: 'Output Price',
    sortable: true,
    align: 'right',
  },
  {
    id: 'caching_price_per_1M_tokens',
    label: 'Caching Price',
    sortable: true,
    align: 'right',
  },
  {
    id: 'model_type',
    label: 'Type',
    sortable: true,
    align: 'center',
  },
  {
    id: 'added_on',
    label: 'Added On',
    sortable: true,
    align: 'center',
  },
];

export const PAGINATION = {
  defaultPageSize: 25,
  pageSizeOptions: [10, 25, 50, 100],
};

export const SEARCH_CONFIG = {
  debounceMs: 300,
  minQueryLength: 2,
  searchFields: ['model_name', 'provider', 'description'],
};

export const BREAKPOINTS = {
  mobile: 600,
  tablet: 1024,
  desktop: 1440,
};

export const ANIMATION = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  },
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  FETCH_ERROR: 'Failed to fetch data. Please try again.',
  IMPORT_ERROR: 'Failed to import data. Please check the file format.',
  VALIDATION_ERROR: 'Invalid data format. Please check your input.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

export const SUCCESS_MESSAGES = {
  IMPORT_SUCCESS: 'Data imported successfully!',
  SYNC_SUCCESS: 'Data synchronized successfully!',
  UPDATE_SUCCESS: 'Settings updated successfully!',
};

export const ROUTES = {
  HOME: '/',
  ADMIN: '/admin',
  IMPORT: '/admin/import',
  SYNC: '/admin/sync',
};