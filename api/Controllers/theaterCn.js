import { catchAsync, HandleERROR } from "vanta-api";
import Theater from "../Models/theaterMd.js";

// CREATE theater
export const create = catchAsync(async (req, res, next) => {
  const { name, layout } = req.body;

  if (!name || !Array.isArray(layout) || layout.length === 0) {
    return next(new HandleERROR("Name and layout are required", 400));
  }

  // Derive rows, columns, and seatCount
  const rows = layout.length;
  const columns = Math.max(...layout.map((row) => row.length));
  const seatCount = layout.flat().filter((s) => !s.disabled).length;

  const theater = await Theater.create({
    name,
    layout,
    rows,
    columns,
    seatCount,
  });

  res.status(201).json({
    success: true,
    data: theater,
  });
});

// GET all theaters
export const getAll = catchAsync(async (req, res, next) => {
  const theaters = await Theater.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: theaters.length,
    data: theaters,
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const theater = await Theater.findById(id);
  if (!theater) {
    return next(new HandleERROR("Theater not found", 404));
  }
  await theater.deleteOne();
  res.status(200).json({
    success: true,
    message: "Theater removed successfully",
  });
});
