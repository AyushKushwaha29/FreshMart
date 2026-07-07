import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductBySlug,
  getProducts,
  updateProduct
} from "../controllers/productController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { productValidator } from "../validators/index.js";

const router = Router();

router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:slug", getProductBySlug);
router.post("/", protect, authorize("admin"), productValidator, validateRequest, createProduct);
router.put("/:id", protect, authorize("admin"), productValidator, validateRequest, updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

export default router;

