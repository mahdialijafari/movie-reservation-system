import mongoose from "mongoose";

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Genre name is required"],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
}, { timestamps: true });

const Genre = mongoose.model("Genre", genreSchema);
export default Genre;
