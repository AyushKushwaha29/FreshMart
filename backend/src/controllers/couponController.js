import Coupon from "../models/Coupon.js";
import asyncHandler from "../utils/asyncHandler.js";
import Cart from "../models/Cart.js";
import { getValidCoupon } from "../services/couponService.js";
import { calculatePricing } from "../utils/calculatePricing.js";

export const getActiveCoupons = asyncHandler(async (_req, res) => {
  const coupons = await Coupon.find({
    isActive: true,
    startsAt: { $lte: new Date() },
    endsAt: { $gte: new Date() }
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: coupons
  });
});

export const validateCoupon = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate({
    path: "items.product",
    populate: { path: "category" }
  });

  if (!cart || !cart.items.length) {
    const error = new Error("Cart is empty");
    error.statusCode = 400;
    throw error;
  }

  const cartTotal = cart.items.reduce((sum, item) => sum + (item.product.discountPrice ?? item.product.price) * item.quantity, 0);
  const coupon = await getValidCoupon({
    code: req.body.code,
    userId: req.user._id,
    cartItems: cart.items,
    cartTotal
  });

  const items = cart.items.map((item) => ({
    price: item.product.price,
    discountPrice: item.product.discountPrice ?? item.product.price,
    quantity: item.quantity
  }));

  const pricing = calculatePricing({ items, coupon });

  res.status(200).json({
    success: true,
    message: "Coupon is valid",
    data: {
      coupon,
      pricing
    }
  });
});

export const getCoupons = asyncHandler(async (_req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: coupons
  });
});

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create({
    ...req.body,
    code: req.body.code.toUpperCase()
  });

  res.status(201).json({
    success: true,
    message: "Coupon created successfully",
    data: coupon
  });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      code: req.body.code?.toUpperCase() || undefined
    },
    { new: true, runValidators: true }
  );

  if (!coupon) {
    const error = new Error("Coupon not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    message: "Coupon updated successfully",
    data: coupon
  });
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);

  if (!coupon) {
    const error = new Error("Coupon not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    message: "Coupon deleted successfully"
  });
});

