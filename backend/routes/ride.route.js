import express from "express";
import { body } from "express-validator";
import { VerifyJWT, VerifyCaptainJWT } from "../middlewares/auth.middleware.js";
import {
  createRideController,
  acceptRideController,
  startRideController,
  endRideController,
  cancelRideController,
} from "../controllers/ride.controller.js";

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
  body("vehicleType")
    .isString()
    .isIn(["car", "motorcycle", "autorickshaw"])
    .withMessage("Invalid vehicle type"),
  body("pickupCoords.lat")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid pickup latitude"),
  body("pickupCoords.lng")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid pickup longitude"),
  body("destinationCoords.lat")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid destination latitude"),
  body("destinationCoords.lng")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid destination longitude"),
  createRideController
);

router.post(
  "/accept",
  VerifyCaptainJWT,
  body("rideId").isMongoId().withMessage("Invalid ride ID"),
  acceptRideController
);

router.post(
  "/start",
  VerifyCaptainJWT,
  body("rideId").isMongoId().withMessage("Invalid ride ID"),
  body("otp")
    .isString()
    .isLength({ min: 6, max: 6 })
    .withMessage("Invalid OTP"),
  startRideController
);

router.post(
  "/end",
  VerifyCaptainJWT,
  body("rideId").isMongoId().withMessage("Invalid ride ID"),
  endRideController
);

router.post(
  "/cancel",
  VerifyCaptainJWT,
  body("rideId").isMongoId().withMessage("Invalid ride ID"),
  cancelRideController
);

export { router };
