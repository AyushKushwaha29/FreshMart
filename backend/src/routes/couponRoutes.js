import { Router } from "express";
import {
  createCoupon,
  deleteCoupon,
  getActiveCoupons,
  getCoupons,
  updateCoupon,
  validateCoupon
} from "../controllers/couponController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { couponCodeValidator, couponValidator } from "../validators/index.js";

const router = Router();

router.get("/active", getActiveCoupons);
router.post("/validate", protect, couponCodeValidator, validateRequest, validateCoupon);
router.get("/", protect, authorize("admin"), getCoupons);
router.post("/", protect, authorize("admin"), couponValidator, validateRequest, createCoupon);
router.put("/:id", protect, authorize("admin"), couponValidator, validateRequest, updateCoupon);
router.delete("/:id", protect, authorize("admin"), deleteCoupon);

export default router;

