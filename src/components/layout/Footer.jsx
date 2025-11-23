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
        py: { xs: 1, sm: 1.5, md: 2, lg: 2, xl: 2, '2xl': 2 },
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
            xl: '100%',
            '2xl': '100%',
          },
          px: { xs: 2, sm: 3, md: 4, lg: 4, xl: 4, '2xl': 4 },
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          {/* Attribution and Copyright on same line */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: { xs: 'wrap', md: 'nowrap' },
            gap: { xs: 1, sm: 2, md: 3, lg: 3, xl: 3, '2xl': 3 },
          }}>
            {/* Left side - Data attribution */}
            <Box sx={{
              display: 'flex',
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
              <Typography variant="caption" color="text.secondary">•</Typography>
              <Link
                href="https://www.moonshot.ai"
                target="_blank"
                rel="noopener"
                underline="hover"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <PublicIcon sx={{ fontSize: { xs: 14, sm: 16, md: 16, lg: 16, xl: 16, '2xl': 16 } }} />
                <Typography variant="caption">Moonshot AI</Typography>
              </Link>
              <Typography variant="caption" color="text.secondary">•</Typography>
              <Link
                href="https://groq.com"
                target="_blank"
                rel="noopener"
                underline="hover"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <PublicIcon sx={{ fontSize: { xs: 14, sm: 16, md: 16, lg: 16, xl: 16, '2xl': 16 } }} />
                <Typography variant="caption">Groq</Typography>
              </Link>
            </Box>

            {/* Right side - GitHub link and Copyright */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 1.5, md: 2, lg: 2, xl: 2, '2xl': 2 },
              flexWrap: 'wrap'
            }}>
              <Link
                href="https://github.com/downlz/llmcostguide"
                target="_blank"
                rel="noopener"
                underline="hover"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <GitHubIcon sx={{ fontSize: { xs: 14, sm: 16, md: 16, lg: 16, xl: 16, '2xl': 16 } }} />
                <Typography variant="caption">Github</Typography>
              </Link>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.875rem', lg: '0.875rem', xl: '0.875rem', '2xl': '0.875rem' } }}>
                © {currentYear} LLMCostGuide. All rights reserved.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;