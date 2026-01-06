import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

// Backend API base URL - adjust based on your environment
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

/**
 * Custom Hook: useLocationSearch
 * Provides debounced location search functionality using Nominatim API
 *
 * Features:
 * - Debounced API calls (prevents excessive requests while typing)
 * - Loading and error states
 * - Caching of previous searches
 * - Auto-cleanup on unmount
 *
 * @param {number} debounceDelay - Delay in ms before making API call (default: 500ms)
 * @returns {Object} - { suggestions, isLoading, error, searchLocations, clearSuggestions }
 */
export const useLocationSearch = (debounceDelay = 500) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ref to store the timeout ID for cleanup
  const debounceTimerRef = useRef(null);
  // Ref to store the AbortController for canceling requests
  const abortControllerRef = useRef(null);
  // Cache for previous searches
  const cacheRef = useRef({});

  /**
   * Search for location suggestions
   * Implements debouncing to avoid excessive API calls
   *
   * @param {string} query - The search text
   * @param {string} token - JWT auth token
   */
  const searchLocations = useCallback(
    (query, token) => {
      // Clear any existing timeout
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Cancel any in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Clear suggestions if query is too short
      if (!query || query.trim().length < 2) {
        setSuggestions([]);
        setIsLoading(false);
        setError(null);
        return;
      }

      const trimmedQuery = query.trim().toLowerCase();

      // Check cache first
      if (cacheRef.current[trimmedQuery]) {
        setSuggestions(cacheRef.current[trimmedQuery]);
        setIsLoading(false);
        return;
      }

      // Show loading state immediately
      setIsLoading(true);
      setError(null);

      // Set up debounced API call
      debounceTimerRef.current = setTimeout(async () => {
        try {
          // Create new AbortController for this request
          abortControllerRef.current = new AbortController();

          const response = await axios.get(`${API_BASE_URL}/maps/suggestions`, {
            params: { query: query.trim() },
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: abortControllerRef.current.signal,
          });

          if (response.data.success) {
            // Cache the results
            cacheRef.current[trimmedQuery] = response.data.data;
            setSuggestions(response.data.data);
          } else {
            setSuggestions([]);
          }
        } catch (err) {
          // Ignore abort errors (they're intentional)
          if (err.name === "CanceledError" || err.name === "AbortError") {
            return;
          }

          console.error("Location search error:", err);
          setError(err.response?.data?.error || "Failed to fetch suggestions");
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }, debounceDelay);
    },
    [debounceDelay]
  );

  /**
   * Clear suggestions manually
   */
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    suggestions,
    isLoading,
    error,
    searchLocations,
    clearSuggestions,
  };
};

/**
 * Custom Hook: useCoordinates
 * Gets coordinates for a selected location/address
 *
 * @returns {Object} - { coordinates, isLoading, error, getCoordinates }
 */
export const useCoordinates = () => {
  const [coordinates, setCoordinates] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Get coordinates from address
   *
   * @param {string} address - The full address or location name
   * @param {string} token - JWT auth token
   * @returns {Promise<Object>} - { name, lat, lng }
   */
  const getCoordinates = useCallback(async (address, token) => {
    if (!address) {
      setError("Address is required");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/maps/coordinates`, {
        params: { address },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setCoordinates(response.data.data);
        return response.data.data;
      } else {
        throw new Error("Failed to get coordinates");
      }
    } catch (err) {
      console.error("Get coordinates error:", err);
      const errorMsg = err.response?.data?.error || "Failed to get coordinates";
      setError(errorMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    coordinates,
    isLoading,
    error,
    getCoordinates,
  };
};

/**
 * Custom Hook: useDistanceTime
 * Calculates distance and ETA between two points
 *
 * @returns {Object} - { distanceTime, isLoading, error, calculateDistanceTime }
 */
export const useDistanceTime = () => {
  const [distanceTime, setDistanceTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Calculate distance and time between pickup and drop
   *
   * @param {Object} pickup - { lat, lng }
   * @param {Object} drop - { lat, lng }
   * @param {string} token - JWT auth token
   * @returns {Promise<Object>} - { distance, duration, distanceText, durationText }
   */
  const calculateDistanceTime = useCallback(async (pickup, drop, token) => {
    if (!pickup?.lat || !pickup?.lng || !drop?.lat || !drop?.lng) {
      setError("Valid pickup and drop coordinates are required");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/maps/distance-time`, {
        params: {
          pickupLat: pickup.lat,
          pickupLng: pickup.lng,
          dropLat: drop.lat,
          dropLng: drop.lng,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setDistanceTime(response.data.data);
        return response.data.data;
      } else {
        throw new Error("Failed to calculate distance and time");
      }
    } catch (err) {
      console.error("Distance/time calculation error:", err);
      const errorMsg =
        err.response?.data?.error || "Failed to calculate distance and time";
      setError(errorMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Clear distance/time data
   */
  const clearDistanceTime = useCallback(() => {
    setDistanceTime(null);
    setError(null);
  }, []);

  return {
    distanceTime,
    isLoading,
    error,
    calculateDistanceTime,
    clearDistanceTime,
  };
};

/**
 * Combined Hook: useLocationServices
 * Combines all location service hooks for convenience
 *
 * @param {number} debounceDelay - Delay for search debouncing
 * @returns {Object} - All location service functions and states
 */
export const useLocationServices = (debounceDelay = 500) => {
  const locationSearch = useLocationSearch(debounceDelay);
  const coordinatesService = useCoordinates();
  const distanceTimeService = useDistanceTime();

  return {
    // Search functionality
    suggestions: locationSearch.suggestions,
    searchLoading: locationSearch.isLoading,
    searchError: locationSearch.error,
    searchLocations: locationSearch.searchLocations,
    clearSuggestions: locationSearch.clearSuggestions,

    // Coordinates functionality
    coordinates: coordinatesService.coordinates,
    coordinatesLoading: coordinatesService.isLoading,
    coordinatesError: coordinatesService.error,
    getCoordinates: coordinatesService.getCoordinates,

    // Distance/Time functionality
    distanceTime: distanceTimeService.distanceTime,
    distanceTimeLoading: distanceTimeService.isLoading,
    distanceTimeError: distanceTimeService.error,
    calculateDistanceTime: distanceTimeService.calculateDistanceTime,
    clearDistanceTime: distanceTimeService.clearDistanceTime,
  };
};

export default useLocationServices;
