import { catchAsync, HandleERROR } from "vanta-api";
import ApiFeatures from "vanta-api";
import Movie from "../Models/movieMd.js";
import fs from "fs";
import { __dirname } from "../app.js";

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Movie, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();

  const movies = await features.execute();

  return res.status(200).json({
    success: true,
    count: movies.length,
    data: movies,
  });
});

export const getOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const movie = await Movie.findById(id).populate("showtimes");
  if (!movie) {
    return next(new HandleERROR("Movie not found", 404));
  }

  return res.status(200).json({
    success: true,
    data: movie,
  });
});

export const create = catchAsync(async (req, res, next) => {
  const movie = await Movie.create(req.body);

  return res.status(201).json({
    success: true,
    data: movie,
  });
});

export const update = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const movie = await Movie.findByIdAndUpdate(id, req.body, { new: true });
  if (!movie) {
    return next(new HandleERROR("Movie not found", 404));
  }

  return res.status(200).json({
    success: true,
    data: movie,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const movieFile = await Movie.findByIdAndDelete(id);
  
  if (!movieFile) {
    return next(new HandleERROR("Movie not found", 404));
  }

  // Assuming movieFile.posterImage is an array of image paths
  for (let image of movieFile?.posterImage) {
    try {
      fs.unlinkSync(`${__dirname}/Public/${image}`);
    } catch (err) {
      console.error("Error deleting image:", err);
    }
  }

  return res.status(200).json({
    success: true,
    message: "Movie deleted and images removed",
  });
});

export const getMovieShowtimesByDate = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const movie = await Movie.findById(id).populate("showtimes");
  if (!movie) {
    return next(new HandleERROR("Movie not found", 404));
  }

  // Example fallback logic if groupShowtimesByDate isn't available
  const showtimes = movie.showtimes.reduce((acc, showtime) => {
    const date = new Date(showtime.date).toISOString().split("T")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(showtime);
    return acc;
  }, {});

  res.status(200).json({
    success: true,
    data: showtimes,
  });
});
