import { Router } from "express";
import { body } from "express-validator";
import {
  registerCaptain,
  loginCaptain,
  logoutCaptain,
  captainProfile,
} from "../controllers/captain.controller.js";
import { VerifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("fullName")
      .isLength({ min: 3 })
      .withMessage("Full name must be at least 3 characters long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("vehicle.color")
      .isLength({ min: 3 })
      .withMessage("Vehicle color must be at least 3 characters long"),
    body("vehicle.plate")
      .isLength({ min: 3 })
      .withMessage("Vehicle plate must be at least 3 characters long"),
    body("vehicle.capacity")
      .isInt({ min: 1 })
      .withMessage("Vehicle capacity must be a positive integer"),
    body("vehicle.vehicleType")
      .isIn(["car", "motorcycle", "autorickshaw"])
      .withMessage("Invalid vehicle type"),
  ],
  registerCaptain
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  loginCaptain
);

router.post("/logout", VerifyJWT, logoutCaptain);
router.get("/profile", VerifyJWT, captainProfile);

export { router };
