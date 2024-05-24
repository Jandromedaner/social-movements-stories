import React from "react";

const Popup = ({ isVisible, onClose, title, content }) => {
  return (
    <div className={`popup ${isVisible ? "visible" : ""}`}>
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>{title}</h2>
        <p>{content}</p>
      </div>
    </div>
  );
};

export default Popup;
