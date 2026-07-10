import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { normalizeMobile } from "../utils/orderHelpers.js";
import asyncHandler from "../utils/asyncHandler.js";
import { issueOtp, verifyOtp } from "../services/otpService.js";
import { sendOtpSms } from "../services/smsService.js";
import { sendOtpEmail } from "../services/emailService.js";

export const requestOtp = asyncHandler(async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const name = req.body.name?.trim() || "FreshMart Customer";

  let user = await User.findOne({ email });

  if (!user) {
  user = await User.create({
  email,
  name
});
  } else if (!user.name && name) {
    user.name = name;
    await user.save();
  }

 const otp = await issueOtp(user);

let emailSent = false;

try {
  await sendOtpEmail({
    email,
    otp,
    name: user.name
  });

  emailSent = true;
} catch (err) {
  console.error("❌ Email sending failed:", err.message);
}

res.status(200).json({
  success: true,
  message: emailSent
    ? "OTP sent successfully"
    : "OTP generated but email could not be delivered",
  data: {
    emailSent
  }
});
});

export const verifyOtpAndLogin = asyncHandler(async (req, res) => {
const email = req.body.email?.trim().toLowerCase();
const otp = req.body.otp?.trim();
const name = req.body.name?.trim() || "FreshMart Customer";

if (!email) {
  const error = new Error("Email is required");
  error.statusCode = 400;
  throw error;
}if (!otp) {
  const error = new Error("OTP is required");
  error.statusCode = 400;
  throw error;
}

let user = await User.findOne({ email });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const isValid = await verifyOtp(user, otp);
    console.log("Request Body:", req.body);
    console.log("OTP:", otp);

  if (!isValid) {
    const error = new Error("Invalid or expired OTP");
    error.statusCode = 400;
    throw error;
  }

  if (name) {
    user.name = name;
    await user.save();
  }

  const token = generateToken({ id: user._id, role: user.role });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      token,
      user
    }
  });
});

export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email: email.toLowerCase(),
    role: "admin"
  }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken({ id: user._id, role: user.role });

  res.status(200).json({
    success: true,
    message: "Admin login successful",
    data: {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      }
    }
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  user.name = req.body.name || user.name;

  // 🔒 Email change nahi hone dena

  if (req.body.mobile) {
    user.mobile = req.body.mobile;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: user
  });
});

