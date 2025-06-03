import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Movie title is required"],
    },
    description: {
      type: String,
      required: true,
    },
    genre: {
      type: [String],
      required: true,
    },
    posterImage: {
      type: [String],
      required: true,
      default: [],
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    showtimes: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Showtime",
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
