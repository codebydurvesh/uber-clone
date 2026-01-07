import axios from "axios";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";

const ORS_BASE_URL = "https://api.openrouteservice.org";

const getLocationSuggestions = async (query) => {
  try {
    if (!query || query.trim().length < 2) {
      return [];
    }
    const response = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
      params: {
        q: query, // Search query
        format: "json", // Response format
        addressdetails: 1, // Include address breakdown
        limit: 5, // Limit results to 5 suggestions
        countrycodes: "in", // Restrict to India (remove for global search)
      },
      headers: {
        // Required: Nominatim requires a valid User-Agent with contact info
        "User-Agent": "UberCloneApp/1.0",
        Accept: "application/json",
        "Accept-Language": "en",
      },
      timeout: 10000, // 10 second timeout
    });

    console.log(
      "Nominatim response:",
      response.status,
      response.data?.length || 0,
      "results"
    );

    // Transform response to required format
    const suggestions = response.data.map((place) => ({
      name: place.display_name,
      lat: place.lat,
      lng: place.lon,
      // Additional details if needed
      placeId: place.place_id,
      type: place.type,
    }));

    return suggestions;
  } catch (error) {
    console.error("Error fetching location suggestions:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    throw new Error(
      error.response?.data?.error?.message ||
        "Failed to fetch location suggestions"
    );
  }
};

const getCoordinates = async (address) => {
  try {
    // Validate input
    if (!address || address.trim().length === 0) {
      throw new Error("Address is required");
    }

    // Make request to Nominatim search API
    const response = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
      params: {
        q: address, // Full address to geocode
        format: "json", // Response format
        addressdetails: 1, // Include address breakdown
        limit: 1, // Get only the best match
      },
      headers: {
        "User-Agent": "UberCloneApp/1.0",
        Accept: "application/json",
        "Accept-Language": "en",
      },
      timeout: 10000, // 10 second timeout
    });

    console.log("Nominatim coordinates response:", response.status);

    // Check if location was found
    if (!response.data || response.data.length === 0) {
      throw new Error("Location not found");
    }

    const place = response.data[0];

    return {
      name: place.display_name,
      lat: place.lat,
      lng: place.lon,
      boundingBox: place.boundingbox,
    };
  } catch (error) {
    console.error("Error getting coordinates:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    throw new Error(
      error.response?.data?.error?.message ||
        error.message ||
        "Failed to get coordinates"
    );
  }
};

const getDistanceAndTime = async (pickup, destination) => {
  try {
    // Validate inputs
    if (!pickup || !pickup.lat || !pickup.lng) {
      throw new Error("Valid pickup coordinates are required");
    }
    if (!destination || !destination.lat || !destination.lng) {
      throw new Error("Valid destination coordinates are required");
    }

    // Get API key from environment variables
    const apiKey = process.env.OPENROUTESERVICE_API_KEY;
    if (!apiKey) {
      throw new Error("OpenRouteService API key is not configured");
    }

    // OpenRouteService expects coordinates as [longitude, latitude]
    const coordinates = [
      [parseFloat(pickup.lng), parseFloat(pickup.lat)],
      [parseFloat(destination.lng), parseFloat(destination.lat)],
    ];

    // Make request to OpenRouteService Directions API
    const response = await axios.post(
      `${ORS_BASE_URL}/v2/directions/driving-car`,
      {
        coordinates: coordinates,
      },
      {
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    // Extract route summary from response
    const route = response.data.routes[0];
    const summary = route.summary;

    // Distance is returned in meters, convert to kilometers
    const distanceKm = (summary.distance / 1000).toFixed(2);

    // Duration is returned in seconds, convert to minutes
    const durationMins = Math.round(summary.duration / 60);

    return {
      distance: parseFloat(distanceKm),
      duration: durationMins,
      distanceText: `${distanceKm} km`,
      durationText: `${durationMins} mins`,
      // Additional route details if needed
      bounds: route.bbox,
    };
  } catch (error) {
    console.error("Error getting distance and time:", error.message);

    // Handle specific OpenRouteService errors
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error.message);
    }

    throw new Error(error.message || "Failed to calculate distance and time");
  }
};

const getDistanceAndTimeAlt = async (
  pickupLat,
  pickupLng,
  dropLat,
  dropLng
) => {
  try {
    const apiKey = process.env.OPENROUTESERVICE_API_KEY;
    if (!apiKey) {
      throw new Error("OpenRouteService API key is not configured");
    }

    // GET request format for OpenRouteService
    const response = await axios.get(
      `${ORS_BASE_URL}/v2/directions/driving-car`,
      {
        params: {
          start: `${pickupLng},${pickupLat}`,
          end: `${dropLng},${dropLat}`,
        },
        headers: {
          Authorization: apiKey,
        },
      }
    );

    const feature = response.data.features[0];
    const properties = feature.properties.summary;

    const distanceKm = (properties.distance / 1000).toFixed(2);
    const durationMins = Math.round(properties.duration / 60);

    return {
      distance: parseFloat(distanceKm),
      duration: durationMins,
      distanceText: `${distanceKm} km`,
      durationText: `${durationMins} mins`,
    };
  } catch (error) {
    console.error("Error getting distance and time (alt):", error.message);
    throw new Error("Failed to calculate distance and time");
  }
};

export {
  getLocationSuggestions,
  getCoordinates,
  getDistanceAndTime,
  getDistanceAndTimeAlt,
};
