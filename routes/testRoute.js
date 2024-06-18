import express from "express";
import { testController } from "../controllers/testConttroller.js";

// router Object
const router = express.Router();

// routes
router.get("/test", testController);

export default router;
