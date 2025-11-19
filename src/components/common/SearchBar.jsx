import React from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { debounce } from '../../utils/formatters.js';

/**
 * Search bar component with debouncing
 */
const SearchBar = ({
  value,
  onChange,
  placeholder = "Search...",
  debounceMs = 300,
  disabled = false,
  ...props
}) => {
  const theme = useTheme();
  const [internalValue, setInternalValue] = React.useState(value);

  // Debounced onChange function
  const debouncedOnChange = React.useMemo(
    () => debounce((newValue) => {
      onChange(newValue);
    }, debounceMs),
    [onChange, debounceMs]
  );

  // Handle input change
  const handleChange = (event) => {
    const newValue = event.target.value;
    setInternalValue(newValue);
    debouncedOnChange(newValue);
  };

  // Handle clear button
  const handleClear = () => {
    setInternalValue('');
    onChange('');
  };

  // Sync with external value changes
  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const hasValue = internalValue && internalValue.length > 0;

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <TextField
        fullWidth
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        variant="outlined"
        size="medium"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon 
                sx={{ 
                  color: theme.palette.text.secondary,
                  fontSize: '1.2rem'
                }} 
              />
            </InputAdornment>
          ),
          endAdornment: hasValue && !disabled && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClear}
                sx={{ 
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    color: theme.palette.text.primary,
                  }
                }}
                tabIndex={-1}
              >
                <ClearIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            borderRadius: theme.shape.borderRadius * 2,
            backgroundColor: theme.palette.background.paper,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.divider,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.light,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
              borderWidth: 2,
            },
            '& .MuiInputBase-input': {
              py: 1.5,
              fontSize: '0.95rem',
            },
          },
        }}
        {...props}
      />
    </Box>
  );
};

export default SearchBar;