import { catchAsync, HandleERROR } from "vanta-api";
import Reservation from "../Models/reservationMd.js";


// Total reservations and revenue
export const getSummary = catchAsync(async (req, res, next) => {
  const reservations = await Reservation.find().populate("showtime movie");

  const totalReservations = reservations.length;
  const totalRevenue = reservations.reduce((acc, resv) => {
    // Assume each seat is a fixed price (e.g., 10)
    return acc + (resv.seats.length * 10);
  }, 0);

  res.status(200).json({
    success: true,
    data: {
      totalReservations,
      totalRevenue,
    }
  });
});

// Reservation count per movie
export const getReservationStats = catchAsync(async (req, res, next) => {
  const stats = await Reservation.aggregate([
    {
      $group: {
        _id: "$showtime",
        totalReservations: { $sum: 1 },
        totalSeats: { $sum: { $size: "$seats" } }
      }
    },
    {
      $lookup: {
        from: "showtimes",
        localField: "_id",
        foreignField: "_id",
        as: "showtime"
      }
    },
    { $unwind: "$showtime" },
    {
      $lookup: {
        from: "movies",
        localField: "showtime.movie",
        foreignField: "_id",
        as: "movie"
      }
    },
    { $unwind: "$movie" },
    {
      $group: {
        _id: "$movie._id",
        movieTitle: { $first: "$movie.title" },
        totalReservations: { $sum: "$totalReservations" },
        totalSeats: { $sum: "$totalSeats" }
      }
    },
    { $sort: { totalSeats: -1 } }
  ]);

  res.status(200).json({
    success: true,
    data: stats
  });
});

// Daily reservations (optional)
export const getDailyReport = catchAsync(async (req, res, next) => {
  const stats = await Reservation.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        totalReservations: { $sum: 1 },
        totalSeats: { $sum: { $size: "$seats" } }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.status(200).json({
    success: true,
    data: stats
  });
});
