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
      <Container
        maxWidth={false}
        sx={{
          width: '100%',
          maxWidth: {
            xs: '100%',
            sm: '100%',
            md: '100%',
            lg: '100%',
            xl: '100%',
          },
        }}
      >
        <Toolbar sx={{
          px: { xs: 2, sm: 2, md: 3, lg: 4, xl: 6, '2xl': 8 },
          py: { xs: 1, sm: 1.5, md: 2, lg: 2, xl: 2.5, '2xl': 3 },
          minHeight: { xs: '64px', sm: '70px', md: '80px', lg: '90px', xl: '100px', '2xl': '110px' },
          '&.MuiToolbar-root': {
            minHeight: '1px',
          },
        }}>
          {/* Logo and App Name */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: isMobile ? 1 : 0,
              mr: { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
              minWidth: 'fit-content',
              flexShrink: 0,
            }}
          >
            <WalletIcon
              sx={{
                mr: { xs: 0.5, sm: 1, md: 1, lg: 1.5, xl: 2 },
                color: theme.palette.primary.main,
                fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem', lg: '2rem', xl: '2.2rem' }
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
                display: isMobile ? 'none' : 'block',
                whiteSpace: 'nowrap',
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.25rem', lg: '1.5rem', xl: '2rem' }
              }}
            >
              LLM Cost Guide
            </Typography>
          </Box>

          {/* Desktop Layout */}
          {!isMobile && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 2, sm: 3, md: 3, lg: 4, xl: 5, '2xl': 6 },
                flexGrow: 1,
                justifyContent: 'flex-end',
                maxWidth: {
                  xs: '100%',
                  sm: '100%',
                  md: '100%',
                  lg: '100%',
                  xl: '100%',
                },
              }}
            >
              {/* Provider Selector */}
              <Box
                sx={{
                  flexGrow: 0,
                  mr: { xs: 2, sm: 3, md: 3, lg: 4, xl: 5 },
                  minWidth: { xs: 200, sm: 250, md: 280, lg: 320, xl: 380, '2xl': 420 },
                  maxWidth: { xs: 300, sm: 350, md: 400, lg: 450, xl: 500, '2xl': 550 },
                }}
              >
                <ProviderSelector
                  value={selectedProviders}
                  onChange={onProviderChange}
                  providers={PROVIDERS}
                />
              </Box>

              {/* Search Bar */}
              <Box
                sx={{
                  flexGrow: 1,
                  maxWidth: {
                    xs: 400,
                    sm: 500,
                    md: 600,
                    lg: 700,
                    xl: 800,
                    '2xl': 900
                  },
                  minWidth: {
                    xs: 300,
                    sm: 400,
                    md: 500,
                    lg: 600,
                    xl: 700,
                    '2xl': 800
                  },
                }}
              >
                <SearchBar
                  value={searchQuery}
                  onChange={onSearchChange}
                  placeholder="Search models, providers..."
                />
              </Box>
            </Box>
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