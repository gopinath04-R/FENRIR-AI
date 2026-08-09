import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "./AuthContext.jsx";


const ThemeContext = createContext(null);


export const themeOptions = [
  {
    id: "silver",
    name: "Silver Night",
    color: "#d8dde6",
  },
  {
    id: "violet",
    name: "Royal Violet",
    color: "#9b7cff",
  },
  {
    id: "cyan",
    name: "Cyber Cyan",
    color: "#35d9ff",
  },
  {
    id: "gold",
    name: "Obsidian Gold",
    color: "#f5c85b",
  },
  {
    id: "emerald",
    name: "Emerald Dark",
    color: "#4ade80",
  },
  {
    id: "rose",
    name: "Rose Neon",
    color: "#ff6f91",
  },
];


const DEFAULT_THEME = "silver";
const DEFAULT_CUSTOM_COLOR = "#9b7cff";


function getSafeUserId(user) {
  const value =
    user?.id ||
    user?.email ||
    "guest";

  return String(value).replace(
    /[^a-zA-Z0-9_-]/g,
    "_"
  );
}


function getStorageKeys(user) {
  const id = getSafeUserId(user);

  return {
    theme: `fenrir_theme_${id}`,
    customColor: `fenrir_custom_color_${id}`,
    sidebar: `fenrir_sidebar_collapsed_${id}`,
  };
}


function normalizeHex(hex) {
  let value = String(hex || "")
    .trim()
    .replace("#", "");

  if (value.length === 3) {
    value = value
      .split("")
      .map((char) => char + char)
      .join("");
  }

  if (!/^[0-9a-fA-F]{6}$/.test(value)) {
    return DEFAULT_CUSTOM_COLOR;
  }

  return `#${value}`;
}


function hexToRgb(hex) {
  const clean = normalizeHex(hex).slice(1);

  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}


function mixColor(hex, target, amount) {
  const source = hexToRgb(hex);

  const targetRgb =
    target === "white"
      ? { r: 255, g: 255, b: 255 }
      : { r: 0, g: 0, b: 0 };

  const mix = (value, destination) =>
    Math.round(
      value +
        (destination - value) * amount
    );

  return `rgb(
    ${mix(source.r, targetRgb.r)},
    ${mix(source.g, targetRgb.g)},
    ${mix(source.b, targetRgb.b)}
  )`;
}


function getPresetColor(themeId) {
  return (
    themeOptions.find(
      (item) => item.id === themeId
    )?.color || themeOptions[0].color
  );
}


export function ThemeProvider({ children }) {
  const { user } = useAuth();

  const storageKeys = useMemo(
    () => getStorageKeys(user),
    [user?.id, user?.email]
  );


  const [theme, setThemeState] =
    useState(DEFAULT_THEME);

  const [customColor, setCustomColorState] =
    useState(DEFAULT_CUSTOM_COLOR);

  const [
    sidebarCollapsed,
    setSidebarCollapsed,
  ] = useState(false);


  useEffect(() => {
    const savedTheme =
      localStorage.getItem(
        storageKeys.theme
      );

    const savedColor =
      localStorage.getItem(
        storageKeys.customColor
      );

    const savedSidebar =
      localStorage.getItem(
        storageKeys.sidebar
      );

    setThemeState(
      savedTheme || DEFAULT_THEME
    );

    setCustomColorState(
      normalizeHex(
        savedColor ||
          DEFAULT_CUSTOM_COLOR
      )
    );

    setSidebarCollapsed(
      savedSidebar === "true"
    );
  }, [
    storageKeys.theme,
    storageKeys.customColor,
    storageKeys.sidebar,
  ]);


  const activeAccent =
    theme === "custom"
      ? normalizeHex(customColor)
      : getPresetColor(theme);


  useEffect(() => {
    const root =
      document.documentElement;

    const rgb =
      hexToRgb(activeAccent);

    const strong =
      mixColor(
        activeAccent,
        "white",
        0.22
      );

    const soft =
      mixColor(
        activeAccent,
        "black",
        0.16
      );


    root.dataset.fenrirTheme =
      theme;

    root.setAttribute(
      "data-fenrir-theme",
      theme
    );


    root.style.setProperty(
      "--accent",
      activeAccent
    );

    root.style.setProperty(
      "--accent-strong",
      strong
    );

    root.style.setProperty(
      "--accent-soft",
      soft
    );

    root.style.setProperty(
      "--accent-rgb",
      `${rgb.r}, ${rgb.g}, ${rgb.b}`
    );


    root.style.setProperty(
      "--accent-05",
      `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05)`
    );

    root.style.setProperty(
      "--accent-08",
      `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08)`
    );

    root.style.setProperty(
      "--accent-12",
      `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`
    );

    root.style.setProperty(
      "--accent-18",
      `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.18)`
    );

    root.style.setProperty(
      "--accent-25",
      `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`
    );

    root.style.setProperty(
      "--accent-40",
      `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.40)`
    );


    localStorage.setItem(
      storageKeys.theme,
      theme
    );
  }, [
    theme,
    activeAccent,
    storageKeys.theme,
  ]);


  useEffect(() => {
    localStorage.setItem(
      storageKeys.customColor,
      normalizeHex(customColor)
    );
  }, [
    customColor,
    storageKeys.customColor,
  ]);


  useEffect(() => {
    localStorage.setItem(
      storageKeys.sidebar,
      String(sidebarCollapsed)
    );
  }, [
    sidebarCollapsed,
    storageKeys.sidebar,
  ]);


  function setTheme(themeId) {
    const valid =
      themeId === "custom" ||
      themeOptions.some(
        (item) =>
          item.id === themeId
      );

    setThemeState(
      valid
        ? themeId
        : DEFAULT_THEME
    );
  }


  function setCustomColor(color) {
    setCustomColorState(
      normalizeHex(color)
    );

    setThemeState("custom");
  }


  function resetTheme() {
    setThemeState(DEFAULT_THEME);

    setCustomColorState(
      DEFAULT_CUSTOM_COLOR
    );
  }


  const value = useMemo(
    () => ({
      theme,
      setTheme,

      customColor,
      setCustomColor,

      activeAccent,

      resetTheme,

      sidebarCollapsed,
      setSidebarCollapsed,

      toggleSidebar: () =>
        setSidebarCollapsed(
          (current) => !current
        ),
    }),
    [
      theme,
      customColor,
      activeAccent,
      sidebarCollapsed,
    ]
  );


  return (
    <ThemeContext.Provider
      value={value}
    >
      {children}
    </ThemeContext.Provider>
  );
}


export function useTheme() {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}