import {
  Box,
  Typography,
  Button,
  useTheme,
  Divider,
  Chip,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import fetchData from "../../Utils/fetchData";
import notify from "../../Utils/notify";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MovieIcon from "@mui/icons-material/Movie";
import CategoryIcon from "@mui/icons-material/Category";
import dayjs from "dayjs";
import "dayjs/locale/fa";

dayjs.locale("fa");

const ReserveSeats = () => {
  const { showtimeId } = useParams();
  const theme = useTheme();

  const [layout, setLayout] = useState([]);
  const [disabledSeats, setDisabledSeats] = useState(new Set());
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [movie, setMovie] = useState(null);
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    const loadSeats = async () => {
      const res = await fetchData(`showtime/${showtimeId}`);
      if (!res.success)
        return notify(res.message || "خطا در دریافت اطلاعات سانس", "error");

      const layout = res.data.theater.layout || [];
      const reserved = res.data.isReserved || [];
      const movie = res.data.movie;
      const dateTime = res.data.dateTime;

      const disabled = new Set();
      let index = 0;

      layout.forEach((row) =>
        row.forEach((seat) => {
          if (seat.disabled || reserved[index]) {
            disabled.add(seat.id);
          }
          index++;
        })
      );

      setLayout(layout);
      setDisabledSeats(disabled);
      setMovie(movie);
      setDateTime(dateTime);
    };

    loadSeats();
  }, [showtimeId]);

  const toggleSelect = (id) => {
    setSelectedSeats((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleReserve = () => {
    if (selectedSeats.length === 0)
      return notify("لطفاً حداقل یک صندلی انتخاب کنید", "warning");

    // Add reserve logic here...
    notify("رزرو با موفقیت انجام شد", "success");
  };

  return (
    <Box
      dir="rtl"
      sx={{
        maxWidth: 700,
        mx: "auto",
        mt: 5,
        p: 3,
        borderRadius: 4,
        backgroundColor: theme.palette.background.paper,
        boxShadow: 6,
      }}
    >
      {movie && (
        <Box mb={4}>
          <Typography variant="h5" fontWeight={600} mb={2}>
            اطلاعات فیلم
          </Typography>
          <Stack spacing={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <MovieIcon color="primary" />
              <Typography variant="body1">{movie.title}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <CategoryIcon color="secondary" />
              <Typography variant="body1">{movie.genre.join(", ")}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <AccessTimeIcon color="action" />
              <Typography variant="body1">
                {dayjs(dateTime).format("dddd، D MMMM YYYY - HH:mm")}
              </Typography>
            </Box>
          </Stack>
        </Box>
      )}

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" mb={2} textAlign="center">
        نقشه صندلی‌ها
      </Typography>

      {/* Seat Layout */}
      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
        {layout.map((row, i) => (
          <Box key={i} display="flex" gap={1}>
            {row.map((seat) => {
              const isDisabled = disabledSeats.has(seat.id);
              const isSelected = selectedSeats.includes(seat.id);

              return (
                <EventSeatIcon
                  key={seat.id}
                  onClick={() => !isDisabled && toggleSelect(seat.id)}
                  sx={{
                    fontSize: 40,
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    color: isDisabled
                      ? "grey.400"
                      : isSelected
                      ? "primary.main"
                      : "success.light",
                    transition: "all 0.3s ease",
                    filter: isSelected
                      ? "drop-shadow(0px 2px 3px rgba(0,0,0,0.3))"
                      : "none",
                    "&:hover": {
                      color:
                        !isDisabled && !isSelected ? "success.main" : undefined,
                    },
                  }}
                />
              );
            })}
          </Box>
        ))}
      </Box>

      {/* Seat Status Guide */}
      <Box mt={4} textAlign="center">
        <Stack
          direction="row"
          justifyContent="center"
          spacing={2}
          useFlexGap
          flexWrap="wrap"
        >
          <Chip
            label="قابل انتخاب"
            sx={{ backgroundColor: "success.light", color: "white" }}
          />
          <Chip
            label="رزرو شده / غیر فعال"
            sx={{ backgroundColor: "grey.300", color: "grey.800" }}
          />
          <Chip
            label="انتخاب شده"
            sx={{ backgroundColor: "primary.main", color: "white" }}
          />
        </Stack>
      </Box>

      {/* Confirm Button */}
      <Box textAlign="center" mt={5}>
        <Button
          onClick={handleReserve}
          variant="contained"
          color="secondary"
          sx={{
            px: 6,
            py: 1.5,
            fontSize: "1.1rem",
            borderRadius: 3,
            fontWeight: 600,
            ":hover": {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            },
          }}
        >
          تأیید رزرو
        </Button>
      </Box>
    </Box>
  );
};

export default ReserveSeats;
