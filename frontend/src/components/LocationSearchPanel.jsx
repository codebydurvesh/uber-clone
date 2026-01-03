import React from "react";
import "remixicon/fonts/remixicon.css";

const LocationSearchPanel = (props) => {
  // sample data for locations
  const locations = [
    "15 Mistry Indl Complex, Cross Road-a, M.i.d.c.",
    "Shop No 7, Roshni Bldg, Sv Rd, Jogeshwari, Jogeshwari (west)",
    "309, Diamond Indl Estate, Off Aarey Rd, Goregaon (e)",
    "825, 825,7blk,jngrblr-82, Kanakapura Main Road, Jayanagar",
  ];

  return (
    <div>
      {locations.map(function (location, index) {
        return (
          <div
            key={index}
            onClick={() => {
              props.setVehiclePanel(true);
              props.setScroll(false);
            }}
            className="flex p-1 gap-2 bg-gray-100 active:border-2 rounded-xl gap-2 items-center my-2 justify-start"
          >
            <h2 className="bg-[#eee] h-8 w-14 flex items-center justify-center rounded-full ">
              <i className="ri-map-pin-fill text-xl"></i>
            </h2>
            <h4 className="font-medium">{location}</h4>
          </div>
        );
      })}
    </div>
  );
};

export default LocationSearchPanel;
