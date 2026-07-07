import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import asyncHandler from "../utils/asyncHandler.js";
import { buildCheckoutPayload, createOrderFromSnapshot } from "../services/orderService.js";

export const placeCodOrder = asyncHandler(async (req, res) => {
  const { addressId, couponCode } = req.body;
  const payload = await buildCheckoutPayload({
    userId: req.user._id,
    addressId,
    couponCode
  });

  const order = await createOrderFromSnapshot({
    userId: req.user._id,
    addressId,
    items: payload.items,
    pricing: payload.pricing,
    paymentMethod: "COD",
    paymentStatus: "Pending",
    couponCode: payload.coupon?.code
  });

  await Payment.create({
    user: req.user._id,
    order: order._id,
    provider: "COD",
    status: "cod_pending",
    amount: order.pricing.total,
    checkoutSnapshot: {
      addressId,
      couponCode: payload.coupon?.code,
      items: payload.items,
      pricing: payload.pricing
    }
  });

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    data: order
  });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: orders
  });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const query = {
    _id: req.params.id
  };

  if (req.user.role !== "admin") {
    query.user = req.user._id;
  }

  const order = await Order.findOne(query).populate("user", "name mobile email");

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

export const getInvoiceLink = asyncHandler(async (req, res) => {
  const query = {
    _id: req.params.id
  };

  if (req.user.role !== "admin") {
    query.user = req.user._id;
  }

  const order = await Order.findOne(query);

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    data: {
      invoiceUrl: order.invoiceUrl
    }
  });
});

