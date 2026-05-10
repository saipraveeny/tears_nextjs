"use client";

import React from "react";
import "./Loader.css";
const logo = "/assets/logo.svg";

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-content">
        <img src={logo} alt="Tears Logo" className="loader-logo" />
        <div className="loader-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
