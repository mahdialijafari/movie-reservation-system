import { catchAsync, HandleERROR } from "vanta-api";
import ApiFeatures from "vanta-api";
import Showtime from "../Models/showtimeMd.js";
import Movie from "../Models/movieMd.js";

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Showtime, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate("movie room");

  const showtimes = await features.execute();

  res.status(200).json({
    success: true,
    count: showtimes.length,
    data: showtimes,
  });
});

export const getOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const showtime = await Showtime.findById(id).populate("movie room");
  if (!showtime) {
    return next(new HandleERROR("Showtime not found", 404));
  }

  res.status(200).json({
    success: true,
    data: showtime,
  });
});

export const create = catchAsync(async (req, res, next) => {
  const { movie, room, dateTime } = req.body;

  if (!movie || !room || !dateTime) {
    return next(new HandleERROR("Movie, room, and dateTime are required", 400));
  }

  const newShowtime = await Showtime.create(req.body);

  res.status(201).json({
    success: true,
    data: newShowtime,
  });
});

export const update = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedShowtime = await Showtime.findByIdAndUpdate(id, req.body, { new: true });
  if (!updatedShowtime) {
    return next(new HandleERROR("Showtime not found", 404));
  }

  res.status(200).json({
    success: true,
    data: updatedShowtime,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const showtime = await Showtime.findByIdAndDelete(id);
  if (!showtime) {
    return next(new HandleERROR("Showtime not found", 404));
  }

  res.status(204).json({
    success: true,
    message: "Showtime deleted",
  });
});

export const getByMovieGrouped = catchAsync(async (req, res, next) => {
  const { movieId } = req.params;

  const movie = await Movie.findById(movieId);
  if (!movie) {
    return next(new HandleERROR("Movie not found", 404));
  }

  const showtimes = await Showtime.find({ movie: movieId }).sort("dateTime");

  const grouped = showtimes.reduce((acc, showtime) => {
    const date = new Date(showtime.dateTime).toISOString().split("T")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(showtime);
    return acc;
  }, {});

  res.status(200).json({
    success: true,
    data: grouped,
  });
});
