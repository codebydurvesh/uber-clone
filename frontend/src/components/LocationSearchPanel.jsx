import React from "react";
import "remixicon/fonts/remixicon.css";

/**
 * LocationSearchPanel Component
 * Displays location suggestions from the parent component
 *
 * Props:
 * - suggestions: Array of location objects from API
 * - isLoading: Boolean for loading state
 * - onSelectLocation: Callback when a location is selected
 * - activeField: 'pickup' or 'destination' - which field is being edited
 * - setVehiclePanel: Function to show vehicle selection panel
 * - setScroll: Function to control panel visibility
 */
const LocationSearchPanel = ({
  suggestions = [],
  isLoading = false,
  onSelectLocation,
  activeField,
  setVehiclePanel,
  setScroll,
}) => {
  /**
   * Handle location selection
   * Passes the selected location back to parent with coordinates
   */
  const handleLocationClick = (location) => {
    // Call parent callback with selected location data
    if (onSelectLocation) {
      onSelectLocation({
        name: location.name,
        lat: location.lat,
        lng: location.lng,
        field: activeField,
      });
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        <span className="ml-2 text-gray-600">Searching locations...</span>
      </div>
    );
  }

  // Show empty state when no suggestions
  if (suggestions.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <i className="ri-search-line text-2xl mb-2"></i>
        <p>Type to search for locations</p>
      </div>
    );
  }

  return (
    <div>
      {suggestions.map((location, index) => (
        <div
          key={location.placeId || index}
          onClick={() => handleLocationClick(location)}
          className="flex p-3 gap-3 bg-gray-100 hover:bg-gray-200 active:border-2 active:border-black rounded-xl items-center my-2 cursor-pointer transition-colors"
        >
          {/* Location icon */}
          <div className="bg-white h-10 w-10 flex items-center justify-center rounded-full shadow-sm">
            <i className="ri-map-pin-fill text-xl text-gray-700"></i>
          </div>

          {/* Location details */}
          <div className="flex-1 overflow-hidden">
            <h4 className="font-medium text-sm truncate">{location.name}</h4>
            {/* Show coordinates for debugging (can be removed in production) */}
            <p className="text-xs text-gray-500">
              {location.type && (
                <span className="capitalize">{location.type} • </span>
              )}
              {parseFloat(location.lat).toFixed(4)},{" "}
              {parseFloat(location.lng).toFixed(4)}
            </p>
          </div>

          {/* Arrow icon */}
          <i className="ri-arrow-right-s-line text-gray-400"></i>
        </div>
      ))}
    </div>
  );
};

export default LocationSearchPanel;
