import React, { useState, useRef, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel.jsx";
import ConfirmRide from "../components/ConfirmRide.jsx";
import LookingForDriver from "../components/LookingForDriver.jsx";
import WaitingForDriver from "../components/WaitingForDriver.jsx";
import { useLocationServices } from "../hooks/useLocationServices.js";
import { UserDataContext } from "../context/UserContext.jsx";
import { SocketContext } from "../context/SocketContext.jsx";

const Home = () => {
  const navigate = useNavigate();

  // Get user context for authentication token
  const { user } = useContext(UserDataContext);

  // Get socket context
  const { socket } = useContext(SocketContext);

  // Get token from localStorage (adjust based on your auth implementation)
  const token = localStorage.getItem("token");

  // Form input states
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");

  // Selected location coordinates
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);

  // Which field is currently active (for suggestions)
  const [activeField, setActiveField] = useState(null); // 'pickup' or 'destination'

  // Panel states
  const [scroll, setScroll] = useState(false);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriverPanel, setWaitingForDriverPanel] = useState(false);

  // Ride cancelled popup state
  const [showRideCancelledPopup, setShowRideCancelledPopup] = useState(false);

  // Selected vehicle and fare states
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [fares, setFares] = useState(null);
  const [rideLoading, setRideLoading] = useState(false);
  const [createdRide, setCreatedRide] = useState(null);

  // Accepted ride data with captain info
  const [acceptedRide, setAcceptedRide] = useState(null);

  // Refs for GSAP animations
  const scrollRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverPanelRef = useRef(null);

  // Location services hook (with 500ms debounce)
  const {
    suggestions,
    searchLoading,
    searchError,
    searchLocations,
    clearSuggestions,
    distanceTime,
    distanceTimeLoading,
    calculateDistanceTime,
    clearDistanceTime,
  } = useLocationServices(500);

  // Join socket room when user is available
  useEffect(() => {
    if (socket && user?._id) {
      socket.emit("join", {
        userId: user._id,
        userType: "user",
      });
    }
  }, [socket, user]);

  // Listen for ride acceptance
  useEffect(() => {
    if (socket) {
      socket.on("ride-accepted", (rideData) => {
        console.log("Ride accepted:", rideData);
        setAcceptedRide(rideData);
        setVehicleFound(false);
        setWaitingForDriverPanel(true);
      });

      return () => {
        socket.off("ride-accepted");
      };
    }
  }, [socket]);

  // Listen for ride started (captain started the ride after OTP verification)
  useEffect(() => {
    if (socket) {
      socket.on("ride-started", (rideData) => {
        console.log("Ride started:", rideData);
        setWaitingForDriverPanel(false);
        navigate("/riding", { state: { ride: rideData } });
      });

      return () => {
        socket.off("ride-started");
      };
    }
  }, [socket, navigate]);

  // Listen for ride cancelled (captain cancelled the ride)
  useEffect(() => {
    if (socket) {
      socket.on("ride-cancelled", (data) => {
        console.log("Ride cancelled:", data);
        setWaitingForDriverPanel(false);
        setVehicleFound(false);
        setAcceptedRide(null);
        setShowRideCancelledPopup(true);
      });

      return () => {
        socket.off("ride-cancelled");
      };
    }
  }, [socket]);

  /**
   * Handle input change for pickup field
   * Triggers debounced location search
   */
  const handlePickupChange = (e) => {
    const value = e.target.value;
    setPickup(value);
    setActiveField("pickup");

    // Clear previous pickup coordinates when user types
    if (pickupCoords) {
      setPickupCoords(null);
      clearDistanceTime();
    }

    // Search for suggestions
    if (token) {
      searchLocations(value, token);
    }
  };

  /**
   * Handle input change for destination field
   * Triggers debounced location search
   */
  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestination(value);
    setActiveField("destination");

    // Clear previous destination coordinates when user types
    if (destinationCoords) {
      setDestinationCoords(null);
      clearDistanceTime();
    }

    // Search for suggestions
    if (token) {
      searchLocations(value, token);
    }
  };

  /**
   * Handle location selection from suggestions panel
   * Stores coordinates and updates the input field
   */
  const handleSelectLocation = (locationData) => {
    const { name, lat, lng, field } = locationData;

    if (field === "pickup") {
      setPickup(name);
      setPickupCoords({ lat, lng, name });
    } else if (field === "destination") {
      setDestination(name);
      setDestinationCoords({ lat, lng, name });
    }

    // Clear suggestions after selection
    clearSuggestions();
  };

  /**
   * Effect: Calculate distance and time when both coordinates are available
   */
  useEffect(() => {
    if (pickupCoords && destinationCoords && token) {
      calculateDistanceTime(pickupCoords, destinationCoords, token);
    }
  }, [pickupCoords, destinationCoords, token, calculateDistanceTime]);

  /**
   * Handle "Use my location" button click
   * Gets user's current GPS location and sets it as pickup
   */
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Reverse geocode to get address name
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          const locationName =
            data.display_name ||
            `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

          setPickup(locationName);
          setPickupCoords({
            name: locationName,
            lat: latitude,
            lng: longitude,
          });
          clearSuggestions();
        } catch (error) {
          console.error("Error reverse geocoding:", error);
          // Use coordinates as fallback
          const locationName = `${latitude.toFixed(4)}, ${longitude.toFixed(
            4
          )}`;
          setPickup(locationName);
          setPickupCoords({
            name: locationName,
            lat: latitude,
            lng: longitude,
          });
          clearSuggestions();
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your location. Please enter it manually.");
      },
      { enableHighAccuracy: true }
    );
  };

  /**
   * Effect: Calculate fares when distance/time is available
   */
  useEffect(() => {
    if (distanceTime) {
      const baseFare = {
        autorickshaw: 30,
        car: 50,
        motorcycle: 20,
      };
      const perKmRate = {
        autorickshaw: 12,
        car: 18,
        motorcycle: 8,
      };
      const perMinuteRate = {
        autorickshaw: 1,
        car: 2,
        motorcycle: 0.5,
      };

      const distanceInKm = distanceTime.distance;
      const timeInMinutes = distanceTime.duration;

      const calculatedFares = {
        autorickshaw: Math.round(
          baseFare.autorickshaw +
            perKmRate.autorickshaw * distanceInKm +
            perMinuteRate.autorickshaw * timeInMinutes
        ),
        car: Math.round(
          baseFare.car +
            perKmRate.car * distanceInKm +
            perMinuteRate.car * timeInMinutes
        ),
        motorcycle: Math.round(
          baseFare.motorcycle +
            perKmRate.motorcycle * distanceInKm +
            perMinuteRate.motorcycle * timeInMinutes
        ),
      };
      setFares(calculatedFares);
    }
  }, [distanceTime]);

  /**
   * Effect: Show vehicle panel when distance/time is calculated
   */
  useEffect(() => {
    if (distanceTime && pickupCoords && destinationCoords) {
      setScroll(false);
      setVehiclePanel(true);
    }
  }, [distanceTime, pickupCoords, destinationCoords]);

  /**
   * Handle vehicle selection
   */
  const handleVehicleSelect = (vehicleType) => {
    const vehicleInfo = {
      car: {
        type: "car",
        name: "UberGo",
        capacity: 4,
        image:
          "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy85MDM0YzIwMC1jZTI5LTQ5ZjEtYmYzNS1lOWQyNTBlODIxN2EucG5n",
        description: "Affordable, compact rides",
      },
      motorcycle: {
        type: "motorcycle",
        name: "Moto",
        capacity: 1,
        image:
          "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8yYzdmYTE5NC1jOTU0LTQ5YjItOWM2ZC1hM2I4NjAxMzcwZjUucG5n",
        description: "Affordable motorcycle rides",
      },
      autorickshaw: {
        type: "autorickshaw",
        name: "UberAuto",
        capacity: 3,
        image:
          "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8xZGRiOGM1Ni0wMjA0LTRjZTQtODFjZS01NmExMWEwN2ZlOTgucG5n",
        description: "Affordable autorickshaw rides",
      },
    };

    setSelectedVehicle({
      ...vehicleInfo[vehicleType],
      fare: fares[vehicleType],
    });
    setConfirmRidePanel(true);
  };

  /**
   * Create ride API call
   */
  const handleCreateRide = async () => {
    if (!selectedVehicle || !pickupCoords || !destinationCoords) return;

    setRideLoading(true);
    try {
      const API_BASE_URL =
        import.meta.env.VITE_BASE_URL || "http://localhost:3000";
      const response = await axios.post(
        `${API_BASE_URL}/rides/create`,
        {
          pickup: pickupCoords.name,
          destination: destinationCoords.name,
          vehicleType: selectedVehicle.type,
          pickupCoords: {
            lat: parseFloat(pickupCoords.lat),
            lng: parseFloat(pickupCoords.lng),
          },
          destinationCoords: {
            lat: parseFloat(destinationCoords.lat),
            lng: parseFloat(destinationCoords.lng),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCreatedRide(response.data);
      setConfirmRidePanel(false);
      setVehicleFound(true);
    } catch (error) {
      console.error("Error creating ride:", error);
      alert(error.response?.data?.error || "Failed to create ride");
    } finally {
      setRideLoading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  useGSAP(() => {
    if (scroll) {
      gsap.to(scrollRef.current, {
        height: "70%",
        opacity: "1",
        padding: 24,
      });
      gsap.to(panelCloseRef.current, {
        opacity: "1",
      });
    } else {
      gsap.to(scrollRef.current, {
        height: "0%",
        padding: 0,
      });
      gsap.to(panelCloseRef.current, {
        opacity: "0",
      });
    }
  }, [scroll]);

  useGSAP(() => {
    if (vehiclePanel) {
      gsap.to(vehiclePanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(vehiclePanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [vehiclePanel]);

  useGSAP(() => {
    if (confirmRidePanel) {
      gsap.to(confirmRidePanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(confirmRidePanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [confirmRidePanel]);

  useGSAP(() => {
    if (vehicleFound) {
      gsap.to(vehicleFoundRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(vehicleFoundRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [vehicleFound]);

  useGSAP(() => {
    if (waitingForDriverPanel) {
      gsap.to(waitingForDriverPanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(waitingForDriverPanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [waitingForDriverPanel]);
  return (
    <div className="relative h-screen overflow-hidden">
      <img
        className="w-16 absolute left-5 top-5 m-2 z-[5]"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/1200px-Uber_logo_2018.svg.png?20180914002846"
        alt="uber-logo"
        onClick={() => navigate("/")}
      />
      <Link
        to="/user/logout"
        className="fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full z-[5] shadow-md"
      >
        <i className="text-lg font-medium ri-logout-box-r-line"></i>
      </Link>
      <div className="w-screen h-screen">
        {/* Sample Uber Map Image */}
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1100/format:webp/0*gwMx05pqII5hbfmX.gif"
          alt="uber-sample-map"
        />
      </div>
      <div className="flex flex-col justify-end h-screen absolute top-0 w-full z-[10]">
        <div className="h-[31%] p-6 bg-white relative">
          <h5
            ref={panelCloseRef}
            onClick={() => {
              setScroll(false);
            }}
            className="absolute right-6 top-6 text-2xl opacity-0"
          >
            <i className="ri-arrow-down-s-fill"></i>
          </h5>
          <h4 className="text-3xl font-semibold">Find a trip</h4>
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
            className="relative mt-4"
          >
            {/* Pickup Input with location button */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  onClick={() => {
                    setScroll(true);
                    setActiveField("pickup");
                  }}
                  className="bg-[#eee] px-4 py-3 text-base w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  type="text"
                  placeholder="Enter your pickup location"
                  value={pickup}
                  onChange={handlePickupChange}
                />
                {pickupCoords && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                    <i className="ri-checkbox-circle-fill text-lg"></i>
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleUseMyLocation}
                className="w-11 h-11 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                title="Use current location"
              >
                <i className="ri-crosshair-2-line text-white text-lg"></i>
              </button>
            </div>

            {/* Destination Input */}
            <div className="flex items-center gap-2 mt-3">
              <div className="relative flex-1">
                <input
                  onClick={() => {
                    setScroll(true);
                    setActiveField("destination");
                  }}
                  className="bg-[#eee] px-4 py-3 text-base w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  type="text"
                  placeholder="Enter your destination"
                  value={destination}
                  onChange={handleDestinationChange}
                />
                {destinationCoords && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                    <i className="ri-checkbox-circle-fill text-lg"></i>
                  </span>
                )}
              </div>
            </div>
          </form>

          {/* Show distance/time info when available */}
          {/* {distanceTime && (
            <div className="mt-3 p-2 bg-green-50 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="ri-route-line text-green-600"></i>
                <span className="text-sm font-medium">
                  {distanceTime.distanceText}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <i className="ri-time-line text-green-600"></i>
                <span className="text-sm font-medium">
                  {distanceTime.durationText}
                </span>
              </div>
            </div>
          )} */}
          {distanceTimeLoading && (
            <div className="mt-3 p-2 bg-gray-50 rounded-lg flex items-center justify-center relative z-[25]">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
              <span className="text-sm text-gray-600">
                Calculating route...
              </span>
            </div>
          )}
        </div>
        <div ref={scrollRef} className={"bg-white h-0 opacity-0 z-[20]"}>
          {/* Show error message if search fails */}
          {searchError && (
            <div className="p-2 mb-2 bg-red-50 text-red-600 rounded-lg text-sm">
              <i className="ri-error-warning-line mr-1"></i>
              {searchError}
            </div>
          )}
          <LocationSearchPanel
            suggestions={suggestions}
            isLoading={searchLoading}
            onSelectLocation={handleSelectLocation}
            activeField={activeField}
            setVehiclePanel={setVehiclePanel}
            setScroll={setScroll}
          />
        </div>
      </div>
      <div
        ref={vehiclePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white p-3 py-6 px-3"
      >
        <h3 className="text-2xl font-semibold mb-5">Choose a Vehicle</h3>
        {distanceTime && (
          <div className="mt-3 p-2 bg-green-50 rounded-lg flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <i className="ri-route-line text-green-600"></i>
              <span className="text-sm font-medium">
                {distanceTime.distanceText}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <i className="ri-time-line text-green-600"></i>
              <span className="text-sm font-medium">
                {distanceTime.durationText}
              </span>
            </div>
          </div>
        )}
        <h5
          ref={vehiclePanelRef}
          onClick={() => setVehiclePanel(false)}
          className="absolute right-6 top-6 text-2xl opacity-100"
        >
          <i className="ri-arrow-down-s-fill"></i>
        </h5>
        <div
          onClick={() => handleVehicleSelect("car")}
          className="p-3 mb-2 active:border-2 active:border-black bg-gray-100 rounded-xl w-full flex items-center justify-between cursor-pointer hover:bg-gray-200 transition-colors"
        >
          <img
            className="h-12"
            src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy85MDM0YzIwMC1jZTI5LTQ5ZjEtYmYzNS1lOWQyNTBlODIxN2EucG5n"
            alt="Uber-car-logo"
          />
          <div className=" w-1/2 ml-2">
            <h4 className="font-medium text-base">
              UberGo{" "}
              <span>
                <i className="ri-user-fill"></i>4
              </span>
            </h4>
            <h5 className="font-medium text-sm">2 mins away</h5>
            <p className="font-normal text-xs text-gray-600">
              Affordable, compact rides
            </p>
          </div>
          <h2 className="text-lg font-semibold">₹{fares?.car || "--"}</h2>
        </div>
        <div
          onClick={() => handleVehicleSelect("motorcycle")}
          className="p-3 mb-2 active:border-2 active:border-black bg-gray-100 rounded-xl w-full flex items-center justify-between cursor-pointer hover:bg-gray-200 transition-colors"
        >
          <img
            className="h-12"
            src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8yYzdmYTE5NC1jOTU0LTQ5YjItOWM2ZC1hM2I4NjAxMzcwZjUucG5n"
            alt="Uber-moto-logo"
          />
          <div className=" w-1/2 ml-2">
            <h4 className="font-medium text-base">
              Moto{" "}
              <span>
                <i className="ri-user-fill"></i>1
              </span>
            </h4>
            <h5 className="font-medium text-sm">3 mins away</h5>
            <p className="font-normal text-xs text-gray-600">
              Affordable motorcycle rides
            </p>
          </div>
          <h2 className="text-lg font-semibold">
            ₹{fares?.motorcycle || "--"}
          </h2>
        </div>
        <div
          onClick={() => handleVehicleSelect("autorickshaw")}
          className="p-3 mb-2 active:border-2 active:border-black bg-gray-100 rounded-xl w-full flex items-center justify-between cursor-pointer hover:bg-gray-200 transition-colors"
        >
          <img
            className="h-12"
            src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8xZGRiOGM1Ni0wMjA0LTRjZTQtODFjZS01NmExMWEwN2ZlOTgucG5n"
            alt="Uber-auto-logo"
          />
          <div className=" w-1/2 ml-2">
            <h4 className="font-medium text-base">
              UberAuto{" "}
              <span>
                <i className="ri-user-fill"></i>3
              </span>
            </h4>
            <h5 className="font-medium text-sm">3 mins away</h5>
            <p className="font-normal text-xs text-gray-600">
              Affordable autorickshaw rides
            </p>
          </div>
          <h2 className="text-lg font-semibold">
            ₹{fares?.autorickshaw || "--"}
          </h2>
        </div>
      </div>
      <div
        ref={confirmRidePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white p-3 py-6 px-3"
      >
        <ConfirmRide
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleFound={setVehicleFound}
          selectedVehicle={selectedVehicle}
          pickup={pickupCoords}
          destination={destinationCoords}
          onConfirm={handleCreateRide}
          isLoading={rideLoading}
        />
      </div>
      <div
        ref={vehicleFoundRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white p-3 py-6 px-3"
      >
        <LookingForDriver
          setVehicleFound={setVehicleFound}
          ride={createdRide}
          selectedVehicle={selectedVehicle}
        />
      </div>
      <div
        ref={waitingForDriverPanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white p-3 py-6 px-3"
      >
        <WaitingForDriver
          ride={acceptedRide}
          setWaitingForDriverPanel={setWaitingForDriverPanel}
        />
      </div>

      {/* Ride Cancelled Popup */}
      {showRideCancelledPopup && (
        <div className="fixed inset-0 flex items-end justify-center z-[3000]">
          <div className="bg-white rounded-t-2xl p-6 w-full max-w-md shadow-2xl border-t border-gray-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-close-circle-fill text-4xl text-red-500"></i>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
              Ride Cancelled
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Unfortunately, the driver has cancelled your ride. Please choose
              another vehicle to continue.
            </p>
            <button
              onClick={() => {
                setShowRideCancelledPopup(false);
                setVehiclePanel(true);
              }}
              className="w-full p-3 bg-black text-white rounded-lg font-medium"
            >
              Choose Another Vehicle
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
