import Address from "../models/Address.js";
import asyncHandler from "../utils/asyncHandler.js";

const resetDefaultAddress = async (userId) => {
  await Address.updateMany({ user: userId }, { isDefault: false });
};

export const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });

  res.status(200).json({
    success: true,
    data: addresses
  });
});

export const createAddress = asyncHandler(async (req, res) => {
  if (req.body.isDefault) {
    await resetDefaultAddress(req.user._id);
  }

  const address = await Address.create({
    ...req.body,
    user: req.user._id
  });

  res.status(201).json({
    success: true,
    message: "Address added successfully",
    data: address
  });
});

export const updateAddress = asyncHandler(async (req, res) => {
  if (req.body.isDefault) {
    await resetDefaultAddress(req.user._id);
  }

  const address = await Address.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!address) {
    const error = new Error("Address not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    message: "Address updated successfully",
    data: address
  });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });

  if (!address) {
    const error = new Error("Address not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    message: "Address deleted successfully"
  });
});

export const setDefaultAddress = asyncHandler(async (req, res) => {
  await resetDefaultAddress(req.user._id);
  const address = await Address.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { isDefault: true },
    { new: true }
  );

  if (!address) {
    const error = new Error("Address not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    message: "Default address updated",
    data: address
  });
});

