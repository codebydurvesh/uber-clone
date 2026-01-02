import { User } from "../models/user.model.js";
import { createUser } from "../services/user.service.js";
import { validationResult } from "express-validator";

const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { fullName, email, password } = req.body;

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

  res.status(200).json({ user, token });
};

export { registerUser, loginUser };
