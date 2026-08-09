import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Outlet,
} from "react-router-dom";

import {
  Bell,
  ChevronDown,
  LogOut,
  Palette,
  UserRound,
} from "lucide-react";

import {
  GoogleLogin,
} from "@react-oauth/google";

import Sidebar from "../components/Sidebar.jsx";

import {
  useTheme,
  themeOptions,
} from "../context/ThemeContext.jsx";

import {
  useAuth,
} from "../context/AuthContext.jsx";

import "../styles/layout-v3.css";

export default function MainLayout() {
  const {
    theme,
    setTheme,
    sidebarCollapsed,
  } = useTheme();

  const {
    user,
    googleLogin,
    logout,
  } = useAuth();

  const [
    accountOpen,
    setAccountOpen,
  ] = useState(false);

  const [
    loginOpen,
    setLoginOpen,
  ] = useState(false);

  const accountRef = useRef(null);

  useEffect(() => {
    function closeMenus(event) {
      if (
        accountRef.current &&
        !accountRef.current.contains(
          event.target
        )
      ) {
        setAccountOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      closeMenus
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        closeMenus
      );
  }, []);

  return (
    <div
      className="fenrir-shell"
      data-fenrir-theme={theme}
    >
      <Sidebar />

      <div
        className={
          sidebarCollapsed
            ? "fenrir-main sidebar-small"
            : "fenrir-main"
        }
      >
        <header className="new-topbar">
          <div className="topbar-page-brand">
            <span>FENRIR AI</span>
          </div>

          <div className="topbar-actions">
            <div className="topbar-theme">
              <Palette size={15} />

              <select
                value={theme}
                onChange={(event) =>
                  setTheme(
                    event.target.value
                  )
                }
              >
                {themeOptions.map(
                  (option) => (
                    <option
                      key={option.id}
                      value={option.id}
                    >
                      {option.name}
                    </option>
                  )
                )}
              </select>
            </div>

            <button
              type="button"
              className="topbar-icon-btn"
              title="Notifications"
            >
              <Bell size={18} />
            </button>

            {!user ? (
              <>
                <button
                  type="button"
                  className="signin-btn"
                  onClick={() =>
                    setLoginOpen(true)
                  }
                >
                  <UserRound size={17} />
                  Sign in
                </button>

                {loginOpen && (
                  <div
                    className="google-login-overlay"
                    onClick={() =>
                      setLoginOpen(false)
                    }
                  >
                    <div
                      className="google-login-modal"
                      onClick={(event) =>
                        event.stopPropagation()
                      }
                    >
                      <div className="login-logo">
                        <UserRound size={24} />
                      </div>

                      <span className="login-kicker">
                        FENRIR AI
                      </span>

                      <h2>
                        Welcome to Fenrir
                      </h2>

                      <p>
                        Continue with your Google
                        account to personalize your
                        workspace.
                      </p>

                      <div className="google-button-wrap">
                        <GoogleLogin
                          onSuccess={(
                            credentialResponse
                          ) => {
                            const result =
                              googleLogin(
                                credentialResponse
                                  .credential
                              );

                            if (result) {
                              setLoginOpen(
                                false
                              );
                            }
                          }}
                          onError={() => {
                            console.error(
                              "Google Login Failed"
                            );
                          }}
                          useOneTap={false}
                          theme="filled_black"
                          shape="pill"
                          size="large"
                          text="continue_with"
                        />
                      </div>

                      <button
                        type="button"
                        className="login-cancel"
                        onClick={() =>
                          setLoginOpen(false)
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div
                className="user-account"
                ref={accountRef}
              >
                <button
                  type="button"
                  className="user-account-btn"
                  onClick={() =>
                    setAccountOpen(
                      (value) => !value
                    )
                  }
                >
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                    />
                  ) : (
                    <div className="profile-placeholder">
                      {user.name
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>
                  )}

                  <div className="user-account-text">
                    <strong>
                      {user.name}
                    </strong>

                    <span>
                      Google Account
                    </span>
                  </div>

                  <ChevronDown
                    size={16}
                  />
                </button>

                {accountOpen && (
                  <div className="account-dropdown">
                    <div className="account-dropdown-profile">
                      {user.picture ? (
                        <img
                          src={user.picture}
                          alt=""
                        />
                      ) : (
                        <div className="dropdown-avatar">
                          {user.name
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                      <div>
                        <strong>
                          {user.name}
                        </strong>

                        <span>
                          {user.email}
                        </span>
                      </div>
                    </div>

                    <div className="account-dropdown-line" />

                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setAccountOpen(false);
                      }}
                    >
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        <main className="new-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}