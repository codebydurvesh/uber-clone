import React from "react";

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
      <div className="flex flex-col justify-between items-center">
        <img
          src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy85MDM0YzIwMC1jZTI5LTQ5ZjEtYmYzNS1lOWQyNTBlODIxN2EucG5n"
          alt="Uber-car-logo"
        />
        <div className="w-full">
          <div>start from 5:26:55 in the video </div>
          <div></div>
          <div></div>
        </div>
        <div className="w-full bg-green-400 flex items-center justify-center p-2 rounded-lg text-white font-semibold">
          <button>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRide;
