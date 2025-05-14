import React from 'react';
import { Box, Typography, Grid, Link as MuiLink, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
        py: 4,
        px: { xs: 3, sm: 8 },
        mt: 8,
        direction: 'rtl',
      }}
    >
      <Grid container spacing={4}>
        {/* Website Info */}
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            سینماگرام 🎬
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.secondary.contrastText }}>
            تجربه‌ای متفاوت از دنیای سینما. رزرو بلیط، مشاهده فیلم‌ها، و بررسی آخرین اخبار سینمایی.
          </Typography>
        </Grid>

        {/* Quick Links */}
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            لینک‌های مفید
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <MuiLink
              onClick={() => navigate('/movies')}
              sx={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}
            >
              🎬 فیلم‌ها
            </MuiLink>
            <MuiLink
              onClick={() => navigate('/my-tickets')}
              sx={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}
            >
              🎟️ بلیط‌های من
            </MuiLink>
            <MuiLink
              onClick={() => navigate(token ? '/profile' : '/auth')}
              sx={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}
            >
              {token ? '👤 پروفایل' : '🔐 ورود | ثبت‌نام'}
            </MuiLink>
          </Box>
        </Grid>

        {/* Empty column for layout balance */}
        <Grid item xs={12} md={4} />
      </Grid>

      {/* Bottom Bar */}
      <Box sx={{ textAlign: 'center', mt: 4, borderTop: `1px solid ${theme.palette.divider}`, pt: 2 }}>
        <Typography variant="body2" sx={{ color: theme.palette.secondary.contrastText }}>
          © {new Date().getFullYear()} سینماگرام. همه حقوق محفوظ است.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
