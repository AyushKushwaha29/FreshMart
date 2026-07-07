import { Router } from "express";
import { createRazorpayOrder, verifyRazorpayPayment } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { checkoutValidator } from "../validators/index.js";

const router = Router();

router.use(protect);
router.post("/razorpay/order", checkoutValidator, validateRequest, createRazorpayOrder);
router.post("/razorpay/verify", verifyRazorpayPayment);

export default router;

