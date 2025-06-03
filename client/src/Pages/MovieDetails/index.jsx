import {
    Box,
    Typography,
    Chip,
    Button,
    Collapse,
    Card,
    CardContent,
    CardMedia,
    useTheme,
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import { useParams, useNavigate } from "react-router-dom";
  import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
  import ExpandLessIcon from "@mui/icons-material/ExpandLess";
  import notify from "../../Utils/notify";
  
  const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [showShowtimes, setShowShowtimes] = useState(false);
    const theme = useTheme();
  
    useEffect(() => {
      const fetchMovie = async () => {
        try {
          const res = await fetch(`http://localhost:5002/api/movies/${id}`);
          const json = await res.json();
          if (!json.success) return notify("فیلم پیدا نشد", "error");
          setMovie(json.data);
        } catch (err) {
          notify("خطا در دریافت اطلاعات فیلم", "error");
        }
      };
  
      fetchMovie();
    }, [id]);
  
    if (!movie) return null;
  
    return (
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
          py: 4,
          px: 2,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 600,
            borderRadius: 4,
            backgroundColor: theme.palette.background.paper,
            boxShadow: 4,
          }}
        >
          <CardMedia
            component="img"
            height="400"
            image={`${import.meta.env.VITE_BASE_FILE}${movie.posterImage}`}
            alt={movie.title}
            sx={{ borderRadius: "16px 16px 0 0", objectFit: "cover" }}
          />
          <CardContent>
            <Typography variant="h4" gutterBottom sx={{ color: theme.palette.text.primary }}>
              {movie.title}
            </Typography>
  
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
              {movie.description}
            </Typography>
  
            <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
              {movie.genre.map((genre) => (
                <Chip
                  key={genre}
                  label={genre}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  }}
                />
              ))}
            </Box>
  
            <Typography
              variant="body2"
              sx={{ mt: 2, fontWeight: 500, color: theme.palette.text.primary }}
            >
              مدت زمان: {movie.duration} دقیقه
            </Typography>
  
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Button
                onClick={() => setShowShowtimes((prev) => !prev)}
                variant="contained"
                endIcon={showShowtimes ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                sx={{
                  backgroundColor: theme.palette.secondary.main,
                  color: theme.palette.secondary.contrastText,
                  ":hover": {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  },
                  px: 4,
                  py: 1.2,
                }}
              >
                {showShowtimes ? "بستن سانس‌ها" : "نمایش سانس‌ها"}
              </Button>
            </Box>
  
            <Collapse in={showShowtimes} timeout="auto" unmountOnExit>
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  backgroundColor: theme.palette.background.default,
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                {movie.showtimes?.length > 0 ? (
                  movie.showtimes.map((st) => (
                    <Box
                      key={st._id}
                      sx={{
                        mb: 3,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: 2,
                      }}
                    >
                      <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                        📅 <strong>تاریخ:</strong>{" "}
                        {new Date(st.dateTime).toLocaleDateString("fa-IR")}
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                        🕒 <strong>ساعت:</strong>{" "}
                        {new Date(st.dateTime).toLocaleTimeString("fa-IR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                        🎟 <strong>قیمت:</strong> {st.price.toLocaleString("fa-IR")} تومان
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                        💺 <strong>تعداد صندلی:</strong> {st.seats}
                      </Typography>
  
                      <Box sx={{ mt: 2, textAlign: "center" }}>
                        <Button
                          variant="outlined"
                          sx={{
                            px: 4,
                            py: 1,
                            fontWeight: 500,
                            borderColor: theme.palette.primary.main,
                            color: theme.palette.primary.main,
                            ":hover": {
                              backgroundColor: theme.palette.primary.main,
                              color: "#fff",
                            },
                          }}
                          onClick={() => navigate(`/reserve/${st._id}`)}
                        >
                          رزرو صندلی
                        </Button>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography sx={{ color: theme.palette.text.secondary }}>
                    سانسی برای این فیلم ثبت نشده است.
                  </Typography>
                )}
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      </Box>
    );
  };
  
  export default MovieDetails;
  