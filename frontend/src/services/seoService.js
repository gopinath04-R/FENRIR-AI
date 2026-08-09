const API_URL = "http://127.0.0.1:8000/api/seo/analyze";

export async function analyzeSeo(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text();

    throw new Error(
      message || `SEO request failed: ${response.status}`
    );
  }

  return response.json();
}