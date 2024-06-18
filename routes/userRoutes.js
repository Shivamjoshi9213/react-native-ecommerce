import express from "express";
import {
  getUserProfileController,
  loginController,
  logoutController,
  passwordResetController,
  registerController,
  updatePasswordContoller,
  updateProfileContoller,
  updateProfilePicContoller,
} from "../controllers/userController.js";
import { isAuth } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/Multer.js";
import { rateLimit } from "express-rate-limit";

const router = express.Router();

// RATE LIMIT KO USE KRNE K LIYE LIMITER KO MIDDILEWARE KI TRH USE KR SAKTE H ISE UNCOMMENT KRKE FIR ISAUTH KI TRH LIMITER KO APPLY KR DO REGISTER OR LOGIN PE
// const limiter = rateLimit({
// 	windowMs: 15 * 60 * 1000, // 15 minutes
// 	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
// 	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
// 	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
// 	// store: ... , // Redis, Memcached, etc. See below.
// })

// register route | POST
router.post("/register", registerController);

// login route | POST
router.post("/login", loginController);

// Profile
router.get("/profile", isAuth, getUserProfileController);

// Logout
router.get("/logout", isAuth, logoutController);

// update
router.put("/profile-update", isAuth, updateProfileContoller);

// update password
router.put("/update-password", isAuth, updatePasswordContoller);

// update profile pic
router.put("/update-picture", singleUpload, isAuth, updateProfilePicContoller);

// forgot password
router.post("/reset-password", passwordResetController);
export default router;
