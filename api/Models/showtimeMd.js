import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  seatNumber: String,  // e.g. "A1", "B3"
  isReserved: {
    type: Boolean,
    default: false,
  },
  reservedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  }
});

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
  seats: [seatSchema], // all seats for this showtime
  price: {
    type: Number,
    required: true,
  }
}, { timestamps: true });

const Showtime = mongoose.model("Showtime", showtimeSchema);
export default Showtime;
