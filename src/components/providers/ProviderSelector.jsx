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
    onChange(event.target.value);
  };

  // Get display text for selected provider
  const getDisplayText = () => {
    if (value === 'all' || !value) {
      return 'All Providers';
    }
    return providers.find(p => p.value === value)?.label || value;
  };


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
        value={value}
        onChange={handleChange}
        label={label}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        renderValue={(selected) => {
          const provider = providers.find(p => p.value === selected);
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
                {getDisplayText()}
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
        {/* <MenuItem value="all">
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
        </MenuItem> */}

        {/* Provider options */}
        {providers.map((provider) => {
          const badgeStyle = getProviderBadge(provider.value);
          
          return (
            <MenuItem
              key={provider.value}
              value={provider.value}
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
                  <Typography variant="body2">
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