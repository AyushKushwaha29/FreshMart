import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order"
    },
    provider: {
      type: String,
      enum: ["Razorpay", "COD"],
      required: true
    },
    providerOrderId: String,
    providerPaymentId: String,
    status: {
      type: String,
      enum: ["created", "pending", "paid", "failed", "cod_pending", "refunded"],
      default: "pending"
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: "INR"
    },
    signature: String,
    checkoutSnapshot: {
      addressId: String,
      couponCode: String,
      items: [
        {
          productId: String,
          name: String,
          image: String,
          unit: String,
          quantity: Number,
          price: Number,
          discountPrice: Number,
          subtotal: Number
        }
      ],
      pricing: {
        subtotal: Number,
        discount: Number,
        deliveryFee: Number,
        tax: Number,
        total: Number
      }
    },
    rawResponse: mongoose.Schema.Types.Mixed
  },
  {
    timestamps: true
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
