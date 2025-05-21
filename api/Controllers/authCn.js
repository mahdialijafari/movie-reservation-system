import User from "../Models/userMd.js";
import { catchAsync,HandleERROR } from "vanta-api";
import { sendAuthCode, verifyCode } from "../Utils/smsHandler.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
};

export const auth = catchAsync(async (req, res, next) => {
  const { fullname, username, email, password } = req.body;

  if (!username || !password) {
    return next(new HandleERROR("Username and password are required", 400));
  }

  const existingUser = await User.findOne({ username });

  // If user exists => login
  if (existingUser) {
    const isMatch = await bcryptjs.compare(password, existingUser.password);
    if (!isMatch) {
      return next(new HandleERROR("Invalid username or password", 401));
    }

    const token = generateToken(existingUser);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        token,
        user: {
          id: existingUser._id,
          username: existingUser.username,
          role: existingUser.role,
        },
      },
    });
  }

  // If user does not exist => signup
  if (!email) {
    return next(new HandleERROR("Email is required for registration", 400));
  }

  const hashedPassword = await bcryptjs.hash(password, 12);
  const newUser = await User.create({
    fullname,
    username,
    email,
    password: hashedPassword,
  });

  const token = generateToken(newUser);

  return res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: {
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role,
      },
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

export const adminLogin=catchAsync(async(req,res,next)=>{
  const { phoneNumber = null, password = null } = req.body;

  if ( !password) {
    return next(new HandleERROR("phone and password is required", 400));
  }
  const user = await User.findOne({ phoneNumber });
  if (!user) {
    return next(new HandleERROR("user not found", 400));
  }
  if (user.role !='admin') {
    return next(new HandleERROR("you do not have permission", 401));
  }
  const validPassword = bcryptjs.compareSync(password, user?.password);
  if (!validPassword) {
    return next(new HandleERROR("password incorrect", 401));
  }
  const token = jwt.sign(
    { id: user._id, role: user.role, phoneNumber: user.phoneNumber },
    process.env.JWT_SECRET
  );
  return res.status(200).json({
    success: true,
    data: {
      user: {
        phoneNumber,
        id: user._id,
        role: user.role,
        fullName: user?.fullname,
      },
      token,
    },
    message: "login successfully",
  });
})