import mongoose from "mongoose";

// review model
const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    rating: {
      type: Number,
      default: 0,
    },
    comment: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "user require"],
    },
  },
  { timestamps: true }
);

// product model
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is require"],
    },
    description: {
      type: String,
      required: [true, "product description is require"],
    },
    price: {
      type: Number,
      required: [true, "product price is require"],
    },
    stock: {
      type: Number,
      required: [true, "product stock is require"],
    },
    // quantity: {
    //   type: Number,
    //   required: [true, "product quantity is require"],
    // },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    reviews: [reviewSchema],
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Products", productSchema);
