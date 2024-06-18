import express from "express";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  updateCategoryController,
} from "../controllers/categoryController.js";
import { isAdmin, isAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

// create category
router.post("/create", isAuth, isAdmin, createCategoryController);

// get all category
router.get("/get-all", getAllCategoriesController);

// delete category
router.delete("/delete/:id", isAuth, isAdmin, deleteCategoryController);

// update category
router.put("/update/:id", isAuth, isAdmin, updateCategoryController);

export default router;
