import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";

export const getValidCoupon = async ({ code, userId, cartItems, cartTotal }) => {
  if (!code) {
    return null;
  }

  const coupon = await Coupon.findOne({
    code: code.toUpperCase().trim(),
    isActive: true,
    startsAt: { $lte: new Date() },
    endsAt: { $gte: new Date() }
  }).populate("applicableCategories");

  if (!coupon) {
    const error = new Error("Coupon is invalid or expired");
    error.statusCode = 404;
    throw error;
  }

  if (coupon.usedCount >= coupon.usageLimit) {
    const error = new Error("Coupon usage limit reached");
    error.statusCode = 400;
    throw error;
  }

  if (cartTotal < coupon.minOrderValue) {
    const error = new Error(`Minimum order value should be ₹${coupon.minOrderValue}`);
    error.statusCode = 400;
    throw error;
  }

  const userUsageCount = await Order.countDocuments({
    user: userId,
    "pricing.couponCode": coupon.code
  });

  if (userUsageCount >= coupon.perUserLimit) {
    const error = new Error("Coupon usage limit reached for this account");
    error.statusCode = 400;
    throw error;
  }

  if (coupon.applicableCategories?.length) {
    const applicableCategoryIds = new Set(coupon.applicableCategories.map((category) => String(category._id)));
    const hasApplicableItem = cartItems.some((item) =>
      applicableCategoryIds.has(String(item.product.category?._id || item.product.category))
    );

    if (!hasApplicableItem) {
      const error = new Error("Coupon is not applicable to items in your cart");
      error.statusCode = 400;
      throw error;
    }
  }

  return coupon;
};
