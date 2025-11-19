import React from 'react';
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
} from '@mui/material';
import {
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
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
 * Skeleton row component for loading state
 */
const TableRowSkeleton = ({ columns }) => (
  <TableRow>
    {columns.map((column, index) => (
      <TableCell key={column.id} align={column.align || 'left'}>
        <Skeleton 
          variant="text" 
          width={column.width || '80%'} 
          height={24}
          animation="wave"
        />
      </TableCell>
    ))}
  </TableRow>
);

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
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Handle sort click
  const handleSortClick = (columnId) => {
    if (onSort) {
      const currentDirection = sortConfig?.key === columnId ? sortConfig.direction : null;
      const nextDirection = currentDirection === 'asc' ? 'desc' : 'asc';
      onSort(columnId, nextDirection);
    }
  };

  // Get sort direction for column
  const getSortDirection = (columnId) => {
    return sortConfig?.key === columnId ? sortConfig.direction : null;
  };

  // Render mobile card view
  const renderMobileView = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {isLoading && showSkeleton ? (
        // Skeleton cards for loading
        Array.from({ length: 5 }).map((_, index) => (
          <Paper key={index} sx={{ p: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Skeleton variant="text" width="60%" height={32} />
              <Skeleton variant="text" width="40%" height={20} />
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Skeleton variant="rectangular" width={60} height={24} />
              <Skeleton variant="rectangular" width={60} height={24} />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <Skeleton variant="text" height={20} />
              <Skeleton variant="text" height={20} />
              <Skeleton variant="text" height={20} />
              <Skeleton variant="text" height={20} />
            </Box>
          </Paper>
        ))
      ) : models.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            {emptyMessage}
          </Typography>
        </Paper>
      ) : (
        // Model cards
        models.map((model, index) => (
          <Fade in={true} timeout={300 + index * 100} key={model.id}>
            <Paper 
              sx={{ 
                p: 2,
                border: '1px solid ' + theme.palette.divider,
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
                    {formatPricePer1KTokens(model.input_price_per_1M_tokens)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Output Price
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatPricePer1KTokens(model.output_price_per_1M_tokens)}
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
    <TableContainer component={Paper} elevation={1}>
      <Table sx={{ minWidth: 800, tableLayout: 'auto' }}>
        <TableHead>
          <TableRow>
            {TABLE_COLUMNS.map((column) => (
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
                  maxWidth: '200px',
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
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && showSkeleton ? (
            // Skeleton rows
            Array.from({ length: 10 }).map((_, index) => (
              <TableRowSkeleton key={'skeleton-' + index} columns={TABLE_COLUMNS} />
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
              </TableCell>
            </TableRow>
          ) : (
            // Data rows
            models.map((model, index) => (
              <Fade in={true} timeout={300 + index * 50} key={model.id}>
                <TableRow
                  sx={{
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                    '&:last-child td, &:last-child th': {
                      border: 0,
                    },
                  }}
                >
                  {/* Model Name */}
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {model.model_name}
                    </Typography>
                    {model.description && (
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ display: 'block', mt: 0.5 }}
                      >
                        {truncateText(model.description, 60)}
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
                      }}
                    />
                  </TableCell>

                  {/* Context */}
                  <TableCell align="center">
                    <Typography variant="body2">
                      {formatContextWindow(model.context_limit)}
                    </Typography>
                  </TableCell>

                  {/* Input Price */}
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {formatPricePer1KTokens(model.input_price_per_1M_tokens)}
                    </Typography>
                  </TableCell>

                  {/* Output Price */}
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {formatPricePer1KTokens(model.output_price_per_1M_tokens)}
                    </Typography>
                  </TableCell>

                  {/* Caching Price */}
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {formatPricePer1KTokens(model.caching_price_per_1M_tokens)}
                    </Typography>
                  </TableCell>

                  {/* Type */}
                  <TableCell align="center">
                    <Chip
                      icon={<span>{getModelTypeConfig(model.model_type || 'Text').icon}</span>}
                      label={model.model_type || 'Text'}
                      size="small"
                      sx={{
                        backgroundColor: getModelTypeConfig(model.model_type || 'Text').backgroundColor,
                        color: getModelTypeConfig(model.model_type || 'Text').color,
                      }}
                    />
                  </TableCell>

                  {/* Added On */}
                  <TableCell align="center">
                    <Typography variant="body2">
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
    <Box sx={{ width: '100%' }}>
      {isMobile ? renderMobileView() : renderDesktopView()}
    </Box>
  );
};

export default PricingTable;