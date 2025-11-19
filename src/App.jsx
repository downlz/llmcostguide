import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Box, Typography, Paper } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

// Import components
import Layout from './components/layout/Layout.jsx';
import PricingTable from './components/pricing/PricingTable.jsx';
import Pagination from './components/common/Pagination.jsx';

// Import hooks and utilities
import useSearch from './hooks/useSearch.js';
import useSorting from './hooks/useSorting.js';
import usePricingData from './hooks/usePricingData.js';
import { lightTheme } from './styles/themes/index.js';

// Import constants
import { SEARCH_CONFIG, PAGINATION } from './utils/constants.js';

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * App content component that uses hooks requiring QueryClient
 */
function AppContent() {
  // State for search and filtering
  const [selectedProviders, setSelectedProviders] = React.useState(['all']);
  const [sortConfig, setSortConfig] = React.useState({ key: 'model_name', direction: 'asc' });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(PAGINATION.defaultPageSize);

  // Filter providers
  const effectiveProviders = selectedProviders.includes('all') ? 'all' : selectedProviders[0];

  // Calculate offset for pagination
  const offset = (currentPage - 1) * pageSize;

  // Get models data from Supabase using usePricingData hook
  const {
    models,
    isLoading,
    error,
    isConnected,
    providerStats,
    paginationInfo
  } = usePricingData({
    provider: effectiveProviders,
    sort: sortConfig,
    limit: pageSize,
    offset: offset,
    enableCache: true,
  });

  // Apply search filtering
  const searchFields = SEARCH_CONFIG.searchFields;
  const { filteredData, isSearching, searchQuery, setSearchQuery: setHookSearchQuery } = useSearch(
    models || [],
    searchFields
  );

  // Apply sorting (client-side sorting for search results)
  const { sortedData, handleSort } = useSorting(filteredData, sortConfig);

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Handle sort from table
  const handleTableSort = (column, direction) => {
    const newSortConfig = { key: column, direction };
    setSortConfig(newSortConfig);
  };

  // Handle provider change
  const handleProviderChange = (providers) => {
    setSelectedProviders(providers.length > 0 ? providers : ['all']);
    setCurrentPage(1); // Reset to first page when changing provider
  };

  // Update search query from props passed to Header
  const handleSearchChange = (query) => {
    setHookSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Layout
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedProviders={selectedProviders}
        onProviderChange={handleProviderChange}
      >
        <Box>
          {/* App Header */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 300,
                mb: 2,
                background: 'linear-gradient(45deg, ' + lightTheme.palette.primary.main + ', ' + lightTheme.palette.secondary.main + ')',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              LLM Cost Guide
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              Compare pricing across different LLM providers. Make informed decisions 
              about your AI implementation costs.
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(4, 1fr)'
              },
              gap: 2,
              mb: 4
            }}
          >
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                {paginationInfo?.total || sortedData.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Models
              </Typography>
            </Paper>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" color="secondary" sx={{ fontWeight: 600 }}>
                {new Set(sortedData.map(m => m.provider)).size}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Providers
              </Typography>
            </Paper>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 600 }}>
                {new Set(sortedData.map(m => m.model_type)).size}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Model Types
              </Typography>
            </Paper>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4" color="info.main" sx={{ fontWeight: 600 }}>
                {sortedData.length > 0 ? Math.min(...sortedData.map(m => m.input_price_per_1k_tokens || 0)).toFixed(4) : '0.0000'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lowest $/1K Tokens
              </Typography>
            </Paper>
          </Box>

          {/* Pricing Table */}
          <PricingTable
            models={sortedData}
            isLoading={isLoading}
            onSort={handleTableSort}
            sortConfig={sortConfig}
            error={error}
            emptyMessage={
              searchQuery.trim()
                ? `No models found for "${searchQuery}"`
                : "No models available"
            }
          />

          {/* Pagination */}
          {!isLoading && sortedData.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={paginationInfo?.totalPages || Math.ceil((paginationInfo?.total || sortedData.length) / pageSize)}
              pageSize={pageSize}
              totalCount={paginationInfo?.total || sortedData.length}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              disabled={isSearching}
            />
          )}

          {/* Connection Status */}
          <Paper
            sx={{
              mt: 4,
              p: 3,
              bgcolor: isConnected ? 'success.lighter' : 'error.lighter',
              border: `1px solid ${isConnected ? lightTheme.palette.success.light : lightTheme.palette.error.light}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <SearchIcon sx={{ color: isConnected ? 'success.main' : 'error.main' }} />
              <Typography variant="h6" color={isConnected ? 'success.dark' : 'error.dark'}>
                {isConnected ? 'Connected to Supabase' : 'Database Connection Error'}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {isConnected
                ? `Successfully connected to Supabase and loaded ${models?.length || 0} models from the database.`
                : 'Failed to connect to Supabase. Please check your environment variables and database configuration.'
              }
              {error && (
                <Box component="span" sx={{ display: 'block', mt: 1, color: 'error.main' }}>
                  Error: {error.message || 'Unknown error occurred'}
                </Box>
              )}
            </Typography>
          </Paper>
        </Box>
      </Layout>
    </ThemeProvider>
  );
}

/**
 * Main App component with React Query and Material UI theme
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
