import React from "react";
import "remixicon/fonts/remixicon.css";

const RidePopUp = (props) => {
  const { ride, onAccept, onIgnore } = props;

  if (!ride) return null;

  const userName = ride.user?.fullName
    ? `${ride.user.fullName.firstname} ${ride.user.fullName.lastname || ""}`
    : "User";

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-5">New Ride Available!</h3>
      <div className="flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-3 border-gray-200 border-1">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_InUxO_6BhylxYbs67DY7-xF0TmEYPW4dQQ&s"
            alt="user-profile-png"
          />
          <h2 className="text-lg font-medium">{userName}</h2>
        </div>
        <h5 className="text-lg font-semibold">{ride.distance || "N/A"}</h5>
      </div>
      <div className="flex flex-col gap-2 justify-between items-center">
        <div className="w-full mb-2">
          <div className="flex items-center gap-5 p-3 border-b-2 border-gray-300">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup</h3>
              <p className="text-sm -mt-1 text-gray-600">{ride.pickup}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2 border-gray-300">
            <i className="text-lg ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Destination</h3>
              <p className="text-sm -mt-1 text-gray-600">{ride.destination}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="text-lg ri-money-rupee-circle-fill"></i>
            <div>
              <h3 className="text-lg font-medium">₹{ride.fare}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash Payment</p>
            </div>
          </div>
        </div>
        <div className="mt-1 w-full items-center justify-center font-semibold">
          <button
            className="flex justify-center bg-green-600 text-white rounded-lg p-2 w-full mb-1 border-white border-2 active:border-black"
            onClick={onAccept}
          >
            Accept
          </button>
          <button
            className="bg-gray-300 text-gray-700 rounded-lg p-2 w-full mb-2 border-white border-2 active:border-black"
            onClick={onIgnore}
          >
            Ignore
          </button>
        </div>
      </div>
    </div>
  );
};

export default RidePopUp;
