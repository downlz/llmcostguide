import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

/**
 * Main layout component that wraps all pages
 */
const Layout = ({ children, ...headerProps }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Header {...headerProps} />
      <Container
        maxWidth={false}
        sx={{
          flexGrow: 1,
          py: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8, '2xl': 10 },
          px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8, '2xl': 12 },
          maxWidth: {
            xs: '100%',
            sm: '100%',
            md: '100%',
            lg: '100%',
            xl: '100%',
            '2xl': '1400px',
          },
        }}
      >
        <Box sx={{
          width: '100%',
          maxWidth: {
            xs: '100%',
            md: '100%',
            lg: '100%',
            xl: '100%',
            '2xl': '1400px',
          },
          mx: 'auto',
        }}>
          {children}
        </Box>
      </Container>
      
      {/* Information Section */}
      <Container
        maxWidth={false}
        sx={{
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8, '2xl': 12 },
        }}
      >
        <Paper
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            border: '1px solid #dee2e6',
            borderRadius: 2,
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.7,
                color: 'text.secondary',
                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                maxWidth: '100%',
                mx: 'auto'
              }}
            >
              Discover real-time pricing from OpenAI, Anthropic, Google, Mistral, Grok, Llama, Gemini, Claude and 50+ other providers. Save up to 90% on tokens by choosing the most cost-effective model for your use case. Get unbiased speed, price, and performance rankings tailored to your industry (coding, legal, marketing, research, customer support).
            </Typography>
          </Box>
        </Paper>
      </Container>
      
      <Footer />
    </Box>
  );
};

export default Layout;