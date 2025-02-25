import React from "react";
import "./ProgressBar.css";

const ProgressBar = ({ potentialScore, children }) => {
  const percentage = (potentialScore / 1000) * 100;

  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar"
        style={{
          background: `linear-gradient(to right, #FF4500 ${percentage}%, #FF9966 ${percentage}%)`,
        }}
      />
      {children}
    </div>
  );
};

export default ProgressBar;
