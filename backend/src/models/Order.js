import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },
    name: String,
    image: String,
    unit: String,
    quantity: Number,
    price: Number,
    discountPrice: Number,
    subtotal: Number
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    items: [orderItemSchema],
    pricing: {
      subtotal: Number,
      discount: Number,
      deliveryFee: Number,
      tax: Number,
      total: Number,
      couponCode: String
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Packed", "Out For Delivery", "Delivered", "Cancelled"],
      default: "Pending"
    },
    statusTimeline: [
      {
        status: String,
        note: String,
        changedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    deliveryAddress: {
      fullName: String,
      mobile: String,
      line1: String,
      line2: String,
      landmark: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      tag: String
    },
    paymentMethod: {
      type: String,
      enum: ["Razorpay", "COD"],
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending"
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    invoiceUrl: String,
    estimatedDeliveryAt: Date,
    notes: String
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;

