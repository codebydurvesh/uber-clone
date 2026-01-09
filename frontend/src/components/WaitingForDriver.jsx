import React from "react";

const WaitingForDriver = (props) => {
  const { ride } = props;

  // Get captain info from ride
  const captain = ride?.captain;
  const captainName = captain?.fullName
    ? `${captain.fullName.firstname} ${captain.fullName.lastname || ""}`
    : "Driver";
  const vehiclePlate = captain?.vehicle?.plate || "XX 00 XX 0000";
  const vehicleColor = captain?.vehicle?.color || "";
  const vehicleType = captain?.vehicle?.vehicleType || "car";

  // Get vehicle image based on type
  const getVehicleImage = () => {
    switch (vehicleType) {
      case "motorcycle":
        return "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8yYzdmYTE5NC1jOTU0LTQ5YjItOWM2ZC1hM2I4NjAxMzcwZjUucG5n";
      case "autorickshaw":
        return "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8xZGRiOGM1Ni0wMjA0LTRjZTQtODFjZS01NmExMWEwN2ZlOTgucG5n";
      default:
        return "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy85MDM0YzIwMC1jZTI5LTQ5ZjEtYmYzNS1lOWQyNTBlODIxN2EucG5n";
    }
  };

  return (
    <div>
      <h5
        onClick={() => props.setWaitingForDriverPanel(false)}
        className="p-1 text-center w-[93%] absolute top-0 left-1/2 transform -translate-x-1/2"
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-s-fill"></i>
      </h5>

      {/* OTP Display for User */}
      <div className="flex justify-between items-center mb-4">
        <img className="h-12" src={getVehicleImage()} alt="vehicle" />
        <div className="text-center">
          <p className="text-sm text-gray-600">Share OTP with driver</p>
          <h2 className="text-2xl font-bold tracking-widest bg-gray-100 px-4 py-2 rounded-lg">
            {ride?.otp || "------"}
          </h2>
        </div>
      </div>

      <div className="flex justify-between items-center p-4 bg-yellow-400 rounded-xl shadow-md">
        <div className="flex items-center gap-4">
          <img
            className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-sm"
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="driver"
          />
          <div>
            <h2 className="text-lg font-semibold capitalize">{captainName}</h2>
            <p className="text-sm text-gray-700 capitalize">
              {vehicleColor} {vehicleType}
            </p>
          </div>
        </div>
        <div className="text-right bg-yellow-300 px-3 py-2 rounded-lg">
          <h4 className="text-base font-bold uppercase tracking-wide">
            {vehiclePlate}
          </h4>
        </div>
      </div>

      <div className="flex flex-col gap-2 justify-between items-center mt-4">
        <div className="w-full mb-2">
          <div className="flex items-center gap-5 p-3 border-b-2 border-gray-300">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {ride?.pickup || "Loading..."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2 border-gray-300">
            <i className="text-lg ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Destination</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {ride?.destination || "Loading..."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="text-lg ri-money-rupee-circle-fill"></i>
            <div>
              <h3 className="text-lg font-medium">₹{ride?.fare || "0"}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash Payment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;
