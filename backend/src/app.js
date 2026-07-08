import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { generalLimiter, otpLimiter } from "./middleware/rateLimiter.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);
app.use(generalLimiter);
app.use(compression());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use("/invoices", express.static(path.resolve(__dirname, "../tmp/invoices")));
app.use("/uploads", express.static(path.resolve(__dirname, "../tmp/uploads")));
app.use("/docs", express.static(path.resolve(__dirname, "../docs")));

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "FreshMart API is running"
  });
});

app.use("/api/auth/request-otp", otpLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/uploads", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
