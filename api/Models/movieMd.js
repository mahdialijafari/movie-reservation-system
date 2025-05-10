import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Movie title is required"],
  },
  description: {
    type: String,
    required: true,
  },
  genre: {
    type: [String], // Array to support multi-genre
    required: true,
  },
  posterImage: {
    type: [String], // URL or path to image
    required: true,
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
  showtimes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Showtime"
  }],
}, { timestamps: true });

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
