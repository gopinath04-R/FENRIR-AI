import { Bell, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

import {
  themeOptions,
  useTheme,
} from "../context/ThemeContext";

const pageNames = {
  "/": "Dashboard",
  "/assistant": "Fenrir Assistant",
  "/image-studio": "Image Studio",
  "/seo": "SEO Intelligence",
  "/analytics": "Analytics",
  "/reports": "Reports",
  "/settings": "Settings",
  "/workflow": "Workflow",
};

function Navbar({ openMobileMenu }) {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const pageName =
    pageNames[location.pathname] || "Fenrir AI";

  return (
    <header className="fenrir-navbar clean-navbar">
      <button
        type="button"
        className="mobile-menu-button"
        onClick={openMobileMenu}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <div className="navbar-page-title">
        <span>FENRIR AI</span>
        <strong>{pageName}</strong>
      </div>

      <div className="navbar-right">
        <select
          className="theme-select"
          value={theme}
          onChange={(event) =>
            setTheme(event.target.value)
          }
        >
          {themeOptions.map((item) => (
            <option
              key={item.id}
              value={item.id}
            >
              {item.name}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="navbar-icon-button"
          title="Notifications"
        >
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}

export default Navbar;