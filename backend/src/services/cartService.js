import Cart from "../models/Cart.js";
import Coupon from "../models/Coupon.js";
import Product from "../models/Product.js";
import { calculatePricing } from "../utils/calculatePricing.js";

export const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate("items.product").populate("coupon");

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: []
    });
    cart = await cart.populate("items.product").populate("coupon");
  }

  return cart;
};

export const cartItemsToSnapshot = (cartItems) => {
  return cartItems.map((item) => ({
    productId: String(item.product._id),
    name: item.product.name,
    image: item.product.images?.[0]?.url || "",
    unit: item.product.unit,
    quantity: item.quantity,
    price: item.product.price,
    discountPrice: item.product.discountPrice ?? item.product.price,
    subtotal: (item.product.discountPrice ?? item.product.price) * item.quantity
  }));
};

export const buildCartSummary = async (userId) => {
  const cart = await getOrCreateCart(userId);
  const items = cartItemsToSnapshot(cart.items);
  let coupon = null;

  if (cart.coupon) {
    coupon = await Coupon.findById(cart.coupon._id || cart.coupon);
  }

  return {
    cart,
    items,
    pricing: calculatePricing({ items, coupon }),
    coupon
  };
};

export const ensureProductAvailability = async (productId, quantity) => {
  const product = await Product.findById(productId).populate("category");

  if (!product || !product.availability) {
    const error = new Error("Product is unavailable");
    error.statusCode = 404;
    throw error;
  }

  if (product.stock < quantity) {
    const error = new Error(`Only ${product.stock} units available for ${product.name}`);
    error.statusCode = 400;
    throw error;
  }

  return product;
};

