import React from "react";
import { useNavigate, NavLink } from "react-router-dom";

interface NavigationMenuProps {
  isOpen: boolean;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ isOpen }) => {
  const navigate = useNavigate();

  return (
    <div className="mt-8">
      <h3
        className={`text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4 ${
          isOpen ? "" : "hidden"
        }`}
      >
        Navigation
      </h3>
      <nav className="space-y-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center px-4 py-2.5 text-sm rounded transition-colors ${
              isActive
                ? "bg-dex-bg-highlight text-dex-text-primary"
                : "text-dex-text-secondary hover:bg-dex-bg-highlight hover:text-dex-text-primary"
            } ${isOpen ? "" : "hidden"}`
          }
        >
          <span className="mr-3 w-5 text-center">📈</span>
          <span className={`${isOpen ? "" : "hidden"}`}>Trending</span>
        </NavLink>
        <NavLink
          to="/pumpfun"
          className={({ isActive }) =>
            `flex items-center px-4 py-2.5 text-sm rounded transition-colors ${
              isActive
                ? "bg-dex-bg-highlight text-dex-text-primary"
                : "text-dex-text-secondary hover:bg-dex-bg-highlight hover:text-dex-text-primary"
            } ${isOpen ? "" : "hidden"}`
          }
        >
          <span className="mr-3 w-5 text-center">🚀</span>
          <span className={`${isOpen ? "" : "hidden"}`}>Pump.fun Tokens</span>
        </NavLink>
        <NavLink
          to="/portfolio"
          className={({ isActive }) =>
            `flex items-center px-4 py-2.5 text-sm rounded transition-colors ${
              isActive
                ? "bg-dex-bg-highlight text-dex-text-primary"
                : "text-dex-text-secondary hover:bg-dex-bg-highlight hover:text-dex-text-primary"
            } ${isOpen ? "" : "hidden"}`
          }
        >
          <span className="mr-3 w-5 text-center">💼</span>
          <span className={`${isOpen ? "" : "hidden"}`}>Portfolio</span>
        </NavLink>
        <div
          className={`flex flex-col items-center ml-3 py-4 gap-4 ${
            isOpen ? "hidden" : ""
          }`}
        >
          <span className="w-5 cursor-pointer" onClick={() => navigate("/")}>
            📈
          </span>
          <span
            className="w-5 cursor-pointer"
            onClick={() => navigate("/pumpfun")}
          >
            🚀
          </span>
          <span
            className="w-5 cursor-pointer"
            onClick={() => navigate("/portfolio")}
          >
            💼
          </span>
        </div>
      </nav>
    </div>
  );
};

export default NavigationMenu;
