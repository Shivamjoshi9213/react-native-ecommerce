import userModel from "../models/userModel.js";
import { getDataUri } from "../utils/Features.js";
import cloudinary from "cloudinary";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, address, city, country, phone, answer } =
      req.body;
    // validation
    if (
      !name ||
      !email ||
      !password ||
      !address ||
      !city ||
      !country ||
      !phone ||
      !answer
    ) {
      return res.status(500).send({
        success: false,
        message: "Please provide all fields",
      });
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(500).send({
        success: false,
        message: "Already register please login",
      });
    }
    const user = await userModel.create({
      name,
      email,
      password,
      address,
      city,
      country,
      phone,
      answer,
    });

    res.status(201).send({
      success: true,
      message: "Register sucessfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Register api",
      error,
    });
  }
};

// login controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(500).send({
        success: false,
        message: "please provide all fields",
      });
    }
    // check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    // check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(404).send({
        success: false,
        message: "Invalid credentials",
      });
    }
    // token
    const token = await user.genrateToken();
    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "development" ? true : false,
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
      })
      .send({
        success: true,
        message: "Login successfully",
        token,
        user,
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login api",
      error,
    });
  }
};

// get user profile
export const getUserProfileController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id); //user login krega to by default id usme aa jaegi id aa rhi h userModel mei genrate token mei se _id
    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "User Profile fetched successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in profile api",
      error,
    });
  }
};

// logout controller
export const logoutController = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
        secure: process.env.NODE_ENV === "development" ? true : false,
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
      })
      .send({
        success: true,
        message: "Logout successfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in logout api",
      error,
    });
  }
};

// update user profile
export const updateProfileContoller = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const { name, email, address, city, country, phone } = req.body;
    // validation + update
    if (name) user.name = name;
    if (email) user.email = email;
    if (address) user.address = address;
    if (country) user.country = country;
    if (city) user.city = city;
    if (phone) user.phone = phone;

    // save user
    await user.save();
    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "User Proile updated Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update profile api",
      error,
    });
  }
};

// update password
export const updatePasswordContoller = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const { oldPassword, newPassword } = req.body;
    // validation
    if (!oldPassword || !newPassword) {
      return res.status(500).send({
        success: false,
        message: "Please provide old password and new password",
      });
    }
    // old password check
    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Invalid old password",
      });
    }

    user.password = newPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "password updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update password api",
      error,
    });
  }
};

// update user profile photo
export const updateProfilePicContoller = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    // file get from clint photo
    const file = getDataUri(req.file);
    // delete preve image
    await cloudinary.v2.uploader.add_contextdestroy(user.profilePic.public_id);
    // update
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    user.profilePic = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    // save function
    await user.save();
    res.status(200).send({
      success: true,
      message: "Profile picture updated Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update profile pic api",
      error,
    });
  }
};

// forgot password
export const passwordResetController = async (req, res) => {
  try {
    const { email, newPassword, answer } = req.body;
    if (!email || !newPassword || !answer) {
      return res.status(500).send({
        success: false,
        message: "please provide all fields",
      });
    }
    // find user
    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "invalid user or answer ",
      });
    }
    // find answer
    user.password = newPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Your password has been reset please login",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update password  api",
      error,
    });
  }
};
