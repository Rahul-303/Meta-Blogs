import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.json({ message: "api is working" });
};

export const signout = (req, res, next) => {
  res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "logged out successfully!" });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You can update only your account!"));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "password must be at least 6 characters"));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(400, "username must be between 7 and 20 characters")
      );
    }
  }
  // if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
  //   return next(
  //     errorHandler(400, "username can only contains letters and numbers")
  //   );
  // }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You can delete only your account!"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: "User has been deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

export const getUser = async(req, res, next) => {
  try{
    const user = await User.findById(req.params.userId);
    if(!user){
      return next(errorHandler(404, 'User not found'));
    }
    const {password, ...rest} = user._doc;
    res.status(200).json(rest);
  }catch(error){
    next(error);
  }
}