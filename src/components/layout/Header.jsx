import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
  Container,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  AccountBalanceWallet as WalletIcon,
} from '@mui/icons-material';
import SearchBar from '../common/SearchBar.jsx';
import ProviderSelector from '../providers/ProviderSelector.jsx';
import { PROVIDERS } from '../../utils/constants.js';

/**
 * Header component with search, provider selector, and branding
 */
const Header = ({ 
  searchQuery, 
  onSearchChange, 
  selectedProviders, 
  onProviderChange 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={1}
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: '1px solid ' + theme.palette.divider,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ px: { xs: 2, sm: 2, md: 3 }, py: 1 }}>
          {/* Logo and App Name */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flexGrow: isMobile ? 1 : 0,
              mr: 2 
            }}
          >
            <WalletIcon 
              sx={{ 
                mr: 1, 
                color: theme.palette.primary.main,
                fontSize: '1.8rem'
              }} 
            />
            <Typography
              variant="h6"
              component="h1"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, ' + theme.palette.primary.main + ', ' + theme.palette.secondary.main + ')',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: isMobile ? 'none' : 'block'
              }}
            >
              LLM Cost Guide
            </Typography>
          </Box>

          {/* Desktop Layout */}
          {!isMobile && (
            <>
              {/* Provider Selector */}
              <Box sx={{ flexGrow: 0, mr: 3, minWidth: 250 }}>
                <ProviderSelector
                  value={selectedProviders}
                  onChange={onProviderChange}
                  providers={PROVIDERS}
                />
              </Box>

              {/* Search Bar */}
              <Box sx={{ flexGrow: 1, maxWidth: 600 }}>
                <SearchBar
                  value={searchQuery}
                  onChange={onSearchChange}
                  placeholder="Search models, providers..."
                />
              </Box>
            </>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuToggle}
              sx={{ ml: 'auto' }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>

        {/* Mobile Search and Provider Selector */}
        {isMobile && mobileMenuOpen && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              py: 2,
              borderTop: '1px solid ' + theme.palette.divider,
              animation: `${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeInOut}`,
            }}
          >
            <ProviderSelector
              value={selectedProviders}
              onChange={onProviderChange}
              providers={PROVIDERS}
            />
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Search models, providers..."
            />
          </Box>
        )}
      </Container>
    </AppBar>
  );
};

export default Header;