import React, { useEffect, useState } from 'react';
import fetchData from '../../Utils/fetchData';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  useTheme,
  InputBase,
  Paper,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const getMovies = async () => {
      const response = await fetchData('movies');
      const allMovies = response?.data?.data || [];
      setMovies(allMovies);
      setFilteredMovies(allMovies);
    };

    getMovies();
  }, []);

  // Filter movies by title or genre when searchTerm changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredMovies(movies);
      return;
    }
    const lowerTerm = searchTerm.toLowerCase();
    const filtered = movies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(lowerTerm) ||
        movie.genre.some((g) => g.toLowerCase().includes(lowerTerm))
    );
    setFilteredMovies(filtered);
  }, [searchTerm, movies]);

  return (
    <Box
      sx={{
        px: { xs: 2, md: 10 },
        py: 6,
        direction: 'rtl',
        bgcolor: theme.palette.background.default,
        minHeight: '100vh',
      }}
    >
      {/* Heading */}
      <Typography
        variant="h3"
        sx={{
          color: theme.palette.primary.main,
          fontWeight: 'bold',
          mb: 4,
          textAlign: 'center',
        }}
      >
        🎬 فهرست کامل فیلم‌ها
      </Typography>

      {/* Search Input */}
      <Paper
        component="form"
        sx={{
          p: '2px 8px',
          display: 'flex',
          alignItems: 'center',
          width: { xs: '100%', sm: 400 },
          mx: 'auto',
          mb: 6,
          borderRadius: 4,
          bgcolor:
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.common.white, 0.12)
              : alpha(theme.palette.primary.main, 0.1),
          '&:hover': {
            bgcolor:
              theme.palette.mode === 'dark'
                ? alpha(theme.palette.common.white, 0.2)
                : alpha(theme.palette.primary.main, 0.15),
          },
        }}
        onSubmit={(e) => e.preventDefault()}
      >
        <InputBase
          sx={{ ml: 1, flex: 1, color: 'inherit' }}
          placeholder="جستجو بر اساس نام یا ژانر"
          inputProps={{ 'aria-label': 'search movies' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          dir="rtl"
        />
        <SearchIcon sx={{ color: theme.palette.primary.main }} />
      </Paper>

      {/* Movies Grid */}
      <Grid container spacing={4}>
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} key={movie._id}>
              <Card
                sx={{
                  bgcolor: theme.palette.background.paper,
                  borderRadius: 3,
                  boxShadow: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 6,
                    cursor: 'pointer',
                  },
                }}
                onClick={() => navigate(`/movies/${movie._id}`)}
                role="button"
                tabIndex={0}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={`${import.meta.env.VITE_BASE_FILE}${movie.posterImage}`}
                  alt={movie.title}
                  sx={{ objectFit: 'cover', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: theme.palette.primary.main, fontWeight: 700 }}
                  >
                    {movie.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, my: 1 }}>
                    {movie.description.split(' ').slice(0,10).join(' ')}...
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {movie.genre.map((g, i) => (
                      <Chip key={i} label={g} color="secondary" size="small" />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mx: 'auto', mt: 4 }}>
            متأسفانه فیلمی یافت نشد.
          </Typography>
        )}
      </Grid>
    </Box>
  );
}
