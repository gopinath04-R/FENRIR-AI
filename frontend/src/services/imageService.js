const API_BASE_URL = "https://fenrir-ai.onrender.com";

export async function generateImage({
  prompt,
  style = "Cinematic",
  ratio = "1:1",
  quality = 80,
}) {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      style,
      ratio,
      quality,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Image API error:", data);

    throw new Error(
      data?.detail ||
      data?.message ||
      "Image generation failed"
    );
  }

  return data;
}