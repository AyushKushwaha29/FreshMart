import { body, param } from "express-validator";

export const emailValidator = body("email")
  .trim()
  .isEmail()
  .withMessage("Please provide a valid email address")
  .normalizeEmail();

export const requestOtpValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  emailValidator
];

export const mobileValidator = body("mobile")
  .trim()
  .matches(/^\d{10}$/)
  .withMessage("Please provide a valid 10 digit mobile number");
export const verifyOtpValidator = [
  emailValidator,

  body("otp")
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits")
];

export const adminLoginValidator = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
];

export const categoryValidator = [
  body("name").trim().notEmpty().withMessage("Category name is required"),
  body("description").trim().notEmpty().withMessage("Category description is required")
];

export const productValidator = [
  body("name").trim().notEmpty().withMessage("Product name is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be zero or more"),
  body("category").isMongoId().withMessage("Valid category is required"),
  body("unit").isIn(["Kg", "Gram", "Piece", "Dozen", "Bundle"]).withMessage("Valid unit is required")
];

export const cartItemValidator = [
  body("productId").isMongoId().withMessage("Valid product is required"),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1")
];

export const cartUpdateValidator = [body("quantity").isInt({ min: 0 }).withMessage("Quantity must be zero or more")];

export const addressValidator = [
  body("fullName").trim().notEmpty().withMessage("Full name is required"),
  mobileValidator,
  body("line1").trim().notEmpty().withMessage("Address line 1 is required"),
  body("city").trim().notEmpty().withMessage("City is required"),
  body("state").trim().notEmpty().withMessage("State is required"),
  body("postalCode").trim().notEmpty().withMessage("Postal code is required")
];

export const couponValidator = [
  body("code").trim().notEmpty().withMessage("Coupon code is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("discountType").isIn(["percent", "flat"]).withMessage("Discount type is invalid"),
  body("discountValue").isFloat({ min: 0 }).withMessage("Discount value must be positive"),
  body("startsAt").isISO8601().withMessage("Starts at date is invalid"),
  body("endsAt").isISO8601().withMessage("Ends at date is invalid")
];

export const couponCodeValidator = [body("code").trim().notEmpty().withMessage("Coupon code is required")];

export const checkoutValidator = [body("addressId").isMongoId().withMessage("Valid address is required")];

export const orderStatusValidator = [
  param("id").isMongoId().withMessage("Valid order ID is required"),
  body("status")
    .isIn(["Pending", "Accepted", "Packed", "Out For Delivery", "Delivered", "Cancelled"])
    .withMessage("Invalid order status")
];
