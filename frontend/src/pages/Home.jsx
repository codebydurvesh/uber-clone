import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="bg-cover  bg-center bg-[url(https://images.unsplash.com/photo-1624724126923-e2c021df1311?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-screen pt-5  w-full flex justify-between flex-col w-full">
        <img
          className="w-16 ml-8 mt-3"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/1200px-Uber_logo_2018.svg.png?20180914002846"
          alt="uber logo"
        />
        <div className="bg-white pb-7 py-4 px-4">
          <h2 className="text-3xl font-bold">Get Started with Uber</h2>
          <Link
            to="/login"
            className="flex items-center justify-center w-full bg-black text-white py-3 rounded mt-5
          "
          >
            Continue
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
