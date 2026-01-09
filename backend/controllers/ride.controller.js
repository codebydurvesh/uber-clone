import { createRide } from "../services/ride.service.js";
import { validationResult } from "express-validator";
import { broadcastNewRide, sendMessageToSocketId } from "../socket.js";
import { Ride } from "../models/ride.model.js";
import { Captain } from "../models/captain.model.js";
import { User } from "../models/user.model.js";

const createRideController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { pickup, destination, vehicleType, pickupCoords, destinationCoords } =
    req.body;
  try {
    const ride = await createRide(
      req.user._id,
      pickup,
      destination,
      vehicleType,
      pickupCoords,
      destinationCoords
    );

    // Populate user details for the ride
    const rideWithUser = await Ride.findById(ride._id).populate("user");

    // Broadcast ride to all active captains
    broadcastNewRide(rideWithUser);

    return res.status(201).json(ride);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const acceptRideController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    // Find the ride and check if it's still pending
    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    if (ride.status !== "pending") {
      return res.status(400).json({ error: "Ride is no longer available" });
    }

    // Update ride with captain and change status to accepted
    ride.captain = req.captain._id;
    ride.status = "accepted";
    await ride.save();

    // Get the updated ride with populated captain and user, including OTP
    const updatedRide = await Ride.findById(rideId)
      .populate("captain")
      .populate("user")
      .select("+otp");

    // Notify the user that their ride has been accepted (include OTP for user)
    if (updatedRide.user.socketId) {
      sendMessageToSocketId(updatedRide.user.socketId, {
        event: "ride-accepted",
        data: updatedRide,
      });
    }

    // Return ride without OTP to captain
    const rideForCaptain = updatedRide.toObject();
    delete rideForCaptain.otp;
    return res.status(200).json(rideForCaptain);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const startRideController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, otp } = req.body;

  try {
    // Find the ride with OTP
    const ride = await Ride.findById(rideId)
      .populate("captain")
      .populate("user")
      .select("+otp");

    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    if (ride.status !== "accepted") {
      return res.status(400).json({ error: "Ride is not in accepted state" });
    }

    // Verify OTP
    if (ride.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Update ride status to ongoing
    ride.status = "ongoing";
    await ride.save();

    // Notify user that ride has started
    if (ride.user.socketId) {
      sendMessageToSocketId(ride.user.socketId, {
        event: "ride-started",
        data: ride,
      });
    }

    return res.status(200).json(ride);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const endRideController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await Ride.findById(rideId)
      .populate("captain")
      .populate("user");

    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    if (ride.status !== "ongoing") {
      return res.status(400).json({ error: "Ride is not ongoing" });
    }

    // Verify the captain is the one ending the ride
    if (ride.captain._id.toString() !== req.captain._id.toString()) {
      return res.status(403).json({ error: "Unauthorized to end this ride" });
    }

    // Update ride status to completed
    ride.status = "completed";
    await ride.save();

    // Update captain's statistics
    const fareAmount = parseFloat(ride.fare) || 0;
    // Extract distance number from string like "2.8 km"
    const distanceStr = ride.distance || "0";
    const distanceAmount = parseFloat(distanceStr.replace(/[^0-9.]/g, "")) || 0;

    await Captain.findByIdAndUpdate(ride.captain._id, {
      $inc: {
        totalEarnings: fareAmount,
        totalRides: 1,
        totalDistance: distanceAmount,
      },
    });

    // Get updated captain data
    const updatedCaptain = await Captain.findById(ride.captain._id);

    // Notify user that ride has ended
    if (ride.user.socketId) {
      sendMessageToSocketId(ride.user.socketId, {
        event: "ride-ended",
        data: ride,
      });
    }

    return res.status(200).json({ ride, captain: updatedCaptain });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const cancelRideController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;
  const CANCELLATION_FINE = 20;

  try {
    const ride = await Ride.findById(rideId)
      .populate("captain")
      .populate("user");

    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    if (ride.status !== "accepted") {
      return res
        .status(400)
        .json({ error: "Ride cannot be cancelled at this stage" });
    }

    // Verify the captain is the one cancelling the ride
    if (ride.captain._id.toString() !== req.captain._id.toString()) {
      return res
        .status(403)
        .json({ error: "Unauthorized to cancel this ride" });
    }

    // Update ride status to cancelled
    ride.status = "cancelled";
    ride.captain = null;
    await ride.save();

    // Deduct fine from captain's earnings
    await Captain.findByIdAndUpdate(req.captain._id, {
      $inc: {
        totalEarnings: -CANCELLATION_FINE,
      },
    });

    // Get updated captain data
    const updatedCaptain = await Captain.findById(req.captain._id);

    // Notify user that ride was cancelled
    if (ride.user.socketId) {
      sendMessageToSocketId(ride.user.socketId, {
        event: "ride-cancelled",
        data: { ride, message: "Captain cancelled the ride" },
      });
    }

    return res.status(200).json({
      message: "Ride cancelled successfully",
      fine: CANCELLATION_FINE,
      captain: updatedCaptain,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export {
  createRideController,
  acceptRideController,
  startRideController,
  endRideController,
  cancelRideController,
};
