import express from "express";
import {
  createProductController,
  deleteProductController,
  deleteProductImageController,
  getAllProductsController,
  getSingleProductController,
  getTopProductsController,
  productReviewController,
  updateProductController,
  updateProductImageController,
} from "../controllers/productController.js";
import { isAdmin, isAuth } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/Multer.js";

const router = express.Router();

// routes
// get all products
router.get("/get-all", getAllProductsController);

// get top products
router.get("/top", getTopProductsController);

// get single product
router.get("/:id", getSingleProductController);

// create single product
router.post("/create", isAuth, isAdmin, singleUpload, createProductController);

// update  product
router.put("/:id", isAuth, isAdmin, updateProductController);

// update  product image controller
router.put(
  "/image/:id",
  isAuth,
  isAdmin,
  singleUpload,
  updateProductImageController
);

// delete  product image controller
router.delete(
  "/delete-image/:id",
  isAuth,
  isAdmin,
  deleteProductImageController
);

// delete  product
router.delete("/delete/:id", isAuth, isAdmin, deleteProductController);

// review product
router.put("/:id/review", isAuth, productReviewController);

export default router;
