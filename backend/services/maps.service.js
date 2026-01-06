import axios from "axios";

/**
 * Maps Service
 * Uses OpenStreetMap-based services (Nominatim & OpenRouteService)
 * for location search, geocoding, and routing
 */

// Nominatim API base URL (OSM geocoding service)
const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";

// OpenRouteService API base URL (for routing/directions)
const ORS_BASE_URL = "https://api.openrouteservice.org";

/**
 * Feature 1: Get Location Suggestions (Auto-complete)
 * Uses Nominatim search API for address/location suggestions
 *
 * @param {string} query - The search query (partial address or location name)
 * @returns {Promise<Array>} - Array of location suggestions with name, lat, lng
 *
 * Example Response:
 * [
 *   { name: "Mumbai, Maharashtra, India", lat: "19.0759837", lng: "72.8776559" },
 *   { name: "Mumbai Airport, Mumbai, India", lat: "19.0896", lng: "72.8656" }
 * ]
 */
const getLocationSuggestions = async (query) => {
  try {
    // Validate input
    if (!query || query.trim().length < 2) {
      return [];
    }

    // Make request to Nominatim search API
    // Note: Nominatim requires proper headers and has rate limits (1 req/sec)
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

/**
 * Feature 2: Get Coordinates from Location Name (Forward Geocoding)
 * Converts an address/location name into latitude and longitude
 *
 * @param {string} address - The full address or location name
 * @returns {Promise<Object>} - Object containing lat, lng, and formatted address
 *
 * Example Request: "Bandra Station, Mumbai"
 * Example Response:
 * {
 *   name: "Bandra Railway Station, Mumbai, Maharashtra, India",
 *   lat: "19.0544",
 *   lng: "72.8402"
 * }
 */
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

/**
 * Feature 3: Get Distance and Estimated Time Between Two Points
 * Uses OpenRouteService Directions API for routing calculations
 *
 * @param {Object} pickup - Pickup location { lat, lng }
 * @param {Object} drop - Drop/destination location { lat, lng }
 * @returns {Promise<Object>} - Object containing distance (km) and duration (minutes)
 *
 * Example Request:
 * pickup: { lat: "19.0544", lng: "72.8402" }  // Bandra Station
 * drop: { lat: "19.0176", lng: "72.8562" }    // CST Station
 *
 * Example Response:
 * {
 *   distance: 12.5,      // Distance in kilometers
 *   duration: 35,        // Duration in minutes
 *   distanceText: "12.5 km",
 *   durationText: "35 mins"
 * }
 */
const getDistanceAndTime = async (pickup, drop) => {
  try {
    // Validate inputs
    if (!pickup || !pickup.lat || !pickup.lng) {
      throw new Error("Valid pickup coordinates are required");
    }
    if (!drop || !drop.lat || !drop.lng) {
      throw new Error("Valid drop coordinates are required");
    }

    // Get API key from environment variables
    const apiKey = process.env.OPENROUTESERVICE_API_KEY;
    if (!apiKey) {
      throw new Error("OpenRouteService API key is not configured");
    }

    // OpenRouteService expects coordinates as [longitude, latitude]
    const coordinates = [
      [parseFloat(pickup.lng), parseFloat(pickup.lat)],
      [parseFloat(drop.lng), parseFloat(drop.lat)],
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

/**
 * Alternative: Get Distance and Time using GET request
 * Some developers prefer GET requests for simpler integration
 */
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
