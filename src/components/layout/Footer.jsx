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
        py: 4,
        backgroundColor: theme.palette.grey[50],
        borderTop: '1px solid ' + theme.palette.divider,
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center' }}>
          {/* Main Footer Content */}
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                mb: 2,
                background: 'linear-gradient(45deg, ' + theme.palette.primary.main + ', ' + theme.palette.secondary.main + ')',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              LLMCostGuide
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto', mb: 2 }}
            >
              Making LLM model pricing transparent and accessible for everyone. 
              Compare costs across providers and make informed decisions about your AI implementation.
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Links and Info */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            textAlign: { xs: 'center', md: 'left' }
          }}>
            {/* Left side - Quick links */}
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
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
            <Typography variant="body2" color="text.secondary">
              © {currentYear} LLMCostGuide. All rights reserved.
            </Typography>
          </Box>

          {/* Bottom row - Attribution */}
          <Box sx={{ 
            mt: 3, 
            pt: 2, 
            borderTop: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap'
          }}>
            <Typography variant="caption" color="text.secondary">
              Data powered by:
            </Typography>
            <Link 
              href="https://openrouter.ai" 
              target="_blank" 
              rel="noopener"
              underline="hover"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <PublicIcon sx={{ fontSize: 16 }} />
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
              <PublicIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption">TogetherAI</Typography>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;