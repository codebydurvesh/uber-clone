import React, { useContext } from "react";
import "remixicon/fonts/remixicon.css";
import { CaptainDataContext } from "../context/CaptainContext.jsx";

const CaptainDetails = () => {
  const { captain } = useContext(CaptainDataContext);

  const captainName = captain?.fullName
    ? `${captain.fullName.firstname} ${captain.fullName.lastname || ""}`
    : "Captain";

  // Get statistics from captain data
  const totalEarnings = captain?.totalEarnings || 0;
  const totalRides = captain?.totalRides || 0;
  const totalDistance = captain?.totalDistance || 0;
  const hoursOnline = captain?.hoursOnline || 0;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start gap-3">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="captain-profile-image"
          />
          <h4 className="text-lg font-medium capitalize">{captainName}</h4>
        </div>
        <div>
          <h4 className="text-xl font-semibold">₹{totalEarnings.toFixed(2)}</h4>
          <p className="text-sm text-gray-600">Earned</p>
        </div>
      </div>
      <div className="flex mt-6 p-3 bg-gray-100 rounded-xl justify-center gap-5 items-start">
        <div className="text-center">
          <i className="text-3xl mb-2 font-thin ri-taxi-line"></i>
          <h5 className="text-lg font-medium">{totalRides}</h5>
          <p className="text-sm text-gray-600">Total Rides</p>
        </div>
        <div className="text-center">
          <i className="text-3xl mb-2 font-thin ri-route-line"></i>
          <h5 className="text-lg font-medium">{totalDistance.toFixed(1)}</h5>
          <p className="text-sm text-gray-600">KM Traveled</p>
        </div>
        <div className="text-center">
          <i className="text-3xl mb-2 font-thin ri-timer-2-line"></i>
          <h5 className="text-lg font-medium">{hoursOnline.toFixed(1)}</h5>
          <p className="text-sm text-gray-600">Hours Online</p>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails;
