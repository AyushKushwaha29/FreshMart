import { Router } from "express";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress
} from "../controllers/addressController.js";
import { protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { addressValidator } from "../validators/index.js";

const router = Router();

router.use(protect);
router.get("/", getAddresses);
router.post("/", addressValidator, validateRequest, createAddress);
router.put("/:id", addressValidator, validateRequest, updateAddress);
router.delete("/:id", deleteAddress);
router.patch("/:id/default", setDefaultAddress);

export default router;

