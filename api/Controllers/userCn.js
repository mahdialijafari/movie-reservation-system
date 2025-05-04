import { catchAsync,HandleERROR,ApiFeatures } from "vanta-api";
import User from "../Models/userMd.js";

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(User, req.query, req.role)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate();
  const resData = await features.execute();
  return res.status(200).json(resData);
});

export const getOne = catchAsync(async (req, res, next) => {    
  const { id } = req.params;
  if (id !== req.userId && req.role !== 'admin' && req.role !== 'superAdmin') {
    return next(new HandleERROR("You don't have permission.", 401));
  }
  const user = await User.findById(id);
  if (!user) {
    return next(new HandleERROR("User not found.", 404));
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

export const update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { role = null, ...others } = req.body; // Exclude forbidden fields explicitly

  if (id !== req.userId && req.role !== 'admin' && req.role !== 'superAdmin') {
    return next(new HandleERROR("You don't have permission.", 401));
  }

  const user = await User.findByIdAndUpdate(id, others, { new: true });
  if (!user) {
    return next(new HandleERROR("User not found.", 404));
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});
