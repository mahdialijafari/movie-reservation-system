import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  InputBase,
  Box,
  useTheme,
  alpha,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Brightness4,
  Brightness7,
  Search as SearchIcon,
  AccountCircle,
  Movie,
  ConfirmationNumber,
  Login,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { changeTheme } from '../../Store/Slices/ThemeSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { mode } = useSelector((state) => state.theme);
  const { token } = useSelector((state) => state.auth);

  const handleThemeToggle = () => {
    dispatch(changeTheme());
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: theme.palette.primary.main,
        px: { xs: 2, sm: 4 },
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          direction: 'rtl',
          gap: 2,
        }}
      >
        {/* Right Side: Logo + Search */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Typography
            variant="h6"
            onClick={() => navigate('/')}
            sx={{
              cursor: 'pointer',
              fontWeight: 'bold',
              color: theme.palette.primary.contrastText,
            }}
          >
            🎬 سینماگرام
          </Typography>

          {/* Search */}
          <Box
            sx={{
              position: 'relative',
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.common.white, 0.15),
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.25),
              },
              width: { xs: '150px', sm: '250px' },
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                right: 8,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SearchIcon sx={{ color: '#fff' }} />
            </Box>
            <InputBase
              placeholder="جستجوی فیلم..."
              inputProps={{ 'aria-label': 'search' }}
              sx={{
                color: '#fff',
                pr: 4,
                pl: 1,
                py: 0.7,
                width: '100%',
              }}
            />
          </Box>
        </Box>

        {/* Left Side: Links + Theme Toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            onClick={() => navigate('/movies')}
            sx={{ color: '#fff', gap: 1 }}
            startIcon={<Movie sx={{ ml: 1 }} />}
          >
            فیلم‌ها
          </Button>

          <Button
            onClick={() => navigate('/my-tickets')}
            sx={{ color: '#fff', gap: 1 }}
            startIcon={<ConfirmationNumber sx={{ ml: 1 }} />}
          >
            بلیط‌های من
          </Button>

          {token ? (
            <Button
              onClick={() => navigate('/profile')}
              sx={{ color: '#fff', gap: 1 }}
              startIcon={<AccountCircle sx={{ ml: 1 }} />}
            >
              پروفایل
            </Button>
          ) : (
            <Button
              onClick={() => navigate('/auth')}
              sx={{ color: '#fff', gap: 1 }}
              startIcon={<Login sx={{ ml: 1 }} />}
            >
              ورود | ثبت‌نام
            </Button>
          )}

          <IconButton onClick={handleThemeToggle} sx={{ color: '#fff' }}>
            {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
