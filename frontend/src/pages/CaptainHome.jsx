import React, { useState, useRef, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import CaptainDetails from "../components/CaptainDetails.jsx";
import RidePopUp from "../components/RidePopUp.jsx";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp.jsx";
import { SocketContext } from "../context/SocketContext.jsx";
import { CaptainDataContext } from "../context/CaptainContext.jsx";

const CaptainHome = () => {
  const [ridePopUpPanel, setRidePopUpPanel] = useState(false);
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false);
  const [currentRide, setCurrentRide] = useState(null);

  const ridePopUpPanelRef = useRef(null);
  const confirmRidePopUpPanelRef = useRef(null);

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);

  // Debug captain data
  useEffect(() => {
    console.log("Captain data:", captain);
  }, [captain]);

  // Join socket room when captain logs in
  useEffect(() => {
    if (socket && captain?._id) {
      console.log("Captain joining socket room:", captain._id);
      socket.emit("join", {
        userId: captain._id,
        userType: "captain",
      });
    } else {
      console.log("Cannot join - socket:", !!socket, "captain:", captain);
    }
  }, [socket, captain]);

  // Listen for new rides
  useEffect(() => {
    if (socket) {
      console.log("Setting up new-ride listener");
      socket.on("new-ride", (rideData) => {
        console.log("New ride received:", rideData);
        setCurrentRide(rideData);
        setRidePopUpPanel(true);
      });

      return () => {
        socket.off("new-ride");
      };
    }
  }, [socket]);

  // Handle accepting ride
  const handleAcceptRide = async () => {
    if (!currentRide) return;

    try {
      const token = localStorage.getItem("captain-token");
      const API_BASE_URL =
        import.meta.env.VITE_BASE_URL || "http://localhost:3000";

      const response = await axios.post(
        `${API_BASE_URL}/rides/accept`,
        { rideId: currentRide._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRidePopUpPanel(false);
      setConfirmRidePopUpPanel(true);
    } catch (error) {
      console.error("Error accepting ride:", error);
      alert(error.response?.data?.error || "Failed to accept ride");
    }
  };

  // Handle ignoring ride
  const handleIgnoreRide = () => {
    setRidePopUpPanel(false);
    setCurrentRide(null);
  };

  useGSAP(() => {
    if (ridePopUpPanel) {
      gsap.to(ridePopUpPanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(ridePopUpPanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [ridePopUpPanel]);

  useGSAP(() => {
    if (confirmRidePopUpPanel) {
      gsap.to(confirmRidePopUpPanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(confirmRidePopUpPanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [confirmRidePopUpPanel]);

  return (
    <div className="h-screen flex flex-col">
      <Link
        to="/captain/logout"
        className="fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full z-10 shadow-md"
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
        <CaptainDetails />
      </div>

      <div className="fixed w-full z-10 bottom-0 translate-y-full bg-white p-3 py-6 px-3">
        {/* page */}
      </div>
      <div
        ref={ridePopUpPanelRef}
        className="fixed w-full z-10 bottom-0 bg-white p-3 py-6 px-3 translate-y-full"
      >
        <RidePopUp
          ride={currentRide}
          onAccept={handleAcceptRide}
          onIgnore={handleIgnoreRide}
          setRidePopUpPanel={setRidePopUpPanel}
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
        />
      </div>
      <div
        ref={confirmRidePopUpPanelRef}
        className="fixed w-full z-10 bottom-0 bg-white h-screen p-3 py-6 px-3 translate-y-full"
      >
        <ConfirmRidePopUp
          ride={currentRide}
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
          setRidePopUpPanel={setRidePopUpPanel}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
