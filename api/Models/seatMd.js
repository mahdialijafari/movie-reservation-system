import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: [true, "Seat number is required"],
  },
  row: String,
  column: String,
  type: {
    type: String,
    enum: ["regular", "vip", "accessible"],
    default: "regular"
  },
  theater: {
    type: String, // e.g., "Auditorium 1"
    required: true,
  }
}, { timestamps: true });

const Seat = mongoose.model("Seat", seatSchema);
export default Seat;
