import User from "../Models/userMd.js";
import { catchAsync,HandleERROR } from "vanta-api";
import { sendAuthCode, verifyCode } from "../Utils/smsHandler.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
};

export const auth = catchAsync(async (req, res, next) => {
  const { phoneNumber = null } = req.body;
  if (!phoneNumber) return next(new HandleERROR("Phone number is required", 400));

  const user = await User.findOne({ phoneNumber });
  const passwordExist = !!user?.password;

  if (!passwordExist) {
    const smsResult = await sendAuthCode(phoneNumber);
    if (!smsResult?.success) return next(new HandleERROR("Failed to send code", 400));
  }

  return res.status(200).json({
    success: true,
    message: passwordExist ? "Login with password" : "Code sent",
    data: {
      phoneNumber,
      passwordExist,
      newAccount: !user?._id,
    },
  });
});

export const checkOtp = catchAsync(async (req, res, next) => {
  const { phoneNumber = null, code = null } = req.body;
  if (!phoneNumber || !code) return next(new HandleERROR("Phone number and code are required", 400));

  const smsResult = await verifyCode(phoneNumber, code);
  if (!smsResult?.success) return next(new HandleERROR("Invalid code", 400));

  let user = await User.findOne({ phoneNumber });
  let isNewAccount = false;

  if (!user) {
    user = await User.create({ phoneNumber });
    isNewAccount = true;
  }

  const token = generateToken(user);
  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      isNewAccount,
      user: {
        _id: user._id,
        phoneNumber: user.phoneNumber,
        role: user.role,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        birthDate: user.birthDate || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    },
  });
});

export const checkPassword = catchAsync(async (req, res, next) => {
  const { phoneNumber = null, password = null } = req.body;
  if (!phoneNumber || !password) return next(new HandleERROR("Phone number and password are required", 400));

  const user = await User.findOne({ phoneNumber });
  if (!user || !user.password) return next(new HandleERROR("Invalid credentials", 400));

  const isMatch = bcryptjs.compareSync(password, user.password);
  if (!isMatch) return next(new HandleERROR("Invalid password", 400));

  const token = generateToken(user);
  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: {
        _id: user._id,
        phoneNumber: user.phoneNumber,
        role: user.role,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        birthDate: user.birthDate || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    },
  });
});

export const forgetPassword = catchAsync(async (req, res, next) => {
  const { phoneNumber = null, code = null, newPassword = null } = req.body;
  if (!phoneNumber || !code || !newPassword) {
    return next(new HandleERROR("All fields are required", 400));
  }

  const smsResult = await verifyCode(phoneNumber, code);
  if (!smsResult?.success) return next(new HandleERROR("Invalid code", 400));

  const user = await User.findOne({ phoneNumber });
  if (!user) return next(new HandleERROR("User not found", 404));

  user.password = await bcryptjs.hash(newPassword, 10);
  await user.save();

  const token = generateToken(user);
  return res.status(200).json({
    success: true,
    message: "Password changed successfully",
    data: {
      user: {
        _id: user._id,
        phoneNumber: user.phoneNumber,
        role: user.role,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        birthDate: user.birthDate || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    },
  });
});

export const resendCode = catchAsync(async (req, res, next) => {
  const { phoneNumber = null } = req.body;
  if (!phoneNumber) return next(new HandleERROR("Phone number is required", 400));

  const smsResult = await sendAuthCode(phoneNumber);
  if (!smsResult?.success) return next(new HandleERROR("Failed to send code", 400));

  return res.status(200).json({
    success: true,
    message: "Code sent successfully",
  });
});
