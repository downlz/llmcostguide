import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Box,
  Typography,
  Chip,
  Skeleton,
  useTheme,
  useMediaQuery,
  Fade,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import {
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Search as SearchIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import {
  formatPricePer1KTokens,
  formatContextWindow,
  formatDate,
  getProviderBadge,
  getModelTypeConfig,
  truncateText
} from '../../utils/formatters.js';
import { TABLE_COLUMNS } from '../../utils/constants.js';

/**
 * Modern Loading Overlay Component
 */
const LoadingOverlay = ({ isLoading, isSearching, searchQuery }) => {
  const theme = useTheme();
  
  if (!isLoading && !isSearching) return null;

  return (
    <Backdrop
      open={true}
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(4px)'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          p: 3,
          borderRadius: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          boxShadow: theme.shadows[8],
          maxWidth: 300,
          textAlign: 'center'
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CircularProgress
            size={48}
            thickness={4}
            sx={{
              color: theme.palette.primary.main,
            }}
          />
          {isSearching && (
            <SearchIcon
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: 20,
                color: theme.palette.primary.main,
                animation: 'pulse 1.5s ease-in-out infinite'
              }}
            />
          )}
        </Box>
        <Box>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 600,
              mb: 0.5
            }}
          >
            {isSearching ? 'Searching Models...' : 'Loading Data...'}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: '0.875rem'
            }}
          >
            {isSearching
              ? `Searching for "${searchQuery}"`
              : ''}
          </Typography>
        </Box>
      </Box>
    </Backdrop>
  );
};

/**
 * Enhanced Skeleton row component for loading state
 */
const TableRowSkeleton = ({ columns, isSorting }) => (
  <TableRow>
    {columns.map((column, index) => (
      <TableCell key={column.id} align={column.align || 'left'}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Skeleton
            variant="text"
            width={column.width || '80%'}
            height={24}
            animation={isSorting ? false : "wave"}
          />
          {column.id === 'model_name' && (
            <Skeleton
              variant="text"
              width="60%"
              height={16}
              animation={isSorting ? false : "wave"}
            />
          )}
          {column.id === 'provider' && !column.hide && (
            <Skeleton
              variant="rectangular"
              width={60}
              height={24}
              sx={{ borderRadius: 1 }}
              animation={isSorting ? false : "wave"}
            />
          )}
        </Box>
      </TableCell>
    ))}
  </TableRow>
);

/**
 * Sort indicator component
 */
const SortIndicator = ({ isLoading, sortConfig, columnId }) => {
  if (!isLoading || sortConfig?.key !== columnId) return null;
  
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        ml: 1,
        color: 'primary.main'
      }}
    >
      <CircularProgress size={16} thickness={4} />
    </Box>
  );
};

/**
 * Pricing table component with sorting and responsive design
 */
