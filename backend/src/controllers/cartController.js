import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import { buildCartSummary, getOrCreateCart } from "../services/cartService.js";
import { getValidCoupon } from "../services/couponService.js";

// const populateCart = (cart) => cart.populate("items.product").populate("coupon");
const populateCart = async (cart) => {
  await cart.populate([
    { path: "items.product" },
    { path: "coupon" }
  ]);
  return cart;
};

export const getCart = asyncHandler(async (req, res) => {
  const summary = await buildCartSummary(req.user._id);

  res.status(200).json({
    success: true,
    data: {
      cart: summary.cart,
      pricing: summary.pricing,
      items: summary.items,
      coupon: summary.coupon
    }
  });
});

export const addCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);

  if (!product || !product.availability) {
    const error = new Error("Product is unavailable");
    error.statusCode = 404;
    throw error;
  }

  if (product.stock < quantity) {
    const error = new Error(`Only ${product.stock} items available`);
    error.statusCode = 400;
    throw error;
  }

  const cart = await getOrCreateCart(req.user._id);
  const existingItem = cart.items.find((item) => String(item.product._id) === productId);

  if (existingItem) {
    if (product.stock < existingItem.quantity + quantity) {
      const error = new Error(`Only ${product.stock} items available`);
      error.statusCode = 400;
      throw error;
    }
    existingItem.quantity += quantity;
    existingItem.priceSnapshot = product.discountPrice ?? product.price;
  } else {
    cart.items.push({
      product: product._id,
      quantity,
      priceSnapshot: product.discountPrice ?? product.price
    });
  }

  await cart.save();
  const updatedCart = await populateCart(cart);

  res.status(200).json({
    success: true,
    message: "Cart updated successfully",
    data: updatedCart
  });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.find((cartItem) => String(cartItem.product._id) === req.params.productId);

  if (!item) {
    const error = new Error("Item not found in cart");
    error.statusCode = 404;
    throw error;
  }

  if (quantity <= 0) {
    cart.items = cart.items.filter((cartItem) => String(cartItem.product._id) !== req.params.productId);
  } else {
    const product = await Product.findById(req.params.productId);
    if (product.stock < quantity) {
      const error = new Error(`Only ${product.stock} items available`);
      error.statusCode = 400;
      throw error;
    }
    item.quantity = quantity;
    item.priceSnapshot = product.discountPrice ?? product.price;
  }

  await cart.save();
  const updatedCart = await populateCart(cart);

  res.status(200).json({
    success: true,
    message: "Cart item updated successfully",
    data: updatedCart
  });
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = cart.items.filter((item) => String(item.product._id) !== req.params.productId);
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Item removed from cart"
  });
});

export const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      items: [],
      $unset: { coupon: 1 }
    }
  );

  res.status(200).json({
    success: true,
    message: "Cart cleared successfully"
  });
});

export const applyCartCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const cart = await getOrCreateCart(req.user._id);
  await cart.populate({
    path: "items.product",
    populate: {
      path: "category"
    }
  });

  const cartTotal = cart.items.reduce((sum, item) => sum + (item.product.discountPrice ?? item.product.price) * item.quantity, 0);
  const coupon = await getValidCoupon({
    code,
    userId: req.user._id,
    cartItems: cart.items,
    cartTotal
  });

  cart.coupon = coupon._id;
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Coupon applied successfully",
    data: coupon
  });
});

export const removeCartCoupon = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.coupon = undefined;
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Coupon removed successfully"
  });
});
