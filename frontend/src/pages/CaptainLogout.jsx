import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainLogout = () => {
  const token = localStorage.getItem("captain-token");
  const navigate = useNavigate();

  axios
    .get(`${import.meta.env.VITE_BASE_URL}/captains/logout`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response.status);
      if (response.status === 200) {
        localStorage.removeItem("captain-token");
        navigate("/");
      }
    })
    .catch((error) => {
      console.error("Logout failed:", error);
    });
  return <div>CaptainLogout</div>;
};

export default CaptainLogout;
