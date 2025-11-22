// components/common/Loader.jsx
import React from "react";
import "../../styles/loader.css";

const Loader = ({ fullScreen = false, size = "medium" }) => {
  return (
    <div className={`loader-container ${fullScreen ? "fullscreen" : ""}`}>
      <div className={`loader ${size}`}>
        <div className="spinner"></div>
      </div>
      {fullScreen && <p className="loader-text">Loading dashboard...</p>}
    </div>
  );
};

export default Loader;
