import React from "react";
import "remixicon/fonts/remixicon.css";

const ConfirmRide = ({
  setConfirmRidePanel,
  setVehicleFound,
  selectedVehicle,
  pickup,
  destination,
  onConfirm,
  isLoading,
}) => {
  // Helper function to truncate long location names
  const truncateText = (text, maxLength = 40) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Extract short name from full location name
  const getShortName = (fullName) => {
    if (!fullName) return "";
    const parts = fullName.split(",");
    return parts[0].trim();
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-5">Confirm your Ride</h3>
      <h5
        onClick={() => setConfirmRidePanel(false)}
        className="absolute right-6 top-6 text-2xl opacity-100 cursor-pointer"
      >
        <i className="ri-arrow-down-s-fill"></i>
      </h5>
      <div className="flex flex-col gap-2 justify-between items-center">
        {/* Vehicle Image */}
        <img
          className="h-20"
          src={
            selectedVehicle?.image ||
            "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy85MDM0YzIwMC1jZTI5LTQ5ZjEtYmYzNS1lOWQyNTBlODIxN2EucG5n"
          }
          alt={selectedVehicle?.name || "Vehicle"}
        />

        {/* Vehicle Info Badge */}
        {selectedVehicle && (
          <div className="bg-gray-100 px-4 py-1 rounded-full mb-2">
            <span className="font-medium">{selectedVehicle.name}</span>
            <span className="ml-2 text-gray-600">
              <i className="ri-user-fill"></i> {selectedVehicle.capacity}
            </span>
          </div>
        )}

        <div className="w-full mb-2">
          {/* Pickup Location */}
          <div className="flex items-center gap-5 p-3 border-b-2 border-gray-300">
            <i className="text-lg ri-map-pin-2-fill text-green-600"></i>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium">Pickup</h3>
              <p
                className="text-sm -mt-1 text-gray-600 truncate"
                title={pickup?.name}
              >
                {truncateText(pickup?.name) || "Pickup location"}
              </p>
            </div>
          </div>

          {/* Destination Location */}
          <div className="flex items-center gap-5 p-3 border-b-2 border-gray-300">
            <i className="text-lg ri-map-pin-user-fill text-red-600"></i>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium">Destination</h3>
              <p
                className="text-sm -mt-1 text-gray-600 truncate"
                title={destination?.name}
              >
                {truncateText(destination?.name) || "Destination location"}
              </p>
            </div>
          </div>

          {/* Fare */}
          <div className="flex items-center gap-5 p-3">
            <i className="text-lg ri-money-rupee-circle-fill text-yellow-600"></i>
            <div>
              <h3 className="text-lg font-medium">
                ₹{selectedVehicle?.fare || "--"}
              </h3>
              <p className="text-sm -mt-1 text-gray-600">
                {selectedVehicle?.description || "Cash payment"}
              </p>
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={`w-full flex items-center justify-center p-3 rounded-lg text-white font-semibold transition-colors ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 cursor-pointer"
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creating Ride...
            </>
          ) : (
            "Confirm"
          )}
        </button>
      </div>
    </div>
  );
};

export default ConfirmRide;
