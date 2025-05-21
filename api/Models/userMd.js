import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: String,
  birthDate: Date,
  username:{
    type:String,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Invalid email format"],
  },
  phoneNumber: {
    type: String,
    match: [/^(\+98|0)?9\d{9}$/, "Phone number invalid"],
    // required: [true, "Phone number is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  role: {
    type: String,
    enum: ["user", "admin", "superAdmin"],
    default: "user",
  },
  reservationIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reservation",
  }],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
