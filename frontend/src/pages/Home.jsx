import React, { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel.jsx";
import ConfirmRide from "../components/ConfirmRide.jsx";
import LookingForDriver from "../components/LookingForDriver.jsx";
import WaitingForDriver from "../components/WaitingForDriver.jsx";
import { useLocationServices } from "../hooks/useLocationServices.js";
import { UserDataContext } from "../context/UserContext.jsx";

const Home = () => {
  const navigate = useNavigate();

  // Get user context for authentication token
  const { user } = useContext(UserDataContext);

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
   * Effect: Show vehicle panel when distance/time is calculated
   */
  useEffect(() => {
    if (distanceTime && pickupCoords && destinationCoords) {
      setScroll(false);
      setVehiclePanel(true);
    }
  }, [distanceTime, pickupCoords, destinationCoords]);

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
        className="w-16 absolute left-5 top-5 m-2"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/1200px-Uber_logo_2018.svg.png?20180914002846"
        alt="uber-logo"
        onClick={() => navigate("/")}
      />
      <div className="w-screen h-screen">
        {/* Sample Uber Map Image */}
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1100/format:webp/0*gwMx05pqII5hbfmX.gif"
          alt="uber-sample-map"
        />
      </div>
      <div className="flex flex-col justify-end h-screen absolute top-0 w-full">
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
          >
            <div className="line absolute h-16 w-1 bg-gray-900 top-[45%] left-10 rounded-full"></div>
            <input
              onClick={() => {
                setScroll(true);
                setActiveField("pickup");
              }}
              className="bg-[#eee] px-12 py-2 text-base w-full mt-5 rounded-lg"
              type="text"
              placeholder="Enter your pickup location"
              value={pickup}
              onChange={handlePickupChange}
            />
            {/* Show checkmark if pickup coordinates are set */}
            {pickupCoords && (
              <span className="absolute right-8 top-[52%] text-green-500">
                <i className="ri-checkbox-circle-fill"></i>
              </span>
            )}
            <input
              onClick={() => {
                setScroll(true);
                setActiveField("destination");
              }}
              className="bg-[#eee] px-12 py-2 text-base w-full mt-3 rounded-lg"
              type="text"
              placeholder="Enter your destination"
              value={destination}
              onChange={handleDestinationChange}
            />
            {/* Show checkmark if destination coordinates are set */}
            {destinationCoords && (
              <span className="absolute right-8 bottom-[15%] text-green-500">
                <i className="ri-checkbox-circle-fill"></i>
              </span>
            )}
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
            <div className="mt-3 p-2 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
              <span className="text-sm text-gray-600">
                Calculating route...
              </span>
            </div>
          )}
        </div>
        <div ref={scrollRef} className={"bg-white h-0 opacity-0"}>
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
          onClick={() => {
            setConfirmRidePanel(true);
          }}
          className="p-3 mb-2 active:border-2  bg-gray-100 rounded-xl w-full flex items-center justify-between"
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
          <h2 className="text-lg font-semibold">₹193.20</h2>
        </div>
        <div
          onClick={() => {
            setConfirmRidePanel(true);
          }}
          className="p-3 mb-2 active:border-2 bg-gray-100 rounded-xl w-full flex items-center justify-between"
        >
          <img
            className="h-12"
            src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8yYzdmYTE5NC1jOTU0LTQ5YjItOWM2ZC1hM2I4NjAxMzcwZjUucG5n"
            alt="Uber-car-logo"
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
          <h2 className="text-lg font-semibold">₹65.17</h2>
        </div>
        <div
          onClick={() => {
            setConfirmRidePanel(true);
          }}
          className="p-3 mb-2 active:border-2 bg-gray-100 rounded-xl w-full flex items-center justify-between"
        >
          <img
            className="h-12"
            src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8xZGRiOGM1Ni0wMjA0LTRjZTQtODFjZS01NmExMWEwN2ZlOTgucG5n"
            alt="Uber-car-logo"
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
          <h2 className="text-lg font-semibold">₹118.21</h2>
        </div>
      </div>
      <div
        ref={confirmRidePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white p-3 py-6 px-3"
      >
        <ConfirmRide
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleFound={setVehicleFound}
        />
      </div>
      <div
        ref={vehicleFoundRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white p-3 py-6 px-3"
      >
        <LookingForDriver setVehicleFound={setVehicleFound} />
      </div>
      <div
        ref={waitingForDriverPanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white p-3 py-6 px-3"
      >
        <WaitingForDriver
          waitingForDriverPanel={waitingForDriverPanel}
          setWaitingForDriverPanel={setWaitingForDriverPanel}
        />
      </div>
    </div>
  );
};

export default Home;
