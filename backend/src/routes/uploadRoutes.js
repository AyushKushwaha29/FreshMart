import { Router } from "express";
import { uploadImages } from "../controllers/uploadController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = Router();

router.post("/images", protect, authorize("admin"), upload.array("images", 5), uploadImages);

export default router;
