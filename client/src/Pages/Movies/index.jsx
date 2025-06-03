import React, { useEffect, useState, useRef } from 'react';
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
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  Stack,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

function SearchResults({ img, title, id, genre = [] }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movies/${id}`);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={2}
      px={2}
      py={1.5}
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        borderRadius: 1,
        '&:hover': {
          backgroundColor: '#D35400',
        },
      }}
    >
     <Box
  component="img"
  src={`${import.meta.env.VITE_BASE_FILE}${img}`}
  alt={title}
  width={80}
  height={80}
  sx={{
    objectFit: 'cover',
    borderRadius: 2,
    boxShadow: 2,
  }}
/>

<Stack spacing={0.75} flex={1}>
  <Typography
    variant="body1"
    fontWeight={700}
    noWrap
    sx={{
      maxWidth: '100%',
      color: (theme) => theme.palette.text.primary,
      fontSize: '1rem',
    }}
  >
    {title}
  </Typography>

  <Stack direction="row" flexWrap="wrap" gap={0.75}>
    {genre.map((g, index) => (
      <Chip
        key={index}
        label={g}
        size="medium"
        color="secondary"
        sx={{ fontSize: '0.75rem' }}
      />
    ))}
  </Stack>
</Stack>

    </Stack>
  );
}

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchInp, setSearchInp] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  useEffect(() => {
    const fetchAllMovies = async () => {
      const response = await fetchData('movies');
      const all = response?.data?.data || [];
      setMovies(all);
      setFilteredMovies(all);
    };
    fetchAllMovies();
  }, []);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchInp(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      if (value.trim() === '') {
        setSearchResult(null);
        return;
      }

      const response = await fetchData('search', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ query: value }),
      });

      setSearchResult(response.data);
    }, 300);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.searchInp')) {
        setSearchInp('');
        setSearchResult(null);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

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

      <Box sx={{ position: 'relative', width: { xs: '100%', sm: '500px' }, mx: 'auto', mb: 5 }}>
  <Input
    fullWidth
    disableUnderline
    placeholder="جستجوی فیلم یا ژانر..."
    value={searchInp}
    onChange={handleSearch}
    startAdornment={
      <InputAdornment position="start">
        <SearchIcon color="action" />
      </InputAdornment>
    }
    sx={{
      bgcolor: theme.palette.background.paper,
      px: 2,
      py: 2,
      borderRadius: 3,
      boxShadow: theme.shadows[3],
      border: '1px solid',
      borderColor: theme.palette.divider,
      fontSize: '1rem',
      fontWeight: 500,
      color: theme.palette.text.primary,
      '&:focus-within': {
        boxShadow: theme.shadows[5],
      },
    }}
    className="searchInp"
  />

  <Stack
    sx={{
      position: 'absolute',
      top: '100%',
      left: 0,
      width: '100%',
      maxHeight: searchResult ? '500px' : '0px',
      overflowY: 'scroll',
      bgcolor: theme.palette.background.paper,
      borderRadius: '10px 10px 16px 16px',
      boxShadow: theme.shadows[5],
      zIndex: 1000,
      transition: 'all 0.3s ease-in-out',
      visibility: searchResult ? 'visible' : 'hidden',
      opacity: searchResult ? 1 : 0,
      py: 2,
    }}
  >
    {searchResult?.movies?.length > 0 && (
      <>
        <Typography
          variant="subtitle1"
          textAlign="center"
          mt={1}
          color="primary"
          fontWeight={700}
        >
          🎬 فیلم‌ها
        </Typography>
        {searchResult.movies.map((e, index) => (
          <SearchResults
            key={index}
            id={e._id}
            title={e.title}
            img={e.posterImage[0]}
            genre={e.genre}
          />
        ))}
      </>
    )}

    {searchResult?.genres?.length > 0 && (
      <>
        <Divider sx={{ my: 1 }} />
        <Typography
          variant="subtitle1"
          textAlign="center"
          color="secondary"
          fontWeight={700}
        >
          🏷️ ژانرها
        </Typography>
        {searchResult.genres.map((e, index) => (
          <SearchResults
            key={index}
            id={e._id}
            title={e.title}
            img={e.posterImage[0]}
            genre={e.genre}
          />
        ))}
      </>
    )}

    {searchResult &&
      searchResult.movies?.length === 0 &&
      searchResult.genres?.length === 0 && (
        <Typography
          textAlign="center"
          py={2}
          color="text.secondary"
          fontStyle="italic"
        >
          موردی یافت نشد.
        </Typography>
      )}
  </Stack>
</Box>



      <Grid container spacing={4} margin={'5% auto'}>
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <Grid item xs={12} sm={6} md={3} key={movie._id}>
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
                  sx={{
                    objectFit: 'cover',
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 700,
                    }}
                  >
                    {movie.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      my: 1,
                    }}
                  >
                    {movie.description
                      ?.split(' ')
                      .slice(0, 10)
                      .join(' ')}
                    ...
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
          <Typography
            variant="body1"
            sx={{ color: theme.palette.text.secondary, mx: 'auto', mt: 4 }}
          >
            متأسفانه فیلمی یافت نشد.
          </Typography>
        )}
      </Grid>
    </Box>
  );
}
