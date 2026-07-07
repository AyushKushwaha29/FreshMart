import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    fullName: {
      type: String,
      required: true
    },
    mobile: {
      type: String,
      required: true
    },
    line1: {
      type: String,
      required: true
    },
    line2: String,
    landmark: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: "India"
    },
    tag: {
      type: String,
      enum: ["Home", "Work", "Other"],
      default: "Home"
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    location: {
      lat: Number,
      lng: Number
    }
  },
  {
    timestamps: true
  }
);

const Address = mongoose.model("Address", addressSchema);

export default Address;

