import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

const STORAGE_KEY = "fenrir_google_user";

function getSavedUser() {
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "null"
    );
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser);

  function googleLogin(credential) {
    try {
      const data = jwtDecode(credential);

      const account = {
        id: data.sub,
        name:
          data.name ||
          data.given_name ||
          "Fenrir User",
        firstName:
          data.given_name || "",
        email:
          data.email || "",
        picture:
          data.picture || "",
      };

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(account)
      );

      setUser(account);

      return account;
    } catch (error) {
      console.error(
        "Google login decode error:",
        error
      );

      return null;
    }
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);

    setUser(null);

    window.google?.accounts?.id?.disableAutoSelect?.();
  }

  const value = useMemo(
    () => ({
      user,
      googleLogin,
      logout,
      isLoggedIn: Boolean(user),
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}