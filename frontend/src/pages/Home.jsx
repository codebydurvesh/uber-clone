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
  const scrollRef = useRef(null);
  const panelCloseRef = useRef(null);

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

  return (
    <div className="relative h-screen">
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
          <LocationSearchPanel />
        </div>
      </div>
    </div>
  );
};

export default Home;
