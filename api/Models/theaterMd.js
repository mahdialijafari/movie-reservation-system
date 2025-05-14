import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    disabled: { type: Boolean, default: false },
  },
  { _id: false }
);

const theaterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Theater name is required"],
      unique: true,
      trim: true,
    },
    layout: {
      type: [[seatSchema]],
      required: [true, "Layout is required"],
    },
    rows: {
      type: Number,
      required: true,
      min: 1,
    },
    columns: {
      type: Number,
      required: true,
      min: 1,
    },
    seatCount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

const Theater = mongoose.model("Theater", theaterSchema);
export default Theater;
