import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
  useTheme,
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  Public as PublicIcon,
} from '@mui/icons-material';

/**
 * Footer component with app information and links
 */
const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: { xs: 3, sm: 3.5, md: 4, lg: 4, xl: 4, '2xl': 4 },
        backgroundColor: theme.palette.grey[50],
        borderTop: '1px solid ' + theme.palette.divider,
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: {
            xs: '100%',
            sm: '100%',
            md: '100%',
            lg: '100%',
            xl: '1200px',
            '2xl': '1260px',
          },
          px: { xs: 2, sm: 3, md: 4, lg: 4, xl: 4, '2xl': 4 },
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          {/* Main Footer Content */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: { xs: 1, sm: 1.5, md: 2, lg: 2, xl: 2, '2xl': 2 },
                background: 'linear-gradient(45deg, ' + theme.palette.primary.main + ', ' + theme.palette.secondary.main + ')',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.25rem', lg: '1.25rem', xl: '1.25rem', '2xl': '1.25rem' }
              }}
            >
              LLMCostGuide
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                maxWidth: { xs: '100%', sm: 500, md: 600, lg: 600, xl: 600, '2xl': 600 },
                mx: 'auto',
                mb: { xs: 1, sm: 1.5, md: 2, lg: 2, xl: 2, '2xl': 2 },
                fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.875rem', lg: '0.875rem', xl: '0.875rem', '2xl': '0.875rem' }
              }}
            >
              Making LLM model pricing transparent and accessible for everyone.
              Compare costs across providers and make informed decisions about your AI implementation.
            </Typography>
          </Box>

          <Divider sx={{ my: { xs: 2, sm: 2.5, md: 3, lg: 3, xl: 3, '2xl': 3 } }} />

          {/* Links and Info */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: { xs: 'wrap', sm: 'wrap', md: 'nowrap' },
            gap: { xs: 1, sm: 2, md: 3, lg: 3, xl: 3, '2xl': 3 },
            textAlign: { xs: 'center', md: 'left' }
          }}>
            {/* Left side - Quick links */}
            <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2, md: 3, lg: 3, xl: 3, '2xl': 3 }, flexWrap: 'wrap' }}>
              <Link 
                href="#features" 
                color="inherit"
                underline="hover"
                sx={{ 
                  '&:hover': { color: theme.palette.primary.main }
                }}
              >
                <Typography variant="body2">Features</Typography>
              </Link>
              <Link 
                href="#pricing" 
                color="inherit"
                underline="hover"
                sx={{ 
                  '&:hover': { color: theme.palette.primary.main }
                }}
              >
                <Typography variant="body2">Pricing</Typography>
              </Link>
              <Link 
                href="#about" 
                color="inherit"
                underline="hover"
                sx={{ 
                  '&:hover': { color: theme.palette.primary.main }
                }}
              >
                <Typography variant="body2">About</Typography>
              </Link>
              <Link 
                href="#contact" 
                color="inherit"
                underline="hover"
                sx={{ 
                  '&:hover': { color: theme.palette.primary.main }
                }}
              >
                <Typography variant="body2">Contact</Typography>
              </Link>
            </Box>

            {/* Right side - Copyright */}
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.875rem', lg: '0.875rem', xl: '0.875rem', '2xl': '0.875rem' } }}>
              © {currentYear} LLMCostGuide. All rights reserved.
            </Typography>
          </Box>

          {/* Bottom row - Attribution */}
          <Box sx={{
            mt: { xs: 2, sm: 2.5, md: 3, lg: 3, xl: 3, '2xl': 3 },
            pt: { xs: 1, sm: 1.5, md: 2, lg: 2, xl: 2, '2xl': 2 },
            borderTop: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: { xs: 1, sm: 1.5, md: 2, lg: 2, xl: 2, '2xl': 2 },
            flexWrap: 'wrap'
          }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.6875rem', sm: '0.75rem', md: '0.75rem', lg: '0.75rem', xl: '0.75rem', '2xl': '0.75rem' } }}>
              Data powered by:
            </Typography>
            <Link 
              href="https://openrouter.ai" 
              target="_blank" 
              rel="noopener"
              underline="hover"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <PublicIcon sx={{ fontSize: { xs: 14, sm: 16, md: 16, lg: 16, xl: 16, '2xl': 16 } }} />
              <Typography variant="caption">OpenRouter</Typography>
            </Link>
            <Typography variant="caption" color="text.secondary">•</Typography>
            <Link 
              href="https://together.ai" 
              target="_blank" 
              rel="noopener"
              underline="hover"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <PublicIcon sx={{ fontSize: { xs: 14, sm: 16, md: 16, lg: 16, xl: 16, '2xl': 16 } }} />
              <Typography variant="caption">TogetherAI</Typography>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;