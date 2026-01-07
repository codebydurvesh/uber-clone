import { createRide } from "../services/ride.service.js";
import { validationResult } from "express-validator";

const createRideController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { pickup, destination, vehicleType } = req.body;
  try {
    const ride = await createRide(
      req.user._id, // Pass just the ObjectId, not { user: id }
      pickup,
      destination,
      vehicleType
    );
    return res.status(201).json(ride);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export { createRideController };
