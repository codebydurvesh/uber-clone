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

/**
 * Maps Routes
 * All routes require authentication (VerifyJWT middleware)
 *
 * Base URL: /maps
 */

/**
 * @route   GET /maps/suggestions
 * @desc    Get location suggestions for auto-complete
 * @access  Private (requires authentication)
 * @query   query - Search text (min 2 characters)
 *
 * Example Request:
 * GET /maps/suggestions?query=bandra station
 *
 * Example Response:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "name": "Bandra Railway Station, Mumbai, Maharashtra, India",
 *       "lat": "19.0544",
 *       "lng": "72.8402",
 *       "placeId": 12345,
 *       "type": "station"
 *     }
 *   ],
 *   "count": 1
 * }
 */
router.get("/suggestions", VerifyJWT, suggestionsValidation, getSuggestions);

/**
 * @route   GET /maps/coordinates
 * @desc    Get coordinates (lat/lng) from address (forward geocoding)
 * @access  Private (requires authentication)
 * @query   address - Full address or location name
 *
 * Example Request:
 * GET /maps/coordinates?address=Bandra Station, Mumbai
 *
 * Example Response:
 * {
 *   "success": true,
 *   "data": {
 *     "name": "Bandra Railway Station, Mumbai, Maharashtra, 400050, India",
 *     "lat": "19.0544",
 *     "lng": "72.8402",
 *     "boundingBox": ["19.0534", "19.0554", "72.8392", "72.8412"]
 *   }
 * }
 */
router.get(
  "/coordinates",
  VerifyJWT,
  coordinatesValidation,
  getCoordinatesFromAddress
);

/**
 * @route   GET /maps/distance-time
 * @desc    Calculate distance and ETA between pickup and drop points
 * @access  Private (requires authentication)
 * @query   pickupLat, pickupLng, dropLat, dropLng - Coordinates
 *
 * Example Request:
 * GET /maps/distance-time?pickupLat=19.0544&pickupLng=72.8402&dropLat=19.0176&dropLng=72.8562
 *
 * Example Response:
 * {
 *   "success": true,
 *   "data": {
 *     "distance": 12.5,
 *     "duration": 35,
 *     "distanceText": "12.5 km",
 *     "durationText": "35 mins"
 *   }
 * }
 */
router.get("/distance-time", VerifyJWT, distanceTimeValidation, getDistanceTime);

export { router };
