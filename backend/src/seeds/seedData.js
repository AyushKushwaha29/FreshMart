import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Category from "../models/Category.js";
import Coupon from "../models/Coupon.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { categories, coupons, products } from "../data/catalogData.js";

dotenv.config();

const seed = async () => {
  await connectDB();

  await Promise.all([Category.deleteMany({}), Product.deleteMany({}), Coupon.deleteMany({})]);

  const createdCategories = await Category.insertMany(categories);
  const categoryMap = new Map(createdCategories.map((category) => [category.name, category._id]));

  await Product.insertMany(
    products.map((product) => ({
      ...product,
      category: categoryMap.get(product.categoryName)
    }))
  );

  const now = new Date();
  const endsAt = new Date();
  endsAt.setMonth(endsAt.getMonth() + 2);

  await Coupon.insertMany(
    coupons.map((coupon) => ({
      ...coupon,
      startsAt: now,
      endsAt
    }))
  );

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();

  if (adminEmail) {
    let admin = await User.findOne({ email: adminEmail, role: "admin" });

    if (!admin) {
      admin = await User.create({
        name: process.env.ADMIN_NAME || "FreshMart Admin",
        email: adminEmail,
        mobile: process.env.ADMIN_MOBILE || "9999999999",
        password: process.env.ADMIN_PASSWORD || "FreshMart@123",
        role: "admin"
      });
    }

    console.log(`Admin ready: ${admin.email}`);
  }

  console.log("FreshMart seed completed successfully");
  process.exit(0);
};

seed().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});

