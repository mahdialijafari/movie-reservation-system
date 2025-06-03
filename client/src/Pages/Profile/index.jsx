import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import fetchData from "../../Utils/fetchData";
import notify from "../../Utils/notify";
import { login } from "../../Store/Slices/AuthSlice";

const Profile = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const {id}=useSelector(state=>state.auth?.user)
  const [profile, setProfile] = useState({
    fullname: "",
    username: "",
    email: "",
    phoneNumber: "",
    birthDate: "",
  });

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const res = await fetchData(`users/${id}`, {
        headers: {
          authorization: `Brear ${token}`,
        },
      });
      if (res.success) {
        const data = res.data;
        setProfile({
          fullname: data.fullname || "",
          username: data.username || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          birthDate: data.birthDate ? data.birthDate.slice(0, 10) : "",
        });
      } else {
        notify( "دریافت اطلاعات کاربر ناموفق بود",'error');
      }
    };

    if (id) loadUser();
  }, [id, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    const res = await fetchData(`users/${id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        authorization: `Brear ${token}`,
      },
      body: JSON.stringify(profile),
    });

    if (res.success) {
      notify("پروفایل بروزرسانی شد",'success');
      dispatch(login({ token, user: res.data }));
      setEditMode(false);
    } else {
      notify("بروزرسانی با خطا مواجه شد",'error');
    }
  };

  return (
    <Container maxWidth="md">
      <Paper
        elevation={4}
        sx={{
          mt: 8,
          p: { xs: 4, sm: 6 },
          borderRadius: 4,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" mb={5}>
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              width: 100,
              height: 100,
              fontSize: 36,
              mb: 2,
            }}
          >
            {profile.fullname
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase() || "U"}
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            پروفایل کاربر
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            اطلاعات حساب کاربری خود را مشاهده یا ویرایش کنید
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {[
            { name: "fullname", label: "نام کامل" },
            { name: "username", label: "نام کاربری" },
            { name: "email", label: "ایمیل", type: "email" },
            { name: "phoneNumber", label: "شماره تماس" },
            { name: "birthDate", label: "تاریخ تولد", type: "date" },
          ].map(({ name, label, type = "text" }) => (
            <Grid item xs={12} sm={6} key={name}>
              <TextField
                name={name}
                label={label}
                type={type}
                value={profile[name]}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                InputLabelProps={type === "date" ? { shrink: true } : {}}
                disabled={!editMode}
              />
            </Grid>
          ))}
        </Grid>

        <Box display="flex" justifyContent="center" gap={2} mt={5}>
          {!editMode ? (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              color="primary"
              size="large"
              onClick={() => setEditMode(true)}
              sx={{ borderRadius: 3, px: 4 }}
            >
              ویرایش اطلاعات
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              color="success"
              size="large"
              onClick={handleUpdate}
              sx={{ borderRadius: 3, px: 4 }}
            >
              ذخیره تغییرات
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
