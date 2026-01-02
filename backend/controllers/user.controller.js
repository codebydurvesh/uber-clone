import { User } from "../models/user.model.js";
import { createUser } from "../services/user.service.js";
import { validationResult } from "express-validator";

const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { fullName, email, password } = req.body;

  const isUserExists = await User.findOne({ email });
  if (isUserExists) {
    return res
      .status(400)
      .json({ error: "User with this email already exists" });
  }

  const user = await User.create({
    fullName: {
      firstname: fullName.firstname,
      lastname: fullName.lastname,
    },
    email,
    password,
  });

  const token = user.generateAuthToken();

  res.status(201).json({ user, token });
};

const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const token = user.generateAuthToken();

  const options = {
    httpOnly: true,
    secure: true,
  };

  res.status(200).cookie("token", token, options).json({ user, token });
};

const getUserProfile = async (req, res) => {
  const user = req.user;
  res.status(200).json({ user });
};

const userLogout = async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("token", options)
    .json({ message: "Logged out successfully" });
};

export { registerUser, loginUser, getUserProfile, userLogout };
