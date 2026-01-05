import React from "react";
import { Link } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

const CaptainHome = () => {
  return (
    <div className="h-screen flex flex-col">
      <Link
        to="/captain/logout"
        className="fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full"
      >
        <i className="text-lg font-medium ri-logout-box-r-line"></i>
      </Link>
      <div className="flex-grow">
        {/* Sample Uber Map Image */}
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1100/format:webp/0*gwMx05pqII5hbfmX.gif"
          alt="uber-sample-map"
        />
      </div>

      <div className="h-2/5 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start gap-3">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="captain-profile-image"
            />
            <h4 className="text-lg font-medium">Harsh Patel</h4>
          </div>
          <div>
            <h4 className="text-xl font-semibold">₹295.20</h4>
            <p className="text-sm text-gray-600">Earned</p>
          </div>
        </div>
        <div className="flex mt-6 p-3 bg-gray-100 rounded-xl justify-center gap-5 items-start">
          <div className="text-center">
            <i className="text-3xl mb-2 font-thin ri-timer-2-line"></i>
            <h5 className="text-lg font-medium">10.2</h5>
            <p className="text-sm text-gray-600">Hours Online</p>
          </div>
          <div className="text-center">
            <i className="text-3xl mb-2 font-thin ri-speed-up-line"></i>
            <h5 className="text-lg font-medium">10.2</h5>
            <p className="text-sm text-gray-600">Hours Online</p>
          </div>
          <div className="text-center">
            <i className="text-3xl mb-2 font-thin ri-booklet-line"></i>
            <h5 className="text-lg font-medium">10.2</h5>
            <p className="text-sm text-gray-600">Hours Online</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptainHome;
