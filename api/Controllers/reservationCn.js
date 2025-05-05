import { catchAsync, HandleERROR } from "vanta-api";
import Reservation from "../Models/reservationMd.js";
import Showtime from "../Models/showtimeMd.js";
import { checkSeatAvailability } from "../Utils/seatHelper.js";

// Get all reservations
export const getAll = catchAsync(async (req, res, next) => {
  const query = (req.role === 'admin' || req.role === 'superAdmin')
    ? {}
    : { user: req.userId };

  const reservations = await Reservation.find(query)
    .populate("showtime movie user");

  res.status(200).json({
    success: true,
    count: reservations.length,
    data: reservations,
  });
});

// Get one reservation
export const getOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const reservation = await Reservation.findById(id)
    .populate("showtime movie user");

  if (!reservation) {
    return next(new HandleERROR("Reservation not found", 404));
  }

  if (reservation.user.toString() !== req.userId &&
      req.role !== "admin" && req.role !== "superAdmin") {
    return next(new HandleERROR("You don't have permission.", 401));
  }

  res.status(200).json({
    success: true,
    data: reservation,
  });
});

export const create = catchAsync(async (req, res, next) => {
  const { showtimeId, seats } = req.body;

  if (!showtimeId || !Array.isArray(seats) || seats.length === 0) {
    return next(new HandleERROR("Showtime ID is Required and at least one seat are required", 400));
  }

  const showtime = await Showtime.findById(showtimeId);
  if (!showtime) {
    return next(new HandleERROR("Showtime not found", 404));
  }

  const { available, taken } = await checkSeatAvailability(showtimeId, seats);
  if (!available) {
    return next(new HandleERROR(`Some seats are already taken: ${taken.join(', ')}`, 400));
  }

  const reservation = await Reservation.create({
    user: req.userId,
    showtime: showtimeId,
    seats,
  });

  res.status(201).json({
    success: true,
    data: reservation,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const reservation = await Reservation.findById(id);
  if (!reservation) {
    return next(new HandleERROR("Reservation not found", 404));
  }

  if (reservation.user.toString() !== req.userId &&
      req.role !== "admin" && req.role !== "superAdmin") {
    return next(new HandleERROR("You don't have permission.", 401));
  }

  await reservation.deleteOne();

  res.status(200).json({
    success: true,
    message: "Reservation cancelled successfully",
  });
});
