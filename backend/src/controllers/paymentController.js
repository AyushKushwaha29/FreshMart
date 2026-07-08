import crypto from "crypto";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import asyncHandler from "../utils/asyncHandler.js";
import razorpay from "../config/razorpay.js";
import { buildCheckoutPayload, createOrderFromSnapshot } from "../services/orderService.js";

export const createRazorpayOrder = asyncHandler(async (req, res) => {

  const { addressId, couponCode } = req.body;
  const payload = await buildCheckoutPayload({
    userId: req.user._id,
    addressId,
    couponCode
  });

  let razorpayOrder;

  // if (razorpay) {
  //   razorpayOrder = await razorpay.orders.create({
  //     amount: Math.round(payload.pricing.total * 100),
  //     currency: "INR",
  //     receipt: `fm-${Date.now()}`,
  //     notes: {
  //       userId: String(req.user._id),
  //       addressId
  //     }
  //   });
  // }
  if (razorpay) {
  try {
    razorpayOrder = await razorpay.orders.create({
      amount: Math.round(payload.pricing.total * 100),
      currency: "INR",
      receipt: `fm-${Date.now()}`,
      notes: {
        userId: String(req.user._id),
        addressId
      }
    });

    console.log("ORDER CREATED:", razorpayOrder);

  } catch (err) {
    console.error("RAZORPAY ERROR:");
    console.error(err);
    throw err;
  }
}
   else {
    razorpayOrder = {
      id: `order_mock_${Date.now()}`,
      amount: Math.round(payload.pricing.total * 100),
      currency: "INR"
    };
  }

  await Payment.create({
    user: req.user._id,
    provider: "Razorpay",
    providerOrderId: razorpayOrder.id,
    status: "created",
    amount: payload.pricing.total,
    rawResponse: razorpayOrder,
    checkoutSnapshot: {
      addressId,
      couponCode: payload.coupon?.code,
      items: payload.items,
      pricing: payload.pricing
    }
  });

  res.status(201).json({
    success: true,
    message: "Razorpay order created successfully",
    data: {
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID || "rzp_test_mock"
    }
  });
});

export const verifyRazorpayPayment = asyncHandler(async (req, res) => {

  console.log("============== VERIFY HIT ==============");
  console.log(req.body);

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const paymentRecord = await Payment.findOne({
    providerOrderId: razorpayOrderId,
    user: req.user._id
  });

  if (!paymentRecord) {
    const error = new Error("Payment record not found");
    error.statusCode = 404;
    throw error;
  }

  if (paymentRecord.order) {
    const order = await Order.findById(paymentRecord.order);

    res.status(200).json({
      success: true,
      message: "Payment already verified",
      data: order
    });
    return;
  }

  let isSignatureValid = false;

  if (process.env.RAZORPAY_KEY_SECRET) {
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    isSignatureValid = generatedSignature === razorpaySignature;
  } else {
    isSignatureValid = process.env.NODE_ENV !== "production";
  }

  if (!isSignatureValid) {
    paymentRecord.status = "failed";
    paymentRecord.providerPaymentId = razorpayPaymentId;
    paymentRecord.signature = razorpaySignature;
    await paymentRecord.save();

    const error = new Error("Payment verification failed");
    error.statusCode = 400;
    throw error;
  }

  paymentRecord.status = "paid";
  paymentRecord.providerPaymentId = razorpayPaymentId;
  paymentRecord.signature = razorpaySignature;
  await paymentRecord.save();

  const order = await createOrderFromSnapshot({
    userId: req.user._id,
    addressId: paymentRecord.checkoutSnapshot.addressId,
    items: paymentRecord.checkoutSnapshot.items,
    pricing: paymentRecord.checkoutSnapshot.pricing,
    paymentMethod: "Razorpay",
    paymentStatus: "Paid",
    couponCode: paymentRecord.checkoutSnapshot.couponCode,
    razorpayOrderId,
    razorpayPaymentId,
    paymentRecordId: paymentRecord._id
  });

  res.status(200).json({
    success: true,
    message: "Payment verified successfully",
    data: order
  });
});
