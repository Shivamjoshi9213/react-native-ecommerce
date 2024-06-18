import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";

export const createCategoryController = async (req, res) => {
  try {
    const { category } = req.body;
    // validation
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Please provide category",
      });
    }
    await categoryModel.create({ category });
    res.status(201).send({
      success: true,
      message: `${category} Category created successfully`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in create category api",
      error,
    });
  }
};

// get all categories
export const getAllCategoriesController = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    if (!categories) {
      return res.status(400).send({
        success: false,
        message: "categories not found ",
      });
    }
    res.status(200).send({
      success: true,
      message: "Categories found successfully",
      totalCat: categories.length,
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in get all category api",
      error,
    });
  }
};
// delete category
export const deleteCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "category not found  ",
      });
    }
    // find Product with this category id
    const products = await productModel.find({ category: category._id });
    // update product category
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.category = undefined;
      await product.save();
    }
    // save
    await category.deleteOne();
    res.status(200).send({
      success: true,
      message: "category deleted successfully",
    });
  } catch (error) {
    console.log(error);
    // cast error
    if (error.name === "castError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "error in delete category api",
      error,
    });
  }
};

// update category
export const updateCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "category not found  ",
      });
    }
    // get new category
    const { updatedCategory } = req.body;
    // find Product with this category id
    const products = await productModel.find({ category: category._id });
    // update product category
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.category = updatedCategory;
      await product.save();
    }
    if (updatedCategory) category.category = updatedCategory;

    // save
    await category.save();
    res.status(200).send({
      success: true,
      message: "category updated successfully",
    });
  } catch (error) {
    console.log(error);
    // cast error
    if (error.name === "castError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "error in update category api",
      error,
    });
  }
};
