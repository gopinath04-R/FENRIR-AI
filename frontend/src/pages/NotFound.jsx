import { Link } from "react-router-dom";
import { Home, ArrowLeft, SearchX } from "lucide-react";

const NotFound = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f0f0f",
        color: "#fff",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          textAlign: "center",
          background: "#181818",
          border: "1px solid #2c2c2c",
          borderRadius: "20px",
          padding: "50px",
        }}
      >
        <SearchX size={70} color="#D6B25E" />

        <h1
          style={{
            fontSize: "70px",
            marginTop: "15px",
            marginBottom: "0",
          }}
        >
          404
        </h1>

        <h2
          style={{
            marginTop: "10px",
          }}
        >
          Page Not Found
        </h2>

        <p
          style={{
            color: "#bdbdbd",
            lineHeight: "1.7",
          }}
        >
          Sorry! The page you are looking for doesn't exist.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            marginTop: "30px",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/"
            style={{
              background: "#D6B25E",
              color: "#111",
              padding: "12px 22px",
              borderRadius: "12px",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "600",
            }}
          >
            <Home size={18} />
            Dashboard
          </Link>

          <button
            onClick={() => window.history.back()}
            style={{
              background: "#222",
              color: "#fff",
              border: "1px solid #444",
              padding: "12px 22px",
              borderRadius: "12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;