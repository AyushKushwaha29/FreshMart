import mongoose from "mongoose";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";

const buildProductQuery = async (queryParams) => {
  const query = {};

  if (queryParams.search) {
    query.$or = [
      { name: { $regex: queryParams.search, $options: "i" } },
      { description: { $regex: queryParams.search, $options: "i" } },
      { keywords: { $regex: queryParams.search, $options: "i" } }
    ];
  }

  if (queryParams.category) {
    const filters = [{ slug: queryParams.category }];

    if (mongoose.isValidObjectId(queryParams.category)) {
      filters.push({ _id: queryParams.category });
    }

    const category = await Category.findOne({
      $or: filters
    });

    if (category) {
      query.category = category._id;
    }
  }

  if (queryParams.featured === "true") {
    query.isFeatured = true;
  }

  if (queryParams.availability) {
    query.availability = queryParams.availability === "true";
  }

  return query;
};

export const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const skip = (page - 1) * limit;
  const query = await buildProductQuery(req.query);

  const sortMap = {
    latest: { createdAt: -1 },
    price_asc: { discountPrice: 1, price: 1 },
    price_desc: { discountPrice: -1, price: -1 },
    name_asc: { name: 1 }
  };

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate("category")
      .sort(sortMap[req.query.sort] || { isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Product.countDocuments(query)
  ]);

  res.status(200).json({
    success: true,
    data: products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

export const getFeaturedProducts = asyncHandler(async (_req, res) => {
  const products = await Product.find({
    isFeatured: true,
    availability: true
  })
    .populate("category")
    .limit(8)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: products
  });
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    slug: req.params.slug
  }).populate("category");

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const relatedProducts = await Product.find({
    category: product.category._id,
    _id: { $ne: product._id }
  })
    .limit(4)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: {
      product,
      relatedProducts
    }
  });
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  const populated = await Product.findById(product._id).populate("category");

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: populated
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate("category");

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully"
  });
});
