import Wishlist from "../models/Wishlist.js";
import asyncHandler from "../utils/asyncHandler.js";

const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId }).populate({
    path: "items",
    populate: {
      path: "category"
    }
  });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: userId,
      items: []
    });
    wishlist = await wishlist.populate({
      path: "items",
      populate: {
        path: "category"
      }
    });
  }

  return wishlist;
};

export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);

  res.status(200).json({
    success: true,
    data: wishlist
  });
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  const exists = wishlist.items.some((item) => String(item._id) === req.params.productId);

  if (!exists) {
    wishlist.items.push(req.params.productId);
    await wishlist.save();
  }

  const populated = await wishlist.populate({
    path: "items",
    populate: { path: "category" }
  });

  res.status(200).json({
    success: true,
    message: "Added to wishlist",
    data: populated
  });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  wishlist.items = wishlist.items.filter((item) => String(item._id) !== req.params.productId);
  await wishlist.save();

  res.status(200).json({
    success: true,
    message: "Removed from wishlist"
  });
});

