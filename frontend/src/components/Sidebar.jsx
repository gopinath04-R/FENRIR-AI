import {
  LayoutDashboard,
  Bot,
  Image,
  Search,
  ChartNoAxesCombined,
  FileText,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
} from "lucide-react";

import {
  NavLink,
} from "react-router-dom";

import {
  useTheme,
} from "../context/ThemeContext.jsx";

const menu = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Fenrir Assistant",
    path: "/assistant",
    icon: Bot,
  },
  {
    name: "Image Studio",
    path: "/image-studio",
    icon: Image,
  },
  {
    name: "SEO Intelligence",
    path: "/seo",
    icon: Search,
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: ChartNoAxesCombined,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: FileText,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
  } = useTheme();

  return (
    <aside
      className={
        sidebarCollapsed
          ? "new-sidebar new-sidebar-collapsed"
          : "new-sidebar"
      }
    >
      <div className="new-sidebar-top">
        <div className="new-brand">
          <div className="new-brand-icon">
            <Bot size={21} />
          </div>

          {!sidebarCollapsed && (
            <div className="new-brand-text">
              <strong>FENRIR AI</strong>
              <span>
                Intelligence Platform
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          className="sidebar-collapse-btn"
          onClick={() =>
            setSidebarCollapsed(
              !sidebarCollapsed
            )
          }
          title={
            sidebarCollapsed
              ? "Open sidebar"
              : "Close sidebar"
          }
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>
      </div>

      <div className="sidebar-divider" />

      <nav className="new-sidebar-nav">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              title={
                sidebarCollapsed
                  ? item.name
                  : undefined
              }
              className={({ isActive }) =>
                isActive
                  ? "new-nav-item active"
                  : "new-nav-item"
              }
            >
              <Icon size={19} />

              {!sidebarCollapsed && (
                <span>
                  {item.name}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-system">
        <div className="sidebar-system-dot" />

        {!sidebarCollapsed && (
          <div>
            <strong>
              Fenrir Core Online
            </strong>

            <span>
              All systems operational
            </span>
          </div>
        )}

        {!sidebarCollapsed && (
          <ShieldCheck size={16} />
        )}
      </div>
    </aside>
  );
}