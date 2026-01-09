import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import { CaptainDataContext } from "../context/CaptainContext.jsx";

const ConfirmRidePopUp = (props) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCancelWarning, setShowCancelWarning] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const navigate = useNavigate();
  const { ride } = props;
  const { setCaptain } = useContext(CaptainDataContext);

  const userName = ride?.user?.fullName
    ? `${ride.user.fullName.firstname} ${ride.user.fullName.lastname || ""}`
    : "User";

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("captain-token");
      const API_BASE_URL =
        import.meta.env.VITE_BASE_URL || "http://localhost:3000";

      const response = await axios.post(
        `${API_BASE_URL}/rides/start`,
        { rideId: ride._id, otp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Navigate to captain riding page with ride data
      navigate("/captain-riding", { state: { ride: response.data } });
    } catch (err) {
      console.error("Error starting ride:", err);
      setError(err.response?.data?.error || "Failed to start ride");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    setShowCancelWarning(true);
  };

  const handleConfirmCancel = async () => {
    setCancelLoading(true);
    try {
      const token = localStorage.getItem("captain-token");
      const API_BASE_URL =
        import.meta.env.VITE_BASE_URL || "http://localhost:3000";

      const response = await axios.post(
        `${API_BASE_URL}/rides/cancel`,
        { rideId: ride._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update captain context with new earnings
      if (response.data.captain) {
        setCaptain(response.data.captain);
      }

      setShowCancelWarning(false);
      props.setConfirmRidePopUpPanel(false);
      props.setRidePopUpPanel && props.setRidePopUpPanel(false);
    } catch (err) {
      console.error("Error cancelling ride:", err);
      setError(err.response?.data?.error || "Failed to cancel ride");
    } finally {
      setCancelLoading(false);
    }
  };

  if (!ride) return null;

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-5">Confirm To Start Ride</h3>
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
          <form onSubmit={submitHandler}>
            <input
              className="bg-[#eee] px-6 py-4 font-mono text-center text-xl tracking-widest w-full rounded-lg mb-2"
              type="text"
              maxLength={6}
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, ""));
              }}
            />
            {error && (
              <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex justify-center bg-green-600 text-white rounded-lg p-3 w-full mb-1 border-white border-2 active:border-black disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Confirm"}
            </button>
            <button
              type="button"
              className="bg-red-500 text-white rounded-lg p-3 w-full mb-2 border-white border-2 active:border-black"
              onClick={handleCancelClick}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>

      {/* Cancel Warning Popup */}
      {showCancelWarning && (
        <div className="fixed inset-0 flex items-end justify-center z-[3000]">
          <div className="bg-white rounded-t-2xl p-6 w-full max-w-md shadow-2xl border-t border-gray-200">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-error-warning-fill text-4xl text-yellow-500"></i>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
              Cancel Ride?
            </h3>
            <p className="text-gray-600 text-center mb-4">
              You will be charged a{" "}
              <span className="font-bold text-red-500">
                ₹20 cancellation fine
              </span>{" "}
              which will be deducted from your earnings.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelWarning(false)}
                className="flex-1 p-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700"
                disabled={cancelLoading}
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={cancelLoading}
                className="flex-1 p-3 bg-red-500 text-white rounded-lg font-medium disabled:opacity-50"
              >
                {cancelLoading ? "Cancelling..." : "Cancel Ride"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmRidePopUp;
