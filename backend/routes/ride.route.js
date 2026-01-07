import express from "express";
import { body } from "express-validator";
import { VerifyJWT } from "../middlewares/auth.middleware.js";
import { createRideController } from "../controllers/ride.controller.js";

const router = express.Router();

router.post(
  "/create",
  VerifyJWT,
  body("pickup")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Pickup location is required"),
  body("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Destination is required"),
  createRideController
);
export { router };
