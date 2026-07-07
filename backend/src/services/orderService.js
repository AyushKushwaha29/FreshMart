import Address from "../models/Address.js";
import Cart from "../models/Cart.js";
import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import { calculatePricing } from "../utils/calculatePricing.js";
import { buildOrderId } from "../utils/orderHelpers.js";
import { getValidCoupon } from "./couponService.js";
import { generateInvoice } from "./invoiceService.js";
import { sendOrderConfirmationSms } from "./smsService.js";

const assertInventory = async (items) => {
  const products = await Product.find({
    _id: { $in: items.map((item) => item.productId) }
  }).select("name stock availability");

  const productMap = new Map(products.map((product) => [String(product._id), product]));

  items.forEach((item) => {
    const product = productMap.get(item.productId);

    if (!product || !product.availability) {
      const error = new Error(`${item.name} is unavailable`);
      error.statusCode = 400;
      throw error;
    }

    if (product.stock < item.quantity) {
      const error = new Error(`${item.name} is low on stock`);
      error.statusCode = 400;
      throw error;
    }
  });

  return productMap;
};

const reserveInventory = async (items) => {
  await Promise.all(
    items.map(async (item) => {
      const product = await Product.findById(item.productId);
      product.stock -= item.quantity;
      if (product.stock <= 0) {
        product.stock = 0;
        product.availability = false;
      }
      await product.save();
    })
  );
};

const snapshotAddress = (address) => ({
  fullName: address.fullName,
  mobile: address.mobile,
  line1: address.line1,
  line2: address.line2,
  landmark: address.landmark,
  city: address.city,
  state: address.state,
  postalCode: address.postalCode,
  country: address.country,
  tag: address.tag
});

export const createOrderFromSnapshot = async ({
  userId,
  addressId,
  items,
  pricing,
  paymentMethod,
  paymentStatus,
  couponCode,
  razorpayOrderId,
  razorpayPaymentId,
  paymentRecordId
}) => {
  await assertInventory(items);

  const address = await Address.findOne({ _id: addressId, user: userId });

  if (!address) {
    const error = new Error("Address not found");
    error.statusCode = 404;
    throw error;
  }

  const order = await Order.create({
    orderId: buildOrderId(),
    user: userId,
    items: items.map((item) => ({
      product: item.productId,
      name: item.name,
      image: item.image,
      unit: item.unit,
      quantity: item.quantity,
      price: item.price,
      discountPrice: item.discountPrice,
      subtotal: item.subtotal
    })),
    pricing: {
      ...pricing,
      couponCode: couponCode || undefined
    },
    status: "Pending",
    statusTimeline: [
      {
        status: "Pending",
        note: "Order placed successfully"
      }
    ],
    deliveryAddress: snapshotAddress(address),
    paymentMethod,
    paymentStatus,
    razorpayOrderId,
    razorpayPaymentId,
    estimatedDeliveryAt: new Date(Date.now() + 60 * 60 * 1000)
  });

  await reserveInventory(items);

  if (couponCode) {
    await Coupon.updateOne({ code: couponCode }, { $inc: { usedCount: 1 } });
  }

  if (paymentRecordId) {
    await Payment.findByIdAndUpdate(paymentRecordId, {
      order: order._id
    });
  }

  const user = await User.findById(userId);

  const [invoiceResult] = await Promise.allSettled([generateInvoice(order)]);
  if (invoiceResult.status === "fulfilled") {
    order.invoiceUrl = invoiceResult.value;
    await order.save();
  }

  await Promise.allSettled([
    sendOrderConfirmationSms({
      mobile: user.mobile,
      name: user.name,
      orderId: order.orderId,
      amount: order.pricing.total
    }),
    Cart.findOneAndUpdate(
      { user: userId },
      {
        items: [],
        $unset: { coupon: 1 }
      }
    )
  ]);

  return order;
};

export const buildCheckoutPayload = async ({ userId, addressId, couponCode }) => {
  const cart = await Cart.findOne({ user: userId }).populate({
    path: "items.product",
    populate: {
      path: "category"
    }
  });

  if (!cart || cart.items.length === 0) {
    const error = new Error("Cart is empty");
    error.statusCode = 400;
    throw error;
  }

  const items = cart.items.map((item) => ({
    productId: String(item.product._id),
    name: item.product.name,
    image: item.product.images?.[0]?.url || "",
    unit: item.product.unit,
    quantity: item.quantity,
    price: item.product.price,
    discountPrice: item.product.discountPrice ?? item.product.price,
    subtotal: (item.product.discountPrice ?? item.product.price) * item.quantity
  }));

  let coupon = null;
  const cartTotal = items.reduce((sum, item) => sum + item.subtotal, 0);

  if (couponCode) {
    coupon = await getValidCoupon({
      code: couponCode,
      userId,
      cartItems: cart.items,
      cartTotal
    });
  } else if (cart.coupon) {
    const existingCoupon = await Coupon.findById(cart.coupon);
    if (existingCoupon) {
      coupon = await getValidCoupon({
        code: existingCoupon.code,
        userId,
        cartItems: cart.items,
        cartTotal
      });
    }
  }

  const pricing = calculatePricing({ items, coupon });

  const address = await Address.findOne({ _id: addressId, user: userId });

  if (!address) {
    const error = new Error("Address not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    address,
    items,
    pricing,
    coupon,
    cartTotal
  };
};
