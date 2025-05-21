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
  Button,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { motion } from 'framer-motion';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SpeedIcon from '@mui/icons-material/Speed';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const getMovies = async () => {
      const response = await fetchData('movies');
      setMovies(response?.data?.data || []);
    };

    getMovies();
  }, []);

  const genres = ['اکشن', 'درام', 'عاشقانه', 'کمدی', 'هیجان‌انگیز', 'تاریخی'];
  const perks = [
    { icon: <LocalOfferIcon fontSize="large" />, title: 'قیمت‌های منصفانه' },
    { icon: <SpeedIcon fontSize="large" />, title: 'رزرو سریع' },
    { icon: <SupportAgentIcon fontSize="large" />, title: 'پشتیبانی ۲۴/۷' },
  ];

  return (
    <Box sx={{ px: { xs: 2, md: 10 }, py: 6, direction: 'rtl', bgcolor: theme.palette.background.default }}>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          mb: 6,
          backgroundImage: theme.palette.mode === 'dark' ? 'url(/images/hero-pattern.svg)' : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 3,
          p: { xs: 4, md: 8 },
        }}
      >
        <Typography variant="h2" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 2 }}>
          خوش آمدید به سینماگرام 🎬
        </Typography>
        <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
          بهترین مکان برای مشاهده و رزرو فیلم‌های مورد علاقه‌تان
        </Typography>
      </Box>

      {/* Divider */}
      <Divider sx={{ my: 4 }} />

      {/* Movies Section */}
      {/* Movies Section */}
<Box>
  <Typography variant="h4" sx={{ color: theme.palette.text.primary, mb: 4, fontWeight: 600 }}>
    🎥 جدیدترین فیلم‌ها
  </Typography>

  <Grid container spacing={4}>
    {movies.length > 0 ? (
      movies.slice(0, 3).map((movie) => (
        <Grid item xs={12} sm={6} md={3} key={movie._id} sx={{
          display:'flex',
          justifyContent:'space-between',
        }}>
          <Card
            sx={{
              bgcolor: theme.palette.background.paper,
              borderRadius: 3,
              boxShadow: 3,
              height: '100%',
              width:'100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CardMedia
              component="img"
              height="300"
              image={`${import.meta.env.VITE_BASE_FILE}${movie.posterImage}`}
              alt={movie.title}
              sx={{ objectFit: 'cover', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
            />

            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
                {movie.title}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary, my: 1 }}>
                {movie.description.split(' ').slice(0,4).join(' ')}...
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {movie.genre.map((g, i) => (
                  <Chip key={i} label={g} color="secondary" size="small" />
                ))}
              </Box>
            </CardContent>

            <Box sx={{ textAlign: 'center', pb: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/movies/${movie._id}`)}
                sx={{ mt: 'auto', borderRadius: 8, px: 4 }}
              >
                مشاهده جزئیات
              </Button>
            </Box>
          </Card>
        </Grid>
      ))
    ) : (
      <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
        هیچ فیلمی یافت نشد.
      </Typography>
    )}
  </Grid>

  {/* Link for more movies */}
  {movies.length > 3 && (
    <Box sx={{ mt: 4, textAlign: 'center' }}>
      <Button
        variant="text"
        color="primary"
        onClick={() => navigate('/movies')}
        sx={{
          fontWeight: 'bold',
          textDecoration: 'underline',
          cursor: 'pointer',
          '&:hover': { color: theme.palette.secondary.main },
        }}
      >
        فیلم‌های بیشتر را ببینید →
      </Button>
    </Box>
  )}
</Box>


      {/* Coming‑Soon Carousel with Swiper */}
      {movies.length > 0 && (
        <Box sx={{ my: 8 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, color: theme.palette.text.primary }}>
            🎞️ اکران‌ قریب‌الوقوع
          </Typography>

          <Swiper
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              600: { slidesPerView: 2 },
              900: { slidesPerView: 3 },
            }}
          >
            {movies.slice(0, 5).map((m) => (
              <SwiperSlide key={m._id}>
                <Box sx={{ position: 'relative', px: 1 }}>
                  <CardMedia
                    component="img"
                    height="380"
                    image={`${import.meta.env.VITE_BASE_FILE}${m.posterImage}`}
                    alt={m.title}
                    sx={{ borderRadius: 3, objectFit: 'cover', boxShadow: 4 }}
                  />
                  <Box sx={{ position: 'absolute', bottom: 16, right: 16 }}>
                    <Button variant="contained" color="primary" size="small" onClick={() => navigate(`/movies/${m._id}`)}>
                      پیش‌نمایش
                    </Button>
                  </Box>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      )}

      {/* Popular Genres Cloud */}
      <Box sx={{ my: 8, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, color: theme.palette.text.primary }}>
          🌟 محبوب‌ترین ژانرها
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
          {genres.map((g, i) => (
            <motion.div key={g} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.1 }}>
              <Chip
                label={g}
                color={i % 2 ? 'primary' : 'secondary'}
                clickable
                onClick={() => navigate(`/movies?genre=${g}`)}
                sx={{ fontWeight: 500 }}
              />
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* Why Cinemagram */}
      <Grid
  container
  spacing={4}
  sx={{ my: 8, justifyContent: 'space-between' }} // add justifyContent here
>
  {perks.map((p) => (
    <Grid
      item
      key={p.title}
      // Instead of xs=12 sm=4, control width explicitly for more width
      sx={{
        flexBasis: { xs: '100%', sm: '30%' }, // wider at sm and above
        maxWidth: { xs: '100%', sm: '30%' },
      }}
    >
      <Card
        sx={{
          py: 4,
          textAlign: 'center',
          boxShadow: 2,
          bgcolor: theme.palette.background.paper,
          height: '100%',
        }}
      >
        {p.icon}
        <Typography
          variant="h6"
          sx={{ mt: 2, fontWeight: 600, color: theme.palette.text.primary }}
        >
          {p.title}
        </Typography>
      </Card>
    </Grid>
  ))}
</Grid>


      {/* CTA Banner */}
      <Card
        sx={{
          mt: 10,
          p: { xs: 3, md: 6 },
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          textAlign: 'center',
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
          🎟️ باشگاه مشتریان سینماگرام
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          عضویت رایگان است؛ امتیاز بگیرید و از تخفیف‌های ویژه برخوردار شوید!
        </Typography>
        <Button
          variant="contained"
          sx={{
            bgcolor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText,
            px: 5,
            '&:hover': { bgcolor: theme.palette.secondary.dark },
          }}
          onClick={() => navigate('/signup')}
        >
          عضویت
        </Button>
      </Card>

      {/* About Section */}
      <Box sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: theme.palette.text.primary }}>
          درباره سینماگرام
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', color: theme.palette.text.secondary }}>
          سینماگرام یک پلتفرم مدرن و حرفه‌ای برای علاقه‌مندان به سینماست. با ما می‌توانید فیلم‌های جدید را ببینید، بلیط رزرو کنید و از آخرین اخبار سینمایی مطلع شوید.
        </Typography>
      </Box>
    </Box>
  );
}
