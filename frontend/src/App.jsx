import React from "react";
import { Routes, Route } from "react-router-dom";
import Start from "./pages/Start.jsx";
import Home from "./pages/Home.jsx";
import CaptainLogin from "./pages/CaptainLogin.jsx";
import CaptainSignup from "./pages/CaptainSignup.jsx";
import UserLogin from "./pages/UserLogin.jsx";
import UserSignup from "./pages/UserSignup.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Start />}></Route>
        <Route path="/login" element={<UserLogin />}></Route>
        <Route path="/signup" element={<UserSignup />}></Route>
        <Route path="/captain-login" element={<CaptainLogin />}></Route>
        <Route path="/captain-signup" element={<CaptainSignup />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
    </>
  );
}

export default App;
