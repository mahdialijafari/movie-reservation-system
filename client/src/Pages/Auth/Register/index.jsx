import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
  Button,
} from "@mui/material";
import { Visibility, VisibilityOff, PersonAdd } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import { login } from "../../../Store/Slices/AuthSlice";
import notify from "../../../Utils/notify";

export default function Register({ handlePageType }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });

  const rightAligned = { inputProps: { style: { textAlign: "right" } } };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetchData("auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);
    setMsg({ type: res.success ? "success" : "error", text: res.message });

    if (res.success) {
      dispatch(login({ user: res.data?.user, token: res.data?.token }));
      localStorage.setItem("token", res.data?.token);
      navigate("/");
      notify('success','register successfully')
    }
  };

  return (
    <Box sx={{ mt: 8, display: "flex", justifyContent: "center", px: 2 }}>
      <Paper
        elevation={4}
        sx={{ p: { xs: 3, md: 5 }, width: "100%", maxWidth: 480 }}
      >
        <Typography variant="h4" align="center" sx={{ mb: 3, fontWeight: 700 }}>
          ثبت‌نام در سینماگرام
        </Typography>

        {msg && (
          <Alert severity={msg.type} sx={{ mb: 2 }}>
            {msg.text}
          </Alert>
        )}

        <Box component="form" onSubmit={submit}>
          <TextField
            fullWidth
            label="نام و نام خانوادگی"
            value={form.fullname}
            onChange={(e) => setForm({ ...form, fullname: e.target.value })}
            margin="normal"
            required
            {...rightAligned}
          />
          <TextField
            fullWidth
            label="نام کاربری"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            margin="normal"
            required
            {...rightAligned}
          />
          <TextField
            fullWidth
            label="ایمیل"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            margin="normal"
            required
            {...rightAligned}
          />
          <TextField
            fullWidth
            label="رمز عبور"
            type={showPwd ? "text" : "password"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            margin="normal"
            required
            {...rightAligned}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
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
            startIcon={<PersonAdd />}
            variant="contained"
            sx={{ mt: 3, borderRadius: 2 }}
          >
            ثبت‌نام
          </LoadingButton>
        </Box>

        <Typography align="center" sx={{ mt: 3 }}>
          قبلاً حساب ساخته‌اید؟{" "}
          <Button variant="text" onClick={handlePageType}>
            ورود
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
}
