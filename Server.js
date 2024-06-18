import express from "express";
import morgan from "morgan";
import colors from "colors";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import Stripe from "stripe";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
// import routes
import testRoute from "./routes/testRoute.js";
import userRoute from "./routes/userRoutes.js";
import productRoute from "./routes/productRoute.js";
import categoryRoute from "./routes/categoryRoutes.js";
import orderRoute from "./routes/orderRoute.js";

// dot env config
dotenv.config();

// stripe configuration
export const stripe = new Stripe(process.env.STRIPE_API_SECRET);

// conect database
connectDB();

// cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// rest object
const app = express();
// middlewares
app.use(helmet());
app.use(mongoSanitize());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors("*"));

// routes
app.use("/api/v1", testRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/cat", categoryRoute);
app.use("/api/v1/order", orderRoute);

// PORT
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`.bgCyan);
});
