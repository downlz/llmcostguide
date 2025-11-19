import React from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { getProviderBadge } from '../../utils/formatters.js';

/**
 * Provider selector component with multi-select capability
 */
const ProviderSelector = ({
  value,
  onChange,
  providers = [],
  label = "Providers",
  disabled = false,
  ...props
}) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  // Handle provider selection
  const handleChange = (event) => {
    const newValue = event.target.value;
    onChange(newValue);
  };

  // Get display text for selected providers
  const getDisplayText = () => {
    if (value.length === 0 || (value.length === 1 && value[0] === 'all')) {
      return 'All Providers';
    }
    
    if (value.length === 1) {
      return providers.find(p => p.value === value[0])?.label || value[0];
    }
    
    return value.length + ' Providers';
  };

  // Get selected providers count
  const getSelectedCount = () => {
    if (value.length === 0 || (value.length === 1 && value[0] === 'all')) {
      return 0;
    }
    return value.length;
  };

  const selectedCount = getSelectedCount();

  return (
    <FormControl 
      fullWidth 
      disabled={disabled}
      sx={{ minWidth: 150 }}
      {...props}
    >
      <InputLabel 
        sx={{
          color: theme.palette.text.secondary,
          '&.Mui-focused': {
            color: theme.palette.primary.main,
          },
        }}
      >
        {label}
      </InputLabel>
      <Select
        multiple
        value={value}
        onChange={handleChange}
        label={label}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        renderValue={(selected) => {
          if (selected.length === 0) {
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FilterIcon sx={{ fontSize: '1rem', color: theme.palette.text.secondary }} />
                <Typography variant="body2" color="text.secondary">
                  All Providers
                </Typography>
              </Box>
            );
          }

          if (selected.length === 1) {
            const provider = providers.find(p => p.value === selected[0]);
            const badgeStyle = provider ? getProviderBadge(provider.value) : {};
            
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: badgeStyle.color || theme.palette.primary.main,
                  }}
                />
                <Typography variant="body2">
                  {provider?.label || selected[0]}
                </Typography>
              </Box>
            );
          }

          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">
                {selected.length} Providers
              </Typography>
            </Box>
          );
        }}
        IconComponent={ExpandMoreIcon}
        sx={{
          borderRadius: theme.shape.borderRadius,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.divider,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.light,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
          },
          '& .MuiSelect-select': {
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
          },
        }}
      >
        {/* "All Providers" option */}
        <MenuItem value="all">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: theme.palette.primary.main,
              }}
            />
            <Typography variant="body2">All Providers</Typography>
          </Box>
        </MenuItem>

        {/* Provider options */}
        {providers.map((provider) => {
          const badgeStyle = getProviderBadge(provider.value);
          const isSelected = value.includes(provider.value);
          
          return (
            <MenuItem 
              key={provider.value} 
              value={provider.value}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: badgeStyle.backgroundColor + '80',
                  '&:hover': {
                    backgroundColor: badgeStyle.backgroundColor + 'CC',
                  },
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: badgeStyle.color,
                    flexShrink: 0,
                  }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" fontWeight={isSelected ? 600 : 400}>
                    {provider.label}
                  </Typography>
                </Box>
                {provider.logo && (
                  <Box
                    component="img"
                    src={provider.logo}
                    alt={`${provider.label} logo`}
                    sx={{
                      width: 20,
                      height: 20,
                      objectFit: 'contain',
                      borderRadius: 1,
                    }}
                  />
                )}
              </Box>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default ProviderSelector;