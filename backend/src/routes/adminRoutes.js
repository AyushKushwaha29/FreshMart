import { Router } from "express";
import {
  exportOrders,
  getCustomers,
  getDashboard,
  getRevenue,
  getSalesAnalytics,
  listAdminOrders,
  updateOrderStatus
} from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateRequest.js";
import { orderStatusValidator } from "../validators/index.js";

const router = Router();

router.use(protect, authorize("admin"));
router.get("/dashboard", getDashboard);
router.get("/orders", listAdminOrders);
router.patch("/orders/:id/status", orderStatusValidator, validateRequest, updateOrderStatus);
router.get("/orders/export", exportOrders);
router.get("/customers", getCustomers);
router.get("/analytics/sales", getSalesAnalytics);
router.get("/revenue", getRevenue);

export default router;

