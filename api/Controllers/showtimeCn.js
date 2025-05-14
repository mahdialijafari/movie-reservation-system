import Movie from "../Models/movieMd.js";
import { catchAsync, HandleERROR } from "vanta-api";
import ApiFeatures from "vanta-api";
import Showtime from "../Models/showtimeMd.js";

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Showtime, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate("movie,theater")
  let showtimes = await features.execute();

  return res.status(200).json({
    success: true,
    count: showtimes.length,
    data: showtimes,
  });
});

export const getOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const showtime = await Showtime.findById(id).populate("movie");
  if (!showtime) {
    return next(new HandleERROR("Showtime not found", 404));
  }

  return res.status(200).json({
    success: true,
    data: showtime,
  });
});

export const create = catchAsync(async (req, res, next) => {
  const { movie, theater, dateTime, seatCount, price } = req.body;

  if (!movie || !theater || !dateTime || !seatCount || !price) {
    return next(new HandleERROR("All fields are required", 400));
  }

  const isReserved = Array(seatCount).fill(false);

  const newShowtime = await Showtime.create({
    movie,
    theater,
    dateTime,
    price,
    seats: seatCount,
    isReserved,
  });
  await Movie.findByIdAndUpdate(newShowtime.movie, {
    $push: { showtimes: newShowtime._id },
  });
  
  return res.status(201).json({
    success: true,
    data: newShowtime,
  });
});

export const update = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedShowtime = await Showtime.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!updatedShowtime) {
    return next(new HandleERROR("Showtime not found", 404));
  }

  return res.status(200).json({
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

  return res.status(200).json({
    success: true,
    message: "Showtime deleted successfully",
  });
});


export const getByMovieGrouped = catchAsync(async (req, res, next) => {
  const { movieId } = req.params;

  const movie = await Movie.findById(movieId);
  if (!movie) {
    return next(new HandleERROR("Movie not found", 404));
  }

  const showtimes = await Showtime.find({ movie: movieId })
    .sort("dateTime")
    .populate("movie");

  const grouped = showtimes.reduce((acc, showtime) => {
    const date = new Date(showtime.dateTime).toISOString().split("T")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(showtime);
    return acc;
  }, {});

  return res.status(200).json({
    success: true,
    data: grouped,
  });
});
