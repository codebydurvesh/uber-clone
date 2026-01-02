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

export { registerUser };
