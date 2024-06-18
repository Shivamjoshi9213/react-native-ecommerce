import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// user auth
export const isAuth = async (req, res, next) => {
  const { token } = req.cookies;
  // validation
  if (!token) {
    return res.status(404).send({
      success: false,
      message: "UnAuthorized User",
    });
  }
  //   decode token
  const decodeData = JWT.verify(token, process.env.JWT_SECRET);
  req.user = await userModel.findById(decodeData._id); // usermodel mei _id se field banai thi generateTOken mei to whi h ye or hume req.user milta h

  next();
};

// ADMIN auth
export const isAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(401).send({
      success: false,
      message: "admin only",
    });
  }
  next();
};
