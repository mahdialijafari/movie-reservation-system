import React from 'react';
import { Box, Container, Typography, Grid, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: (theme) => theme.palette.secondary.main,
        color: (theme) => theme.palette.secondary.contrastText,
        py: 4,
        mt: 5,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              MovieReserve
            </Typography>
            <Typography variant="body2">
              Book your favorite movies with ease and enjoy your cinematic journey!
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link href="/" color="inherit" underline="hover" display="block">Home</Link>
            <Link href="/movies" color="inherit" underline="hover" display="block">Movies</Link>
            <Link href="/auth" color="inherit" underline="hover" display="block">Login</Link>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2">Email: support@moviereserve.com</Typography>
            <Typography variant="body2">Phone: +123 456 789</Typography>
          </Grid>
        </Grid>

        <Typography variant="body2" align="center" sx={{ mt: 4 }}>
          © {new Date().getFullYear()} MovieReserve. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
