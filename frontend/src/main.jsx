import React from "react";
import ReactDOM from "react-dom/client";

import {
  GoogleOAuthProvider,
} from "@react-oauth/google";

import App from "./App.jsx";

import {
  AuthProvider,
} from "./context/AuthContext.jsx";

import {
  ThemeProvider,
} from "./context/ThemeContext.jsx";

import "./index.css";


const googleClientId =
  import.meta.env
    .VITE_GOOGLE_CLIENT_ID;


if (!googleClientId) {
  console.error(
    "VITE_GOOGLE_CLIENT_ID missing in frontend/.env"
  );
}


ReactDOM.createRoot(
  document.getElementById(
    "root"
  )
).render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId={
        googleClientId
      }
    >
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);