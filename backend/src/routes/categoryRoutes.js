import { Router } from "express";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../controllers/categoryController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { categoryValidator } from "../validators/index.js";

const router = Router();

router.get("/", getCategories);
router.post("/", protect, authorize("admin"), categoryValidator, validateRequest, createCategory);
router.put("/:id", protect, authorize("admin"), categoryValidator, validateRequest, updateCategory);
router.delete("/:id", protect, authorize("admin"), deleteCategory);

export default router;