const PricingTable = ({
  models,
  isLoading,
  onSort,
  sortConfig,
  error,
  emptyMessage = 'No models found',
  showSkeleton = true,
  isSearching = false,
  searchQuery = '',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isSorting, setIsSorting] = React.useState(false);

  // Handle sort click
  const handleSortClick = (columnId) => {
    if (onSort && !isLoading) {
      setIsSorting(true);
      const currentDirection = sortConfig?.key === columnId ? sortConfig.direction : null;
      const nextDirection = currentDirection === 'asc' ? 'desc' : 'asc';
      onSort(columnId, nextDirection);
      
      // Reset sorting state after a short delay
      setTimeout(() => setIsSorting(false), 300);
    }
  };

  // Get sort direction for column
  const getSortDirection = (columnId) => {
    return sortConfig?.key === columnId ? sortConfig.direction : null;
  };

  // Render mobile card view
  const renderMobileView = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {(isLoading || isSearching) && showSkeleton ? (
        // Skeleton cards for loading
        Array.from({ length: isSearching ? 3 : 5 }).map((_, index) => (
          <Paper key={index} sx={{ p: 2, opacity: isSearching ? 0.7 : 1 }}>
            <Box sx={{ mb: 2 }}>
              <Skeleton
                variant="text"
                width="60%"
                height={32}
                animation={isSorting ? false : "wave"}
              />
              <Skeleton
                variant="text"
                width="40%"
                height={20}
                animation={isSorting ? false : "wave"}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Skeleton
                variant="rectangular"
                width={60}
                height={24}
                animation={isSorting ? false : "wave"}
              />
              <Skeleton
                variant="rectangular"
                width={60}
                height={24}
                animation={isSorting ? false : "wave"}
              />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <Skeleton
                variant="text"
                height={20}
                animation={isSorting ? false : "wave"}
              />
              <Skeleton
                variant="text"
                height={20}
                animation={isSorting ? false : "wave"}
              />
              <Skeleton
                variant="text"
                height={20}
                animation={isSorting ? false : "wave"}
              />
              <Skeleton
                variant="text"
                height={20}
                animation={isSorting ? false : "wave"}
              />
            </Box>
          </Paper>
        ))
      ) : models.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            {emptyMessage}
          </Typography>
          {isSearching && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search terms
            </Typography>
          )}
        </Paper>
      ) : (
        // Model cards
        models.map((model, index) => (
          <Fade in={true} timeout={300 + index * 100} key={model.id}>
            <Paper
              sx={{
                p: 2,
                border: '1px solid ' + theme.palette.divider,
                opacity: isSearching ? 0.8 : 1,
                '&:hover': {
                  boxShadow: theme.shadows[4],
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out',
                }
              }}
            >
              {/* Model header */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    mb: 0.5
                  }}
                >
                  {truncateText(model.model_name, 40)}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Chip
                    label={model.provider || 'Unknown'}
                    size="small"
                    sx={{
                      backgroundColor: getProviderBadge(model.provider || 'Unknown').backgroundColor,
                      color: getProviderBadge(model.provider || 'Unknown').textColor,
                      fontWeight: 500,
                    }}
                  />
                  <Chip
                    icon={<span>{getModelTypeConfig(model.model_type || 'Text').icon}</span>}
                    label={model.model_type || 'Text'}
                    size="small"
                    sx={{
                      backgroundColor: getModelTypeConfig(model.model_type || 'Text').backgroundColor,
                      color: getModelTypeConfig(model.model_type || 'Text').color,
                    }}
                  />
                </Box>
              </Box>

              {/* Pricing details */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Context
                  </Typography>
                  <Typography variant="body2">
                    {formatContextWindow(model.context_limit)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Input Price
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatPricePer1KTokens(model.input_price_per_1m_tokens)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Output Price
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatPricePer1KTokens(model.output_price_per_1m_tokens)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Added
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(model.added_on)}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Fade>
        ))
      )}
    </Box>
  );

  // Render desktop table view
  const renderDesktopView = () => (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <TableContainer
        component={Paper}
        elevation={1}
        sx={{
          minWidth: '100%',
          overflow: 'hidden',
        }}
      >
        <Table
          sx={{
            minWidth: '100%',
            tableLayout: 'auto',
            '& .MuiTableCell-root': {
              wordWrap: 'break-word',
              whiteSpace: 'normal',
              padding: {
                xs: 1,
                sm: 1.5,
                md: 2,
                lg: 2,
                xl: 2,
                '2xl': 2.5,
              },
            },
          }}
        >
          <TableHead>
            <TableRow>
              {TABLE_COLUMNS.map((column) => {
                // Dynamic column widths for better responsiveness
                const columnStyles = {
                  width: {
                    xs: column.id === 'model_name' ? '40%' : '15%',
                    sm: column.id === 'model_name' ? '35%' : '15%',
                    md: column.id === 'model_name' ? '30%' : '12%',
                    lg: column.id === 'model_name' ? '25%' : '12%',
                    xl: column.id === 'model_name' ? '20%' : '11%',
                    '2xl': column.id === 'model_name' ? '18%' : '10%',
                  },
                  minWidth: {
                    xs: column.id === 'model_name' ? '200px' : '100px',
                    sm: column.id === 'model_name' ? '200px' : '110px',
                    md: column.id === 'model_name' ? '250px' : '120px',
                    lg: column.id === 'model_name' ? '300px' : '130px',
                    xl: column.id === 'model_name' ? '350px' : '140px',
                    '2xl': column.id === 'model_name' ? '400px' : '150px',
                  },
                  maxWidth: {
                    xs: column.id === 'model_name' ? '300px' : '150px',
                    sm: column.id === 'model_name' ? '350px' : '180px',
                    md: column.id === 'model_name' ? '400px' : '200px',
                    lg: column.id === 'model_name' ? '450px' : '220px',
                    xl: column.id === 'model_name' ? '500px' : '250px',
                    '2xl': column.id === 'model_name' ? '600px' : '300px',
                  },
                };

                return (
                  <TableCell
                    key={column.id}
                    align={column.align || 'left'}
                    sx={{
                      fontWeight: 600,
                      backgroundColor: theme.palette.grey[50],
                      borderBottom: '2px solid ' + theme.palette.divider,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      ...columnStyles,
                    }}
                  >
                    <TableSortLabel
                      active={sortConfig?.key === column.id}
                      direction={getSortDirection(column.id) || 'asc'}
                      onClick={() => handleSortClick(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {(isLoading || isSearching) && showSkeleton ? (
              // Enhanced skeleton rows with sorting state
              Array.from({ length: isSearching ? 5 : 10 }).map((_, index) => (
                <TableRowSkeleton
                  key={'skeleton-' + index}
                  columns={TABLE_COLUMNS}
                  isSorting={isSorting}
                />
              ))
            ) : models.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={TABLE_COLUMNS.length}
                  align="center"
                  sx={{ py: 4 }}
                >
                  <Typography variant="h6" color="text.secondary">
                    {emptyMessage}
                  </Typography>
                  {isSearching && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Try adjusting your search terms
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              // Data rows
              models.map((model, index) => (
                <Fade in={true} timeout={300 + index * 50} key={model.id}>
                  <TableRow
                    sx={{
                      opacity: isSearching ? 0.8 : 1,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                      '&:last-child td, &:last-child th': {
                        border: 0,
                      },
                    }}
                  >
                    {/* Model Name */}
                    <TableCell sx={{
                      minWidth: { xs: '250px', sm: '280px', md: '300px', lg: '320px', xl: '350px', '2xl': '400px' },
                      maxWidth: { xs: '300px', sm: '350px', md: '400px', lg: '450px', xl: '500px', '2xl': '600px' }
                    }}>
                      <Typography variant="body2" sx={{
                        fontWeight: 500,
                        lineHeight: 1.4,
                        fontSize: { xs: '0.875rem', sm: '0.875rem', md: '0.875rem', lg: '0.875rem', xl: '0.875rem', '2xl': '1rem' }
                      }}>
                        {model.model_name}
                      </Typography>
                      {model.description && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: 'block',
                            mt: 0.5,
                            lineHeight: 1.3,
                            fontSize: { xs: '0.75rem', sm: '0.75rem', md: '0.75rem', lg: '0.75rem', xl: '0.75rem', '2xl': '0.875rem' }
                          }}
                        >
                          {truncateText(model.description, 80)}
                        </Typography>
                      )}
                    </TableCell>

                    {/* Provider */}
                    <TableCell align="center">
                      <Chip
                        label={model.provider || 'Unknown'}
                        size="small"
                        sx={{
                          backgroundColor: getProviderBadge(model.provider || 'Unknown').backgroundColor,
                          color: getProviderBadge(model.provider || 'Unknown').textColor,
                          fontWeight: 500,
                          fontSize: { xs: '0.75rem', sm: '0.75rem', md: '0.75rem', lg: '0.75rem', xl: '0.75rem', '2xl': '0.875rem' },
                          height: { xs: '24px', sm: '24px', md: '24px', lg: '24px', xl: '24px', '2xl': '26px' },
                        }}
                      />
                    </TableCell>

                    {/* Context */}
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '0.875rem', md: '0.875rem', lg: '0.875rem', xl: '0.875rem', '2xl': '1rem' } }}>
                        {formatContextWindow(model.context_limit)}
                      </Typography>
                    </TableCell>

                    {/* Input Price */}
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.875rem', sm: '0.875rem', md: '0.875rem', lg: '0.875rem', xl: '0.875rem', '2xl': '1rem' } }}>
                        {formatPricePer1KTokens(model.input_price_per_1m_tokens)}
                      </Typography>
                    </TableCell>

                    {/* Output Price */}
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.875rem', sm: '0.875rem', md: '0.875rem', lg: '0.875rem', xl: '0.875rem', '2xl': '1rem' } }}>
                        {formatPricePer1KTokens(model.output_price_per_1m_tokens)}
                      </Typography>
                    </TableCell>

                    {/* Caching Price */}
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: '0.875rem', sm: '0.875rem', md: '0.875rem', lg: '0.875rem', xl: '0.875rem', '2xl': '1rem' } }}>
                        {formatPricePer1KTokens(model.caching_price_per_1m_tokens)}
                      </Typography>
                    </TableCell>

                    {/* Type */}
                    <TableCell align="center">
                      <Chip
                        icon={<span style={{ fontSize: '0.75rem' }}>{getModelTypeConfig(model.model_type || 'Text').icon}</span>}
                        label={model.model_type || 'Text'}
                        size="small"
                        sx={{
                          backgroundColor: getModelTypeConfig(model.model_type || 'Text').backgroundColor,
                          color: getModelTypeConfig(model.model_type || 'Text').color,
                          fontSize: { xs: '0.75rem', sm: '0.75rem', md: '0.75rem', lg: '0.75rem', xl: '0.75rem', '2xl': '0.875rem' },
                          height: { xs: '24px', sm: '24px', md: '24px', lg: '24px', xl: '24px', '2xl': '26px' },
                        }}
                      />
                    </TableCell>

                    {/* Added On */}
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '0.875rem', md: '0.875rem', lg: '0.875rem', xl: '0.875rem', '2xl': '1rem' } }}>
                        {formatDate(model.added_on)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </Fade>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // Error state
  if (error && !isLoading) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'error.lighter' }}>
        <Typography variant="h6" color="error" sx={{ mb: 1 }}>
          Error Loading Data
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error.message || 'Failed to load pricing data. Please try again.'}
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      {/* Modern Loading Overlay */}
      <LoadingOverlay
        isLoading={isLoading}
        isSearching={isSearching}
        searchQuery={searchQuery}
      />
      
      {isMobile ? renderMobileView() : renderDesktopView()}
    </Box>
  );
};

export default PricingTable;