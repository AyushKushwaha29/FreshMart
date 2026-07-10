console.log("✅ APP.JS VERSION 2 LOADED");
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
console.log("CLIENT_URL =", process.env.CLIENT_URL);
const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL?.split(",").map((origin) => origin.trim()) || ["http://localhost:5173"],
//     credentials: true
//   })
// );

const allowedOrigins = (
  process.env.CLIENT_URL ||
  "http://localhost:5173"
)
  .split(",")
  .map((url) => url.trim());

app.use((req, res, next) => {
  console.log(
    `${req.method} ${req.originalUrl} | Origin: ${req.headers.origin}`
  );
  next();
});


  app.use(
  cors({
    origin(origin, callback) {
      console.log("Incoming Origin:", origin);
      console.log("Allowed Origins:", allowedOrigins);

      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        console.log("✅ Origin Allowed");
        return callback(null, true);
      }

      console.log("❌ Origin Blocked:", origin);
      return callback(new Error("CORS not allowed"));
    },
    credentials: true
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false
  })
);

if (process.env.NODE_ENV !== "test") {
  app.use(generalLimiter);
  app.use("/api/auth/request-otp", otpLimiter);
}


app.use(compression());
app.use(
  express.json({
    limit: process.env.JSON_LIMIT || "2mb"
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: process.env.JSON_LIMIT || "2mb"
  })
);

app.use(mongoSanitize());
if (process.env.NODE_ENV !== "test") {
  app.use(
    morgan(
      process.env.NODE_ENV === "production"
        ? "combined"
        : "dev"
    )
  );
}
app.use("/invoices", express.static(path.resolve(__dirname, "../tmp/invoices")));
app.use("/uploads", express.static(path.resolve(__dirname, "../tmp/uploads")));
app.use("/docs", express.static(path.resolve(__dirname, "../docs")));

app.get("/health", (_req, res) => {
  const response = {
    success: true,
    message: "FreshMart API is running"
  };

  if (process.env.NODE_ENV !== "production") {
    response.environment = process.env.NODE_ENV;
    response.uptime = process.uptime();
    response.timestamp = new Date().toISOString();
    response.version = process.env.npm_package_version;
  }

  res.status(200).json(response);
});


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
