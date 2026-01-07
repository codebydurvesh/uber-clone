import {
  getLocationSuggestions,
  getCoordinates,
  getDistanceAndTime,
} from "../services/maps.service.js";
import { validationResult, query } from "express-validator";

const getSuggestions = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { query } = req.query;

    // Get suggestions from service
    const suggestions = await getLocationSuggestions(query);

    return res.status(200).json({
      success: true,
      data: suggestions,
      count: suggestions.length,
    });
  } catch (error) {
    console.error("Controller error - getSuggestions:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch suggestions",
    });
  }
};

const getCoordinatesFromAddress = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { address } = req.query;

    // Get coordinates from service
    const coordinates = await getCoordinates(address);

    return res.status(200).json({
      success: true,
      data: coordinates,
    });
  } catch (error) {
    console.error("Controller error - getCoordinates:", error.message);

    // Handle "not found" error specifically
    if (error.message === "Location not found") {
      return res.status(404).json({
        success: false,
        error: "Location not found",
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message || "Failed to get coordinates",
    });
  }
};

const getDistanceTime = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { pickupLat, pickupLng, dropLat, dropLng } = req.query;

    // Prepare pickup and drop objects
    const pickup = {
      lat: pickupLat,
      lng: pickupLng,
    };

    const drop = {
      lat: dropLat,
      lng: dropLng,
    };

    // Get distance and time from service
    const result = await getDistanceAndTime(pickup, drop);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Controller error - getDistanceTime:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to calculate distance and time",
    });
  }
};

// Validation rules for each endpoint
const suggestionsValidation = [
  query("query")
    .notEmpty()
    .withMessage("Search query is required")
    .isLength({ min: 2 })
    .withMessage("Query must be at least 2 characters"),
];

const coordinatesValidation = [
  query("address")
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 3 })
    .withMessage("Address must be at least 3 characters"),
];

const distanceTimeValidation = [
  query("pickupLat")
    .notEmpty()
    .withMessage("Pickup latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid pickup latitude"),
  query("pickupLng")
    .notEmpty()
    .withMessage("Pickup longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid pickup longitude"),
  query("dropLat")
    .notEmpty()
    .withMessage("Drop latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid drop latitude"),
  query("dropLng")
    .notEmpty()
    .withMessage("Drop longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid drop longitude"),
];

export {
  getSuggestions,
  getCoordinatesFromAddress,
  getDistanceTime,
  suggestionsValidation,
  coordinatesValidation,
  distanceTimeValidation,
};
