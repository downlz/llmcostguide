import React from 'react';
import {
  Box,
  Pagination as MuiPagination,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { PAGINATION } from '../../utils/constants.js';

/**
 * Pagination component with page size selector
 */
const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  pageSize = PAGINATION.defaultPageSize,
  totalCount = 0,
  onPageChange,
  onPageSizeChange,
  disabled = false,
  showPageSizeSelector = true,
}) => {
  const handlePageChange = (event, newPage) => {
    if (onPageChange && !disabled) {
      onPageChange(newPage);
    }
  };

  const handlePageSizeChange = (event) => {
    const newPageSize = parseInt(event.target.value, 10);
    if (onPageSizeChange && !disabled) {
      onPageSizeChange(newPageSize);
    }
  };

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: { xs: 1, sm: 1.5, md: 2, lg: 2, xl: 3, '2xl': 4 },
        mt: { xs: 2, sm: 3, md: 3, lg: 4, xl: 4, '2xl': 5 },
        mb: 2,
        flexWrap: { xs: 'wrap', sm: 'wrap', md: 'nowrap' },
        maxWidth: '100%',
      }}
    >
      {/* Results Info */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          flexShrink: 0,
          textAlign: { xs: 'center', sm: 'left' },
          width: { xs: '100%', sm: 'auto', md: 'auto', lg: 'auto', xl: 'auto' },
          fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.875rem', lg: '0.875rem', xl: '1rem', '2xl': '1.125rem' }
        }}
      >
        Showing {startIndex}-{endIndex} of {totalCount} results
      </Typography>

      {/* Page Size Selector */}
      {showPageSizeSelector && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.5, sm: 1, md: 1, lg: 1, xl: 1 },
            flexShrink: 0,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mr: { xs: 0.5, sm: 1, md: 1, lg: 1, xl: 1 },
              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.875rem', lg: '0.875rem', xl: '1rem', '2xl': '1.125rem' }
            }}
          >
            Per page:
          </Typography>
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: 70, sm: 80, md: 80, lg: 90, xl: 100, '2xl': 110 },
              '& .MuiSelect-select': {
                padding: { xs: '6px 8px', sm: '8px 12px', md: '8px 12px', lg: '10px 14px', xl: '12px 16px', '2xl': '14px 18px' },
              }
            }}
          >
            <Select
              value={pageSize}
              onChange={handlePageSizeChange}
              disabled={disabled}
              size="small"
            >
              {PAGINATION.pageSizeOptions.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      {/* Pagination Controls */}
      <Box sx={{ flexShrink: 0 }}>
        <MuiPagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          disabled={disabled}
          size="medium"
          showFirstButton
          showLastButton
          sx={{
            '& .MuiPaginationItem-root': {
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
              },
              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.875rem', lg: '0.875rem', xl: '1rem', '2xl': '1.125rem' },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Pagination;