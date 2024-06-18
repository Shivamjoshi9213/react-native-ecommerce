import express from "express";
import { isAdmin, isAuth } from "../middlewares/authMiddleware.js";
import {
  changeOrderStatusController,
  createOrderController,
  getAllOdersController,
  getMyOrdersController,
  paymentController,
  singleOrderDetailsController,
} from "../controllers/orderController.js";

const router = express.Router();

// create order
router.post("/create", isAuth, createOrderController);

// get all order
router.get("/my-orders", isAuth, getMyOrdersController);

// get single order
router.get("/my-orders/:id", isAuth, singleOrderDetailsController);

// ACCEPT PAYMENT
router.post("/payments", isAuth, paymentController);

// ================================================================
// admin route
router.get("/admin/get-all-orders", isAuth, isAdmin, getAllOdersController);

// change order status
router.put("/admin/order/:id", isAuth, isAdmin, changeOrderStatusController);

export default router;
