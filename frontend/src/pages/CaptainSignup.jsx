import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CaptainSignup = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [captainData, setCaptainData] = useState({});

  const submitHandler = (e) => {
    e.preventDefault();
    setCaptainData({ firstname, lastname, email, password });
    setFirstname("");
    setLastname("");
    setEmail("");
    setPassword("");
  };

  const navigate = useNavigate();

  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img
          className="w-18 mb-1"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSVCO4w_adxK32rCXFeKq3_NbLcR9b_js14w&s"
          alt="uber logo"
          onClick={() => navigate("/")}
        />
        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <h3 className="text-lg font-medium mb-2">What's your name</h3>
          <div className="flex gap-4 mb-5">
            <input
              className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 text-lg placeholder:text-base"
              type="text"
              required
              placeholder="firstname"
              value={firstname}
              onChange={(e) => {
                setFirstname(e.target.value);
              }}
            />
            <input
              className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 text-lg placeholder:text-base"
              type="text"
              required
              placeholder="lastname"
              value={lastname}
              onChange={(e) => {
                setLastname(e.target.value);
              }}
            />
          </div>
          <h3 className="text-lg font-medium mb-2">What's your email</h3>
          <input
            className="bg-[#eeeeee] mb-6 rounded px-4 py-2 w-full text-lg placeholder:text-base"
            type="email"
            required
            placeholder="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <input
            className="bg-[#eeeeee] mb-6 rounded px-4 py-2 w-full text-base placeholder:text-sm"
            type="password"
            required
            placeholder="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <button className="bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2  w-full text-base placeholder:text-sm">
            Signup as Captain
          </button>
          <p className="text-center">
            Already have an account?{" "}
            <Link className="text-blue-600" to="/captain-login">
              Login
            </Link>
          </p>
        </form>
      </div>
      <div>
        <p className="text-[10px] text-center">
          This site is protected by reCAPTCHA and the Google{" "}
          <Link
            className="font-semibold underline"
            to="https://www.uber.com/global/en/privacy-notice-drivers-delivery-people/"
          >
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link
            className="font-semibold underline"
            to="https://www.uber.com/legal/en/"
          >
            Terms of Service
          </Link>{" "}
          apply.
        </p>
      </div>
    </div>
  );
};

export default CaptainSignup;
