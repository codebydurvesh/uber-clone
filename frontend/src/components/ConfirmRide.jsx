import React from "react";
import "remixicon/fonts/remixicon.css";

const ConfirmRide = (props) => {
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-5">Confirm your Ride</h3>
      <h5
        onClick={() => props.setConfirmRidePanel(false)}
        className="absolute right-6 top-6 text-2xl opacity-100"
      >
        <i className="ri-arrow-down-s-fill"></i>
      </h5>
      <div className="flex flex-col gap-2 justify-between items-center">
        <img
          className="h-20"
          src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy85MDM0YzIwMC1jZTI5LTQ5ZjEtYmYzNS1lOWQyNTBlODIxN2EucG5n"
          alt="Uber-car-logo"
        />
        <div className="w-full mb-2">
          <div className="flex items-center gap-5 p-3 border-b-2 border-gray-300">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm -mt-1 text-gray-600">
                Kankariya Talab, Bhopal
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2 border-gray-300">
            <i className="text-lg ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm -mt-1 text-gray-600">
                Kankariya Talab, Bhopal
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="text-lg ri-money-rupee-circle-fill"></i>
            <div>
              <h3 className="text-lg font-medium">₹193.20</h3>
              <p className="text-sm -mt-1 text-gray-600">
                Kankariya Talab, Bhopal
              </p>
            </div>
          </div>
        </div>
        <div className="w-full bg-green-600 flex items-center justify-center p-2 rounded-lg text-white font-semibold">
          <button
            onClick={() => {
              props.setVehicleFound(true);
              props.setConfirmRidePanel(false);
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRide;
