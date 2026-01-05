import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

const ConfirmRidePopUp = (props) => {
  const [otp, setOtp] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-5">Confirm To Start Ride</h3>
      {/* <h5
        onClick={() => props.setConfirmRidePanel(false)}
        className="absolute right-6 top-6 text-2xl opacity-100"
      >
        <i className="ri-arrow-down-s-fill"></i>
      </h5> */}
      <div className="flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-3 border-gray-200 border-1">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_InUxO_6BhylxYbs67DY7-xF0TmEYPW4dQQ&s"
            alt="user-profile-png"
          />
          <h2 className="text-lg font-medium">Users-Name</h2>
        </div>
        <h5 className="text-lg font-semibold">2.2 KM</h5>
      </div>
      <div className="flex flex-col gap-2 justify-between items-center">
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

        <div className="mt-1 w-full items-center justify-center font-semibold">
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <input
              className="bg-[#eee] px-6 py-4 font-mono w-full rounded-lg mb-4"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
              }}
            />
            <Link
              to="/captain-riding"
              className="flex justify-center  bg-green-600 text-white rounded-lg p-3 w-full mb-1 border-white border-2 active:border-black"
              onClick={() => {
                props.setConfirmRidePopUpPanel(true);
                props.setRidePopUpPanel(false);
              }}
            >
              Confirm
            </Link>
            <button
              className="bg-red-500 text-white rounded-lg p-3 w-full mb-2 border-white border-2 active:border-black"
              onClick={() => props.setConfirmRidePopUpPanel(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRidePopUp;
