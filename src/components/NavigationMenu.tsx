import React from "react";

const NavigationMenu = ({ onNavigate }) => (
  <div className="navigation-menu">
    <button onClick={() => onNavigate("home")}>Home</button>
    <button onClick={() => onNavigate("about")}>About</button>
    <button onClick={() => onNavigate("contact")}>Contact</button>
  </div>
);

export default NavigationMenu;
