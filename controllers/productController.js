import productModel from "../models/productModel.js";
import { getDataUri } from "../utils/Features.js";
import cloudinary from "cloudinary";

// gett all product
export const getAllProductsController = async (req, res) => {
  try {
    const { keyword, category } = req.query;
    const products = await productModel
      .find({
        name: {
          $regex: keyword ? keyword : "",
          $options: "i",
        },
        // category: category ? category : null,
      })
      .populate("category");

    res.status(200).send({
      success: true,
      message: "get all products successfully",
      totalProducts: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in get all products api",
      error,
    });
  }
};

// top product controller
export const getTopProductsController = async (req, res) => {
  try {
    const products = await productModel.find({}).sort({ rating: -1 }).limit(3);
    res.status(200).send({
      success: true,
      message: "top 3 products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in top product api",
      error,
    });
  }
};

// gett single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      res.status(404).send({
        success: false,
        message: "product not found ",
      });
    }
    res.status(200).send({
      success: true,
      message: "product found successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    // cast error
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "invalid id in single products api",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error in get single product api",
      error,
    });
  }
};

// create product controller
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    if (!name || !description || !price || !stock) {
      res.status(404).send({
        success: false,
        message: "please provide all fields",
      });
    }

    if (!req.file) {
      return res.status(500).send({
        success: false,
        message: "please provide product images",
      });
    }
    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };

    await productModel.create({
      name,
      description,
      price,
      stock,
      category,
      images: [image], // jo uper bna rakhi h wo assign kri h
    });
    res.status(201).send({
      success: true,
      message: "Product created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in create product api",
      error,
    });
  }
};

// update
export const updateProductController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    const { name, description, price, stock, category } = req.body;
    // validate and update
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    await product.save();
    res.status(200).send({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.log(error);
    // cast error
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "invalid id in update products api",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error in update product api",
      error,
    });
  }
};

// update produt image
export const updateProductImageController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    // check file

    if (!req.file) {
      return res.status(404).send({
        success: true,
        message: "Product image found",
      });
    }
    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    // save
    product.images.push(image);
    await product.save();
    res.status(200).send({
      success: true,
      message: "Product image updated",
    });
  } catch (error) {
    console.log(error);
    // cast error
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "invalid id in update image products api",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error in update image product api",
      error,
    });
  }
};

// delete  product image
export const deleteProductImageController = async (req, res) => {
  try {
    // find product
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.stauts(400).send({
        success: false,
        message: "Product not found",
      });
    }
    // image id find from query
    const id = req.query.id;
    if (!id) {
      return res.stauts(400).send({
        success: false,
        message: "Product image not found",
      });
    }

    let isExist = -1;
    product.images.forEach((item, index) => {
      if (item._id.toString() === id.toString()) isExist = index;
    });
    if (isExist < 0) {
      return res.status(404).send({
        success: false,
        message: "image not found",
      });
    }
    //  delete product image
    await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);
    product.images.splice(isExist, 1);
    await product.save();
    return res.status(200).send({
      success: true,
      message: "Product image deleted successfully",
    });
  } catch (error) {
    console.log(error);
    // cast error
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "invalid id in delete image products api",
      });
    }

    res.status(500).send({
      success: false,
      message: "Error in delete product image api ",
      error,
    });
  }
};

// delete product
export const deleteProductController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.stauts(400).send({
        success: false,
        message: "Product not found",
      });
    }
    // find and delete image from cloudinary
    for (let index = 0; index < product.images.length; index++) {
      await cloudinary.v2.uploader.destroy(product.images[index].public_id);
    }
    await product.deleteOne();
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    // cast error
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "invalid id in delete products api",
      });
    }

    res.status(500).send({
      success: false,
      message: "Error in delete product  api ",
      error,
    });
  }
};

// create product review and comment
export const productReviewController = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    // find product
    const product = await productModel.findById(req.params.id);
    // check previous comment
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).send({
        success: false,
        message: "Product Already Reviewed",
      });
    }
    // review object
    const review = {
      name: req.user.name,
      rating: Number(rating),
      user: req.user._id,
    };
    // passing review object to reviews array
    product.reviews.push(review);
    // number of review
    product.numReviews = product.reviews.length;
    // rating
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
    // save
    await product.save();
    res.status(200).send({
      success: true,
      message: "Review Added",
    });
  } catch (error) {
    console.log(error);
    // cast error
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "invalid id in product review api",
      });
    }

    res.status(500).send({
      success: false,
      message: "Error in product review api ",
      error,
    });
  }
};
