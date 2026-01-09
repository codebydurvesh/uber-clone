import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import { CaptainDataContext } from "../context/CaptainContext.jsx";

const FinishRide = ({ rideData, setFinishRidePanel }) => {
  const navigate = useNavigate();
  const { setCaptain } = useContext(CaptainDataContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const handleFinishRide = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/end`,
        { rideId: rideData._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("captain-token")}`,
          },
        }
      );

      if (response.status === 200) {
        // Update captain context with new statistics
        if (response.data.captain) {
          setCaptain(response.data.captain);
        }
        setShowSuccessPopup(true);
      }
    } catch (error) {
      console.error("Error finishing ride:", error);
      setShowErrorPopup(true);
      setIsLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessPopup(false);
    navigate("/captain-home");
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-5">Finish this Ride</h3>
      <div className="flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-3 border-gray-200 border-1">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_InUxO_6BhylxYbs67DY7-xF0TmEYPW4dQQ&s"
            alt="user-profile-png"
          />
          <h2 className="text-lg font-medium capitalize">
            {rideData?.user?.fullName?.firstname || "User"}{" "}
            {rideData?.user?.fullName?.lastname || ""}
          </h2>
        </div>
        <h5 className="text-lg font-semibold">{rideData?.distance || "N/A"}</h5>
      </div>
      <div className="flex flex-col gap-2 justify-between items-center">
        <div className="w-full mb-2">
          <div className="flex items-center gap-5 p-3 border-b-2 border-gray-300">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {rideData?.pickup || "Pickup location"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2 border-gray-300">
            <i className="text-lg ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">Destination</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {rideData?.destination || "Destination location"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="text-lg ri-money-rupee-circle-fill"></i>
            <div>
              <h3 className="text-lg font-medium">₹{rideData?.fare || "0"}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash Payment</p>
            </div>
          </div>
        </div>

        <div className="mt-1 w-full items-center justify-center font-semibold">
          <p className="text-red-500 text-xs mb-1">
            {"( "}Click on finish ride button if you have received payment{" )"}
          </p>
          <button
            onClick={handleFinishRide}
            disabled={isLoading}
            className="flex justify-center bg-green-600 text-white rounded-lg p-3 w-full mb-1 border-white border-2 active:border-black disabled:bg-gray-400"
          >
            {isLoading ? "Finishing Ride..." : "Finish Ride"}
          </button>
          <button
            className="bg-gray-300 text-gray-700 rounded-lg p-3 w-full mb-2 border-white border-2 active:border-black"
            onClick={() => setFinishRidePanel(false)}
            disabled={isLoading}
          >
            Not finished yet
          </button>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-end justify-center z-[3000]">
          <div className="bg-white rounded-t-2xl p-8 w-full max-w-md text-center shadow-2xl border-t border-gray-200">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-checkbox-circle-fill text-5xl text-green-500"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Ride Completed!
            </h2>
            <p className="text-gray-600 mb-4">Thank you for driving with us.</p>

            <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-lg p-4 mb-6">
              <p className="text-sm text-white opacity-90">You Earned</p>
              <p className="text-4xl font-bold text-white">
                ₹{rideData?.fare || "0"}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-yellow-500 mb-6">
              <i className="ri-star-fill"></i>
              <i className="ri-star-fill"></i>
              <i className="ri-star-fill"></i>
              <i className="ri-star-fill"></i>
              <i className="ri-star-half-fill"></i>
              <span className="text-gray-600 ml-2">Great job!</span>
            </div>

            <button
              onClick={handleSuccessClose}
              className="w-full p-4 bg-black text-white rounded-lg font-semibold text-lg"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showErrorPopup && (
        <div className="fixed inset-0 flex items-end justify-center z-[3000]">
          <div className="bg-white rounded-t-2xl p-8 w-full max-w-md text-center shadow-2xl border-t border-gray-200">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-error-warning-fill text-5xl text-red-500"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
            <p className="text-gray-600 mb-6">
              Something went wrong while finishing the ride. Please try again.
            </p>

            <button
              onClick={() => setShowErrorPopup(false)}
              className="w-full p-4 bg-black text-white rounded-lg font-semibold text-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinishRide;
