import { Ride } from "../models/ride.model.js";
import { getDistanceAndTime, getCoordinates } from "./maps.service.js";
import crypto from "crypto";

async function getFare(pickup, destination) {
  if (!pickup || !destination) {
    throw new Error(
      "Pickup and destination coordinates are required to calculate fare."
    );
  }

  // Convert to coordinates if strings are passed
  let pickupCoords = pickup;
  let destinationCoords = destination;

  if (typeof pickup === "string") {
    pickupCoords = await getCoordinates(pickup);
  }
  if (typeof destination === "string") {
    destinationCoords = await getCoordinates(destination);
  }

  const distanceTime = await getDistanceAndTime(
    pickupCoords,
    destinationCoords
  );
  const baseFare = {
    autorickshaw: 30,
    car: 50,
    motorcycle: 20,
  };

  const perKmRate = {
    autorickshaw: 12,
    car: 18,
    motorcycle: 8,
  };

  const perMinuteRate = {
    autorickshaw: 1,
    car: 2,
    motorcycle: 0.5,
  };

  const distanceInKm = distanceTime.distance;
  const timeInMinutes = distanceTime.duration;

  const fare = {
    autorickshaw: Math.round(
      baseFare.autorickshaw +
        perKmRate.autorickshaw * distanceInKm +
        perMinuteRate.autorickshaw * timeInMinutes
    ),
    car: Math.round(
      baseFare.car +
        perKmRate.car * distanceInKm +
        perMinuteRate.car * timeInMinutes
    ),
    motorcycle: Math.round(
      baseFare.motorcycle +
        perKmRate.motorcycle * distanceInKm +
        perMinuteRate.motorcycle * timeInMinutes
    ),
  };

  return fare;
}

function getOtp(num) {
  function generateOtp() {
    const otp = crypto
      .randomInt(Math.pow(10, num - 1), Math.pow(10, num))
      .toString();
    return otp;
  }
  return generateOtp();
}
const createRide = async (userId, pickup, destination, vehicleType) => {
  if (!userId || !pickup || !destination || !vehicleType) {
    throw new Error("All parameters are required to create a ride.");
  }

  const fare = await getFare(pickup, destination);

  const ride = new Ride({
    user: userId,
    pickup,
    destination,
    vehicleType,
    fare: fare[vehicleType],
    otp: getOtp(6),
  });

  await ride.save();
  return ride;
};

export { createRide, getFare, getOtp };
