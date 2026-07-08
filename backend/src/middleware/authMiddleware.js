import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, _res, next) => {
  console.log("===== AUTH CHECK =====");
  console.log("Authorization Header:", req.headers.authorization);

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Authentication required");
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 401;
    throw error;
  }

  if (user.isBlocked) {
    const error = new Error("Account is blocked");
    error.statusCode = 403;
    throw error;
  }

  req.user = user;
  next();
});

export const authorize =
  (...roles) =>
  (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const error = new Error("You are not authorized to access this resource");
      error.statusCode = 403;
      throw error;
    }

    next();
  };

