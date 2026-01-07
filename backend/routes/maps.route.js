import { Router } from "express";
import {
  getSuggestions,
  getCoordinatesFromAddress,
  getDistanceTime,
  suggestionsValidation,
  coordinatesValidation,
  distanceTimeValidation,
} from "../controllers/maps.controller.js";
import { VerifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.get("/suggestions", VerifyJWT, suggestionsValidation, getSuggestions);



router.get(
  "/coordinates",
  VerifyJWT,
  coordinatesValidation,
  getCoordinatesFromAddress
);


router.get("/distance-time", VerifyJWT, distanceTimeValidation, getDistanceTime);

export { router };
