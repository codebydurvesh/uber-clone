import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import LiveTracking from "../components/LiveTracking.jsx";
import { SocketContext } from "../context/SocketContext.jsx";

const Riding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const rideData = location.state?.ride || {};
  const { socket } = useContext(SocketContext);
  const [routeInfo, setRouteInfo] = useState({
    distance: null,
    duration: null,
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showRideEndedPopup, setShowRideEndedPopup] = useState(false);
  const [showPaymentConfirmPopup, setShowPaymentConfirmPopup] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState({
    title: "",
    message: "",
    icon: "",
  });

  // Listen for ride ended event
  useEffect(() => {
    if (socket) {
      socket.on("ride-ended", (data) => {
        console.log("Ride ended:", data);
        setShowRideEndedPopup(true);
      });

      return () => {
        socket.off("ride-ended");
      };
    }
  }, [socket, navigate]);

  const handleRouteInfo = (info) => {
    setRouteInfo(info);
  };

  const handleMakePayment = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = () => {
    setShowPaymentModal(false);
    if (paymentMethod === "cash") {
      setPaymentMessage({
        title: "Cash Payment",
        message: `Please pay ₹${rideData.fare} to the driver when the ride ends.`,
        icon: "ri-money-dollar-circle-fill",
        color: "text-green-500",
      });
    } else if (paymentMethod === "upi") {
      setPaymentMessage({
        title: "UPI Payment",
        message:
          "UPI payment integration coming soon! For now, please pay cash to the driver.",
        icon: "ri-smartphone-fill",
        color: "text-blue-500",
      });
    } else if (paymentMethod === "card") {
      setPaymentMessage({
        title: "Card Payment",
        message:
          "Card payment integration coming soon! For now, please pay cash to the driver.",
        icon: "ri-bank-card-fill",
        color: "text-purple-500",
      });
    }
    setShowPaymentConfirmPopup(true);
  };

  const handleRideEndedClose = () => {
    setShowRideEndedPopup(false);
    navigate("/");
  };

  return (
    <div className="h-screen flex flex-col relative">
      <Link
        to="/home"
        className="fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full z-[1001]"
      >
        <i className="text-lg font-medium ri-home-5-line"></i>
      </Link>
      <div className="h-1/2 relative z-0">
        {/* Live Tracking Map */}
        <LiveTracking
          userType="user"
          rideId={rideData._id}
          ride={rideData}
          onRouteInfo={handleRouteInfo}
        />
      </div>

      <div className="h-1/2 p-4 relative z-10 bg-white">
        <div className="flex justify-between items-center">
          <img
            className="h-10"
            src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy85MDM0YzIwMC1jZTI5LTQ5ZjEtYmYzNS1lOWQyNTBlODIxN2EucG5n"
            alt="Uber-car-logo"
          />
          <div className="text-right">
            <h2 className="text-lg font-medium capitalize">
              {rideData.captain?.fullname?.firstname || "Driver"}{" "}
              {rideData.captain?.fullname?.lastname || ""}
            </h2>
            <h4 className="text-xl font-semibold -mt-1 -mb-1 uppercase">
              {rideData.captain?.vehicle?.plate || "XX 00 XX 0000"}
            </h4>
            <p className="text-sm text-gray-600 capitalize">
              {rideData.captain?.vehicle?.vehicleType || "Car"}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-between items-center">
          <div className="w-full mb-2">
            <div className="flex items-center gap-5 p-3 border-b-2 border-gray-300">
              <i className="text-lg ri-map-pin-user-fill"></i>
              <div>
                <h3 className="text-lg font-medium">Destination</h3>
                <p className="text-sm -mt-1 text-gray-600">
                  {rideData.destination || "Your destination"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-5 p-3">
              <i className="text-lg ri-money-rupee-circle-fill"></i>
              <div>
                <h3 className="text-lg font-medium">₹{rideData.fare || "0"}</h3>
                <p className="text-sm -mt-1 text-gray-600">Cash Payment</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleMakePayment}
          className="w-full bg-green-600 flex items-center justify-center p-2 rounded-lg text-white font-semibold mb-4"
        >
          Make a Payment
        </button>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 flex items-end justify-center z-[2000]">
          <div className="bg-white rounded-t-2xl p-6 w-full max-w-md shadow-2xl border-t border-gray-200">
            <h3 className="text-xl font-semibold mb-4">
              Select Payment Method
            </h3>

            <div className="space-y-3 mb-6">
              <label
                className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer ${
                  paymentMethod === "cash"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200"
                }`}
                onClick={() => setPaymentMethod("cash")}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cash"}
                  onChange={() => {}}
                  className="hidden"
                />
                <i className="ri-money-dollar-circle-line text-2xl text-green-600"></i>
                <div>
                  <p className="font-medium">Cash</p>
                  <p className="text-sm text-gray-500">
                    Pay with cash after ride
                  </p>
                </div>
                {paymentMethod === "cash" && (
                  <i className="ri-check-line text-green-500 ml-auto text-xl"></i>
                )}
              </label>

              <label
                className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer ${
                  paymentMethod === "upi"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200"
                }`}
                onClick={() => setPaymentMethod("upi")}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "upi"}
                  onChange={() => {}}
                  className="hidden"
                />
                <i className="ri-smartphone-line text-2xl text-blue-600"></i>
                <div>
                  <p className="font-medium">UPI</p>
                  <p className="text-sm text-gray-500">
                    Google Pay, PhonePe, Paytm
                  </p>
                </div>
                {paymentMethod === "upi" && (
                  <i className="ri-check-line text-green-500 ml-auto text-xl"></i>
                )}
              </label>

              <label
                className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer ${
                  paymentMethod === "card"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200"
                }`}
                onClick={() => setPaymentMethod("card")}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "card"}
                  onChange={() => {}}
                  className="hidden"
                />
                <i className="ri-bank-card-line text-2xl text-purple-600"></i>
                <div>
                  <p className="font-medium">Card</p>
                  <p className="text-sm text-gray-500">Credit or Debit card</p>
                </div>
                {paymentMethod === "card" && (
                  <i className="ri-check-line text-green-500 ml-auto text-xl"></i>
                )}
              </label>
            </div>

            <div className="flex items-center justify-between mb-4 p-3 bg-gray-100 rounded-lg">
              <span className="text-gray-600">Total Amount</span>
              <span className="text-xl font-bold">₹{rideData.fare || "0"}</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 p-3 border-2 border-gray-300 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handlePaymentConfirm}
                className="flex-1 p-3 bg-green-600 text-white rounded-lg font-medium"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ride Ended Popup */}
      {showRideEndedPopup && (
        <div className="fixed inset-0 flex items-end justify-center z-[2000]">
          <div className="bg-white rounded-t-2xl p-8 w-full max-w-md text-center shadow-2xl border-t border-gray-200">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-checkbox-circle-fill text-4xl text-green-500"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Ride Completed!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for riding with us. Have a great day!
            </p>

            <button
              onClick={handleRideEndedClose}
              className="w-full p-4 bg-black text-white rounded-lg font-semibold text-lg"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Payment Confirmation Popup */}
      {showPaymentConfirmPopup && (
        <div className="fixed inset-0 flex items-end justify-center z-[2000]">
          <div className="bg-white rounded-t-2xl p-8 w-full max-w-md text-center shadow-2xl border-t border-gray-200">
            <div
              className={`w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4`}
            >
              <i
                className={`${paymentMessage.icon} text-5xl ${paymentMessage.color}`}
              ></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {paymentMessage.title}
            </h2>
            <p className="text-gray-600 mb-6">{paymentMessage.message}</p>

            <button
              onClick={() => setShowPaymentConfirmPopup(false)}
              className="w-full p-4 bg-black text-white rounded-lg font-semibold text-lg"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Riding;
