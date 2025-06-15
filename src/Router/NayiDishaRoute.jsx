import React from "react";
import Navbar from "../Component/NayiDisah.jsx/Navbar";
import HomePage from "../Component/NayiDisah.jsx/Home";
import { Route, Routes } from "react-router-dom";

const NayiDishaRoute = () => {
  return (
    <>
      <div className="">
        <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </>
  );
};

export default NayiDishaRoute;
