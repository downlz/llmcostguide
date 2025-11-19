import React from 'react';
import { Box, Container } from '@mui/material';
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
      <Footer />
    </Box>
  );
};

export default Layout;