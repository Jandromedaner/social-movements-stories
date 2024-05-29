import React from "react";

interface NavigationMenuProps {
  onNavigate: (page: string) => void;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ onNavigate }) => (
  <div className="navigation-menu">
    <button onClick={() => onNavigate("home")}>Home</button>
    <button onClick={() => onNavigate("about")}>About</button>
    <button onClick={() => onNavigate("contact")}>Contact</button>
  </div>
);

export default NavigationMenu;
