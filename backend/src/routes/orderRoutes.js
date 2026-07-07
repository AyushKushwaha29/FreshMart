import { Router } from "express";
import { getInvoiceLink, getMyOrders, getOrderById, placeCodOrder } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { checkoutValidator } from "../validators/index.js";

const router = Router();

router.use(protect);
router.post("/cod", checkoutValidator, validateRequest, placeCodOrder);
router.get("/", getMyOrders);
router.get("/:id", getOrderById);
router.get("/:id/invoice", getInvoiceLink);

export default router;

