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
        maxWidth="xl"
        sx={{
          flexGrow: 1,
          py: 3,
          px: { xs: 2, sm: 3, md: 4, lg: 6 },
        }}
      >
        <Box sx={{ width: '100%' }}>
          {children}
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default Layout;