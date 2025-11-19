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
        gap: 2,
        mt: 3,
        mb: 2,
        flexWrap: 'wrap',
      }}
    >
      {/* Results Info */}
      <Typography variant="body2" color="text.secondary">
        Showing {startIndex}-{endIndex} of {totalCount} results
      </Typography>

      {/* Page Size Selector */}
      {showPageSizeSelector && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Per page:
          </Typography>
          <FormControl size="small" sx={{ minWidth: 80 }}>
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
          },
        }}
      />
    </Box>
  );
};

export default Pagination;