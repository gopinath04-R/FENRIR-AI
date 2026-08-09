import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000,
});


export const chat = (
  message,
  language = "English",
  history = []
) => {
  return api.post("/api/chat/", {
    message,
    language,
    history,
  });
};


export const analyzeImage = ({
  image,
  prompt,
  language = "English",
}) => {
  const formData = new FormData();

  formData.append("image", image);

  formData.append(
    "prompt",
    prompt || "Analyze this image."
  );

  formData.append(
    "language",
    language
  );

  return api.post(
    "/api/chat/image",
    formData,
    {
      timeout: 180000,
    }
  );
};


export const checkBackend = () => {
  return api.get("/api/health");
};


export default api;