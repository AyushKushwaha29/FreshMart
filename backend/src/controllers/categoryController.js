import Category from "../models/Category.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1, name: 1 });

  res.status(200).json({
    success: true,
    data: categories
  });
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category
  });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: category
  });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const productsCount = await Product.countDocuments({ category: req.params.id });

  if (productsCount > 0) {
    const error = new Error("Category contains products and cannot be deleted");
    error.statusCode = 400;
    throw error;
  }

  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    message: "Category deleted successfully"
  });
});

