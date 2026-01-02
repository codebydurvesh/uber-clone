import { Captain } from "../models/captain.model.js";
import { validationResult } from "express-validator";

const registerCaptain = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }
  const { fullName, email, password, vehicle } = req.body;

  const isCaptainExists = await Captain.findOne({ email });
  if (isCaptainExists) {
    return res
      .status(400)
      .json({ error: "Captain with this email already exists" });
  }

  const captain = await Captain.create({
    fullName: {
      firstname: fullName.firstname,
      lastname: fullName.lastname,
    },
    email,
    password,
    vehicle: {
      color: vehicle.color,
      plate: vehicle.plate,
      capacity: vehicle.capacity,
      vehicleType: vehicle.vehicleType,
    },
  });
  const token = captain.generateAuthToken();
  res
    .status(201)
    .cookie("token", token, { httpOnly: true, secure: true })
    .json(captain);
};

const loginCaptain = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const captain = await Captain.findOne({ email }).select("+password");
  if (!captain) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const isPasswordValid = await captain.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const token = captain.generateAuthToken();
  const options = {
    httpOnly: true,
    secure: true,
  };
  res.status(200).cookie("token", token, options).json({ captain });
};

const logoutCaptain = async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .clearCookie("token", options)
    .json({ message: "Logged out successfully" });
};

const captainProfile = async (req, res) => {
  const captain = req.captain;
  res
    .status(200)
    .json({ message: "Captain profile fetched successfully", captain });
};

export { registerCaptain, loginCaptain, logoutCaptain, captainProfile };
