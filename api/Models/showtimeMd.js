import mongoose from "mongoose";

const showtimeSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  dateTime: {
    type: Date,
    required: true,
  },
  theater: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  seats: {
    type: Number,
    required: true,
  },
  isReserved: {
    type: [Boolean], // Array of booleans
    required: true,
  },
}, { timestamps: true });

const Showtime = mongoose.model("Showtime", showtimeSchema);
export default Showtime;
