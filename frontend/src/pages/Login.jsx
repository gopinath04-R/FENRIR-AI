import { GoogleLogin } from "@react-oauth/google";
import { Bot, ShieldCheck, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { googleLogin } = useAuth();

  function handleSuccess(response) {
    if (!response?.credential) return;

    const user = googleLogin(response.credential);

    if (user) {
      navigate("/", { replace: true });
    }
  }

  return (
    <section className="fenrir-login-page">
      <div className="fenrir-login-glow glow-one" />
      <div className="fenrir-login-glow glow-two" />

      <div className="fenrir-login-card">
        <div className="fenrir-login-logo">
          <Bot size={28} />
        </div>

        <p className="fenrir-login-kicker">FENRIR AI</p>

        <h1>Intelligence starts here.</h1>

        <p className="fenrir-login-subtitle">
          Sign in with Google to access your AI assistant,
          image studio, SEO intelligence and analytics workspace.
        </p>

        <div className="fenrir-login-features">
          <div>
            <Sparkles size={16} />
            AI workspace
          </div>

          <div>
            <ShieldCheck size={16} />
            Secure Google sign-in
          </div>
        </div>

        <div className="fenrir-google-login">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => {
              console.error("Google login failed");
            }}
            theme="filled_black"
            size="large"
            shape="pill"
            text="continue_with"
            width="320"
          />
        </div>

        <p className="fenrir-login-footer">
          Continue securely with your Google account.
        </p>
      </div>
    </section>
  );
}