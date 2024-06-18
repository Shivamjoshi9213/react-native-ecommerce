import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      requrired: [true, "category is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
