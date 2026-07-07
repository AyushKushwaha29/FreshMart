import { Router } from "express";
import { adminLogin, getProfile, requestOtp, updateProfile, verifyOtpAndLogin } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { adminLoginValidator, requestOtpValidator, verifyOtpValidator } from "../validators/index.js";

const router = Router();

router.post("/request-otp", requestOtpValidator, validateRequest, requestOtp);
router.post("/verify-otp", verifyOtpValidator, validateRequest, verifyOtpAndLogin);
router.post("/admin/login", adminLoginValidator, validateRequest, adminLogin);
router.get("/me", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;

