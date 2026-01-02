import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext.jsx";

const UserSignup = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [userData, setUserData] = useState({});

  const navigate = useNavigate();

  const { user, setUser } = React.useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newUser = {
      fullName: { firstname, lastname },
      email,
      password,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/users/register`,
      newUser
    );

    if (response.status === 201) {
      const data = response.data;
      setUser(data.user);
      navigate("/home");
    }

    setFirstname("");
    setLastname("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img
          className="w-16 mb-10"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/1200px-Uber_logo_2018.svg.png?20180914002846"
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
            Signup
          </button>
          <p className="text-center">
            Already have an account?{" "}
            <Link className="text-blue-600" to="/login">
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

export default UserSignup;
