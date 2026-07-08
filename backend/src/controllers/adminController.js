import { Parser } from "json2csv";
import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getIO } from "../socket.js";
import {
  sendOrderDeliveredEmail,
  sendOrderCancelledEmail
} from "../services/emailService.js";

export const getDashboard = asyncHandler(async (_req, res) => {
  const today = new Date();
  today.setHours(0,0,0,0);
  const [
    productsCount,
    customersCount,
    ordersCount,
    couponsCount,
    revenueAgg,
    recentOrders,
    todayOrders,
    todayRevenue,
    pendingOrders,
    lowStock,
    newCustomers
  ] = await Promise.all([

    Product.countDocuments(),
    User.countDocuments({ role: "user" }),
    Order.countDocuments(),
    Coupon.countDocuments(),
    Order.aggregate([
      {
        $group:{
          _id:null,
          revenue:{ $sum:"$pricing.total" }
        }
      }
    ]),

    Order.find()
      .sort({createdAt:-1})
      .limit(5)
      .populate("user","name mobile"),

    Order.countDocuments({
      createdAt:{ $gte: today }
    }),

    Order.aggregate([
      {
        $match:{
          createdAt:{ $gte: today }
        }
      },
      {
        $group:{
          _id:null,
          revenue:{ $sum:"$pricing.total" }
        }
      }
    ]),

    Order.countDocuments({
      status:"Pending"
    }),

    Product.find({
      stock:{ $lte:5 }
    })
    .select("name stock")
    .limit(5),

    User.countDocuments({
      role:"user",
      createdAt:{ $gte: today }
    })
  ]);
  const avgOrderValue =
    ordersCount === 0
      ? 0
      : Math.round(
          (revenueAgg[0]?.revenue || 0) /
          ordersCount
        );
  res.status(200).json({
    success:true,
    data:{
      summary:{
        productsCount,
        customersCount,
        ordersCount,
        couponsCount,
        revenue:
          revenueAgg[0]?.revenue || 0,
        todayOrders,
        todayRevenue:
          todayRevenue[0]?.revenue || 0,
        pendingOrders,
        lowStockProducts:
          lowStock.length,
        newCustomers,
        averageOrderValue:
          avgOrderValue
      },
      recentOrders,
      lowStock
    }
  });
});
export const listAdminOrders = asyncHandler(async (req, res) => {
  const query = {};

  if (req.query.status) {
    query.status = req.query.status;
  }

  const orders = await Order.find(query).sort({ createdAt: -1 }).populate("user", "name mobile email");

  res.status(200).json({
    success: true,
    data: orders
  });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  const previousStatus = order.status;
  order.status = status;
  order.statusTimeline.push({
    status,
    note: note || `Order marked as ${status}`
  });

if (status === "Delivered") {
  order.paymentStatus =
    order.paymentMethod === "COD"
      ? "Paid"
      : order.paymentStatus;

  const user = await User.findById(order.user);

  if (user?.email) {
    await sendOrderDeliveredEmail({
      email: user.email,
      name: user.name,
      order
    });
  }
}

if (status === "Cancelled") {
  order.paymentStatus =
    order.paymentMethod === "Razorpay"
      ? "Refunded"
      : "Failed";

  if (previousStatus !== "Cancelled") {
    await Promise.all(
      order.items.map((item) =>
        Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
          availability: true
        })
      )
    );
  }

  const user = await User.findById(order.user);

  if (user?.email) {
    await sendOrderCancelledEmail({
      email: user.email,
      name: user.name,
      order
    });
  }
}

  await order.save();
  
// Notify customer
console.log("✅ Order Saved");

console.log("📤 Sending Socket Event");

console.log("Room:", `user-${order.user.toString()}`);

getIO().to(`user-${order.user.toString()}`).emit(
  "order-status-updated",
  {
    orderId: order.orderId,
    status: order.status,
    paymentStatus: order.paymentStatus
  }
);

console.log("✅ Socket Event Emitted");

// Notify all admins so dashboard/orders refresh
getIO().to("admins").emit("admin-order-updated", {
  orderId: order.orderId,
  status: order.status,
  paymentStatus: order.paymentStatus
});

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    data: order
  });
});

export const getCustomers = asyncHandler(async (_req, res) => {
  const customers = await User.find({ role: "user" }).sort({ createdAt: -1 }).select("-otp");

  res.status(200).json({
    success: true,
    data: customers
  });
});

export const getSalesAnalytics = asyncHandler(async (_req, res) => {
  const lastThirtyDays = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [dailySales, topProducts] = await Promise.all([
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: lastThirtyDays }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          orders: { $sum: 1 },
          revenue: { $sum: "$pricing.total" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]),
    Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          quantity: { $sum: "$items.quantity" },
          revenue: { $sum: "$items.subtotal" }
        }
      },
      {
        $sort: { quantity: -1 }
      },
      {
        $limit: 5
      }
    ])
  ]);

  res.status(200).json({
    success: true,
    data: {
      dailySales,
      topProducts
    }
  });
});

export const getRevenue = asyncHandler(async (_req, res) => {
  const revenue = await Order.aggregate([
    {
      $group: {
        _id: "$paymentMethod",
        total: { $sum: "$pricing.total" }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: revenue
  });
});

export const exportOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).populate("user", "name mobile email");
  const parser = new Parser({
    fields: [
      { label: "Order ID", value: "orderId" },
      { label: "Customer", value: (row) => row.user?.name || "" },
      { label: "Mobile", value: (row) => row.user?.mobile || "" },
      { label: "Payment Method", value: "paymentMethod" },
      { label: "Payment Status", value: "paymentStatus" },
      { label: "Order Status", value: "status" },
      { label: "Amount", value: "pricing.total" },
      { label: "Created At", value: "createdAt" }
    ]
  });

  const csv = parser.parse(orders);

  res.header("Content-Type", "text/csv");
  res.attachment("freshmart-orders.csv");
  res.send(csv);
});
