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
import { useProviders } from './hooks/useProviders.js';
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
  const [selectedProvider, setSelectedProvider] = React.useState('all');
  const [sortConfig, setSortConfig] = React.useState({ key: 'model_name', direction: 'asc' });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(PAGINATION.defaultPageSize);
  const [searchTerm, setSearchTerm] = React.useState('');

  // Filter providers
  const { data: availableProviders = [] } = useProviders();

  const providers = React.useMemo(() => [
    {
      label: 'All Providers',
      value: 'all',
      color: '#2196f3',
    },
    ...availableProviders.map(p => ({
      label: p,
      value: p,
      color: '#666',
    })),
  ], [availableProviders]);

  // Calculate offset for pagination
  const offset = (currentPage - 1) * pageSize;


  // Fetch models data with dynamic limit/offset and optional search term
  const {
    models,
    isLoading,
    error,
    isConnected,
    providerStats,
    paginationInfo
  } = usePricingData({
    provider: selectedProvider,
    sort: sortConfig,
    limit: searchTerm ? 1000 : pageSize,
    offset: searchTerm ? 0 : offset,
    enableCache: true,
    search: searchTerm,
  });

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
  const handleProviderChange = (provider) => {
    setSelectedProvider(provider || 'all');
    setCurrentPage(1); // Reset to first page when changing provider
  };

  // Update search query from props passed to Header
  const handleSearchChange = (query) => {
    setSearchTerm(query);
    setHookSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };


  // Render
  /* Filter the sorted data according to the provider selection.
     When "all" is selected we keep the full list; otherwise we keep only rows whose
     provider matches one of the selected values. */
  const displayedData = sortedData;

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Layout
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedProvider={selectedProvider}
        providers={providers}
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
              variant="h5"
              color="text.primary"
              sx={{
                maxWidth: '100%',
                mx: 'auto',
                fontWeight: { xs: 400, sm: 400, md: 400, lg: 400 },
                fontSize: {
                  xs: '1rem',
                  sm: '1.125rem',
                  md: '1.25rem',
                  lg: '1.375rem',
                  xl: '1.5rem'
                },
                lineHeight: { xs: 1.5, sm: 1.6, md: 1.6, lg: 1.7 },
                textAlign: 'center',
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                letterSpacing: { xs: '0.01em', sm: '0.005em', md: '0.005em', lg: '0.0025em' }
              }}
            >
              Instantly find, filter, and compare open-source & commercial LLM prices, performance specs, and real-world usability—zero signup, one search bar to pick the perfect model and slash AI costs.
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
                lg: 'repeat(4, 1fr)',
                xl: 'repeat(4, 1fr)',
                '2xl': 'repeat(5, 1fr)'
              },
              gap: { xs: 1.5, sm: 2, md: 2.5, lg: 3, xl: 3, '2xl': 4 },
              mb: 4,
              maxWidth: '100%',
            }}
          >
            <Paper
              sx={{
                p: { xs: 2, sm: 2.5, md: 3, lg: 3.5, xl: 4, '2xl': 4.5 },
                textAlign: 'center',
                height: 'fit-content',
                minHeight: { xs: '100px', sm: '110px', md: '120px', lg: '130px', xl: '140px', '2xl': '150px' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="h4"
                color="primary"
                sx={{
                  fontWeight: 600,
                  mb: 0.5,
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2rem', lg: '2.5rem', xl: '2.5rem', '2xl': '3rem' }
                }}
              >
                {paginationInfo?.total || displayedData.length}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.875rem', lg: '0.875rem', xl: '1rem', '2xl': '1.125rem' } }}
              >
                Total Models
              </Typography>
            </Paper>
            <Paper
              sx={{
                p: { xs: 2, sm: 2.5, md: 3, lg: 3.5, xl: 4, '2xl': 4.5 },
                textAlign: 'center',
                height: 'fit-content',
                minHeight: { xs: '100px', sm: '110px', md: '120px', lg: '130px', xl: '140px', '2xl': '150px' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="h4"
                color="secondary"
                sx={{
                  fontWeight: 600,
                  mb: 0.5,
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2rem', lg: '2.5rem', xl: '2.5rem', '2xl': '3rem' }
                }}
              >
                {selectedProvider === 'all' ? availableProviders.length : new Set(displayedData.map(m => m.provider)).size}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.875rem', lg: '0.875rem', xl: '1rem', '2xl': '1.125rem' } }}
              >
                Providers
              </Typography>
            </Paper>
            <Paper
              sx={{
                p: { xs: 2, sm: 2.5, md: 3, lg: 3.5, xl: 4, '2xl': 4.5 },
                textAlign: 'center',
                height: 'fit-content',
                minHeight: { xs: '100px', sm: '110px', md: '120px', lg: '130px', xl: '140px', '2xl': '150px' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="h4"
                color="success.main"
                sx={{
                  fontWeight: 600,
                  mb: 0.5,
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2rem', lg: '2.5rem', xl: '2.5rem', '2xl': '3rem' }
                }}
              >
                {new Set(displayedData.map(m => m.model_type)).size}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.875rem', lg: '0.875rem', xl: '1rem', '2xl': '1.125rem' } }}
              >
                Model Types
              </Typography>
            </Paper>
            <Paper
              sx={{
                p: { xs: 2, sm: 2.5, md: 3, lg: 3.5, xl: 4, '2xl': 4.5 },
                textAlign: 'center',
                height: 'fit-content',
                minHeight: { xs: '100px', sm: '110px', md: '120px', lg: '130px', xl: '140px', '2xl': '150px' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="h4"
                color="info.main"
                sx={{
                  fontWeight: 600,
                  mb: 0.5,
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2rem', lg: '2.5rem', xl: '2.5rem', '2xl': '3rem' }
                }}
              >
                {displayedData.length > 0 ? Math.min(...displayedData.map(m => m.input_price_per_1m_tokens || 0)).toFixed(4) : '0.0000'}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.875rem', lg: '0.875rem', xl: '1rem', '2xl': '1.125rem' } }}
              >
                Lowest $/1K Tokens
              </Typography>
            </Paper>
          </Box>

          {/* Pricing Table */}
          <PricingTable
            models={displayedData}
            isLoading={isLoading}
            onSort={handleTableSort}
            sortConfig={sortConfig}
            error={error}
            isSearching={isSearching}
            searchQuery={searchQuery}
            emptyMessage={
              searchQuery.trim()
                ? `No models found for "${searchQuery}"`
                : selectedProvider !== 'all'
                  ? `No models found for provider "${selectedProvider}"`
                  : "No models available"
            }
          />

          {/* Pagination */}
          {/* Show pagination only when there is data to display */}
          {!isLoading && displayedData.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={searchQuery.trim()
                ? Math.ceil(filteredData.length / pageSize)
                : paginationInfo?.totalPages || Math.ceil((paginationInfo?.total || displayedData.length) / pageSize)}
              pageSize={pageSize}
              totalCount={searchQuery.trim() ? filteredData.length : (paginationInfo?.total || displayedData.length)}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              disabled={false}
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
                {isConnected ? 'Model Price up-to-date' : 'Connectivity issues found'}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {isConnected
                ? `Successfully fetched latest model pricing from providers`
                : 'Failed to load updated model price. Retry again later.'
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
