import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Alert,
  Divider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import fetchData from '../../../Utils/fetchData';
import { login } from '../../../Store/Slices/AuthSlice';

export default function Login({ handlePageType }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [phase, setPhase] = useState('username');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const rightAligned = { inputProps: { style: { textAlign: 'right' } } };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetchData('auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    setMsg({ type: res.success ? 'success' : 'error', text: res.message });
    if (res.success) {
      dispatch(login({ user: res.data?.user, token: res.data?.token }));
      localStorage.setItem('token', res.token); // (optional) persist
      navigate('/');
    }
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetchData('auth/forget', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: phone }),
    });
    setLoading(false);
    setMsg({ type: res.success ? 'success' : 'error', text: res.message });
    if (res.success) setPhase('otp');
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetchData('auth/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: phone, code: otp }),
    });
    setLoading(false);
    setMsg({ type: res.success ? 'success' : 'error', text: res.message });
    if (res.success) {
      dispatch(login({ user: res?.data?.user, token: res?.data?.token }));
      notify(res.message, "success");
      navigate("/");
    } else {
      notify(res.message, "error");
    }
  };

  return (
    <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center', px: 2 }}>
      <Paper elevation={4} sx={{ p: { xs: 3, md: 5 }, width: '100%', maxWidth: 420 }}>
        <Typography variant="h4" align="center" sx={{ mb: 3, fontWeight: 700 }}>
          ورود به سینماگرام
        </Typography>

        {msg && (
          <Alert severity={msg.type} sx={{ mb: 2 }}>
            {msg.text}
          </Alert>
        )}

        {/* Phase: Username & Password */}
        {phase === 'username' && (
          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="نام کاربری"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
              {...rightAligned}
            />
            <TextField
              fullWidth
              label="رمز عبور"
              type={showPwd ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              {...rightAligned}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton onClick={() => setShowPwd(!showPwd)}>
                      {showPwd ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <LoadingButton
              type="submit"
              fullWidth
              loading={loading}
              loadingPosition="start"
              startIcon={<LoginIcon />}
              variant="contained"
              sx={{ mt: 3, borderRadius: 2 }}
            >
              ورود
            </LoadingButton>
            <Button fullWidth sx={{ mt: 2 }} onClick={() => setPhase('phone')}>
              ورود با شماره موبایل
            </Button>
          </Box>
        )}

        {/* Phase: Phone */}
        {phase === 'phone' && (
          <Box component="form" onSubmit={sendOtp}>
            <TextField
              fullWidth
              label="شماره موبایل"
              placeholder="09xxxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              margin="normal"
              required
              {...rightAligned}
            />
            <LoadingButton
              type="submit"
              fullWidth
              loading={loading}
              variant="contained"
              sx={{ mt: 3, borderRadius: 2 }}
            >
              ارسال کد تأیید
            </LoadingButton>
            <Button fullWidth sx={{ mt: 2 }} onClick={() => setPhase('username')}>
              بازگشت به ورود با نام کاربری
            </Button>
          </Box>
        )}

        {/* Phase: OTP */}
        {phase === 'otp' && (
          <Box component="form" onSubmit={verifyOtp}>
            <TextField
              fullWidth
              label="کد تأیید"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              margin="normal"
              required
              {...rightAligned}
            />
            <LoadingButton
              type="submit"
              fullWidth
              loading={loading}
              variant="contained"
              sx={{ mt: 3, borderRadius: 2 }}
            >
              ورود
            </LoadingButton>
            <Button fullWidth sx={{ mt: 2 }} onClick={() => setPhase('phone')}>
              ارسال مجدد کد
            </Button>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography align="center">
          حساب ندارید؟{' '}
          <Button variant="text" onClick={handlePageType}>
            ثبت‌نام
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
}
