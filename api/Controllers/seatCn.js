import { catchAsync, HandleERROR } from "vanta-api";
import Seat from "../Models/seatMd.js";
import Showtime from "../Models/showtimeMd.js";
import { checkSeatAvailability } from "../Utils/seatHelper.js";

// Get all seats for a specific showtime
export const getSeatsForShowtime = catchAsync(async (req, res, next) => {
  const { showtimeId } = req.params;

  const showtime = await Showtime.findById(showtimeId);
  if (!showtime) {
    return next(new HandleERROR("Showtime not found", 404));
  }

  const seats = await Seat.find({ showtime: showtimeId });

  res.status(200).json({
    success: true,
    count: seats.length,
    data: seats,
  });
});

// Check availability for a group of seats
export const checkAvailability = catchAsync(async (req, res, next) => {
  const { showtimeId, seatNumbers } = req.body;

  if (!showtimeId || !Array.isArray(seatNumbers)) {
    return next(new HandleERROR("showtimeId and seatNumbers are required", 400));
  }

  const result = await checkSeatAvailability(showtimeId, seatNumbers);

  res.status(200).json({
    success: true,
    data: result,
  });
});

// Optionally create seats (admin only)
export const createSeats = catchAsync(async (req, res, next) => {
  const { showtimeId, seats } = req.body;

  if (!showtimeId || !Array.isArray(seats)) {
    return next(new HandleERROR("showtimeId and seats array are required", 400));
  }

  const showtime = await Showtime.findById(showtimeId);
  if (!showtime) {
    return next(new HandleERROR("Showtime not found", 404));
  }

  const seatDocs = seats.map(seatNum => ({
    showtime: showtimeId,
    seatNumber: seatNum,
  }));

  const created = await Seat.insertMany(seatDocs);

  res.status(201).json({
    success: true,
    count: created.length,
    data: created,
  });
});
