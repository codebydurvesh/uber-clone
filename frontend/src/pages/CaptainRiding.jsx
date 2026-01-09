import React, { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import CaptainDetails from "../components/CaptainDetails.jsx";
import RidePopUp from "../components/RidePopUp.jsx";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import FinishRide from "../components/FinishRide.jsx";
import LiveTracking from "../components/LiveTracking.jsx";

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const [routeInfo, setRouteInfo] = useState({
    distance: null,
    duration: null,
  });
  const location = useLocation();
  const rideData = location.state?.ride || {};

  const finishRidePanelRef = useRef(null);

  useGSAP(() => {
    if (finishRidePanel) {
      gsap.to(finishRidePanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(finishRidePanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [finishRidePanel]);

  const handleRouteInfo = (info) => {
    setRouteInfo(info);
  };

  return (
    <div className="h-screen flex flex-col relative">
      <Link
        to="/captain/logout"
        className="fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full z-[1001]"
      >
        <i className="text-lg font-medium ri-logout-box-r-line"></i>
      </Link>
      <div className="h-4/5 flex-grow relative z-0">
        {/* Live Tracking Map */}
        <LiveTracking
          userType="captain"
          rideId={rideData._id}
          ride={rideData}
          onRouteInfo={handleRouteInfo}
        />
      </div>
      <div className="h-1/5 p-6 bg-yellow-400 flex items-center justify-between relative z-10">
        <h4 className="text-xl font-semibold">
          {routeInfo.distance
            ? `${routeInfo.distance} away`
            : rideData.distance
            ? `${rideData.distance} away`
            : "Calculating..."}
        </h4>
        <button
          onClick={() => {
            setFinishRidePanel(true);
          }}
          className="bg-green-600 text-white rounded-lg p-3 px-10"
        >
          Complete Ride
        </button>
      </div>
      <div
        ref={finishRidePanelRef}
        className="fixed w-full z-[1002] bottom-0 bg-white p-3 py-6 px-3 translate-y-full"
      >
        <FinishRide
          rideData={rideData}
          setFinishRidePanel={setFinishRidePanel}
        />
      </div>
    </div>
  );
};

export default CaptainRiding;
