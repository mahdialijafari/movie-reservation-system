import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Grid, Box, Card, CardContent, CardMedia, useTheme, useMediaQuery } from '@mui/material';
import { Movie } from '@mui/icons-material'; // Using MUI icons
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme,darkTheme } from '../../Theme';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Toggle between light and dark themes
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const movies = [
    {
      title: 'The Dark Knight',
      description: 'A dark and gritty superhero tale about Batman facing the Joker.',
      image: 'https://example.com/darkknight.jpg',
    },
    {
      title: 'Inception',
      description: 'A mind-bending thriller about dreams within dreams.',
      image: 'https://example.com/inception.jpg',
    },
    {
      title: 'Interstellar',
      description: 'A visually stunning sci-fi about space exploration and time dilation.',
      image: 'https://example.com/interstellar.jpg',
    },
  ];

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="sticky" sx={{ backgroundColor: theme.palette.primary.main }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Movie Reservation
            </Typography>
            <Button color="inherit" onClick={toggleTheme}>
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </Button>
            <Button color="inherit" onClick={() => navigate('/reservations')}>
              My Reservations
            </Button>
          </Toolbar>
        </AppBar>

        <Container sx={{ py: 4 }}>
          <Typography variant="h2" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
            Welcome to the Movie Reservation System
          </Typography>

          <Grid container spacing={4}>
            {movies.map((movie, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ maxWidth: 345, borderRadius: 2, boxShadow: 3 }}>
                  <CardMedia
                    component="img"
                    alt={movie.title}
                    height="240"
                    image={movie.image}
                    title={movie.title}
                    sx={{ borderRadius: '12px 12px 0 0' }}
                  />
                  <CardContent>
                    <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                      {movie.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {movie.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ fontSize: '1.25rem', padding: '12px 24px', borderRadius: 2 }}
              onClick={() => navigate('/book-movie')}
              startIcon={<Movie />}
            >
              Book Now
            </Button>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Home;
