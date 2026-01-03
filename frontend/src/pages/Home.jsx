import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel.jsx";

const Home = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = React.useState("");
  const [destination, setDestination] = useState("");
  const [scroll, setScroll] = useState(false);
  const scrollRef = useRef(null); //scroll and panel are the same thing
  const panelCloseRef = useRef(null);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const vehiclePanelRef = useRef(null);

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
            <i class="ri-arrow-down-s-fill"></i>
          </h5>
          <h4 className="text-3xl font-semibold">Find a trip</h4>
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <div className="line absolute h-16 w-1 bg-gray-900 top-[47%] left-10 rounded-full"></div>
            <input
              onClick={() => setScroll(true)}
              className="bg-[#eee] px-12 py-2 text-base w-full mt-5"
              type="text"
              placeholder="Enter your pickup location"
              value={pickup}
              onChange={(e) => {
                setPickup(e.target.value);
              }}
            />
            <input
              onClick={() => setScroll(true)}
              className="bg-[#eee] px-12 py-2 text-base w-full mt-3"
              type="text"
              placeholder="Enter your destination"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
              }}
            />
          </form>
        </div>
        <div ref={scrollRef} className={"bg-white h-0 opacity-0"}>
          <LocationSearchPanel
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
        <h5
          ref={vehiclePanelRef}
          onClick={() => setVehiclePanel(false)}
          className="absolute right-6 top-6 text-2xl opacity-100"
        >
          <i class="ri-arrow-down-s-fill"></i>
        </h5>
        <div className="p-3 mb-2 active:border-2  bg-gray-100 rounded-xl w-full flex items-center justify-between">
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
        <div className="p-3 mb-2 active:border-2 bg-gray-100 rounded-xl w-full flex items-center justify-between">
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
        <div className="p-3 mb-2 active:border-2 bg-gray-100 rounded-xl w-full flex items-center justify-between">
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
    </div>
  );
};

export default Home;
