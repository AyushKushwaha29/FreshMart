import { Router } from "express";
import {
  addCartItem,
  applyCartCoupon,
  clearCart,
  getCart,
  removeCartCoupon,
  removeCartItem,
  updateCartItem
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { cartItemValidator, cartUpdateValidator, couponCodeValidator } from "../validators/index.js";

const router = Router();

router.use(protect);
router.get("/", getCart);
router.post("/items", cartItemValidator, validateRequest, addCartItem);
router.patch("/items/:productId", cartUpdateValidator, validateRequest, updateCartItem);
router.delete("/items/:productId", removeCartItem);
router.delete("/", clearCart);
router.post("/coupon", couponCodeValidator, validateRequest, applyCartCoupon);
router.delete("/coupon", removeCartCoupon);

export default router;

