import { useEffect, useMemo, useState } from "react";
import {
  Download,
  Image as ImageIcon,
  RotateCcw,
  Sparkles,
  WandSparkles,
} from "lucide-react";

export default function ImageStudio() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Cinematic");
  const [ratio, setRatio] = useState("1:1");
  const [quality, setQuality] = useState(80);

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const styles = [
    "Realistic",
    "Cinematic",
    "Anime",
    "3D Render",
    "Digital Art",
    "Logo",
  ];

  const ratios = [
    "1:1",
    "4:5",
    "16:9",
    "9:16",
  ];

  const canGenerate = useMemo(() => {
    return prompt.trim().length > 2 && !loading;
  }, [prompt, loading]);

  useEffect(() => {
    return () => {
      if (imageUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  async function handleGenerate() {
    if (!canGenerate) return;

    try {
      setLoading(true);
      setError("");

      if (imageUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }

      setImageUrl("");

      const response = await fetch(
        "http://127.0.0.1:8000/generate",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            prompt: prompt.trim(),
            style,
            ratio,
            aspect_ratio: ratio,
            quality,
          }),
        }
      );

      if (!response.ok) {
        let errorMessage = `Image generation failed (${response.status})`;

        try {
          const errorData = await response.json();

          errorMessage =
            errorData?.detail ||
            errorData?.message ||
            errorMessage;
        } catch {
          const text = await response.text();

          if (text) {
            errorMessage = text;
          }
        }

        throw new Error(errorMessage);
      }

      const contentType =
        response.headers.get("content-type") || "";

      /*
        CASE 1:
        Backend directly returns PNG/JPEG binary
      */
      if (
        contentType.includes("image/") ||
        contentType.includes("octet-stream")
      ) {
        const blob = await response.blob();

        const url = URL.createObjectURL(blob);

        setImageUrl(url);

        return;
      }

      /*
        CASE 2:
        Sometimes backend returns PNG bytes
        without correct content-type.
        Check response as ArrayBuffer.
      */
      if (
        !contentType.includes("application/json")
      ) {
        const buffer = await response.arrayBuffer();

        const bytes = new Uint8Array(buffer);

        const isPNG =
          bytes.length > 8 &&
          bytes[0] === 137 &&
          bytes[1] === 80 &&
          bytes[2] === 78 &&
          bytes[3] === 71;

        const isJPEG =
          bytes.length > 3 &&
          bytes[0] === 255 &&
          bytes[1] === 216 &&
          bytes[2] === 255;

        if (isPNG || isJPEG) {
          const blob = new Blob(
            [buffer],
            {
              type: isPNG
                ? "image/png"
                : "image/jpeg",
            }
          );

          const url =
            URL.createObjectURL(blob);

          setImageUrl(url);

          return;
        }

        throw new Error(
          "Backend response is not a valid image."
        );
      }

      /*
        CASE 3:
        Backend returns JSON containing URL/base64
      */
      const data = await response.json();

      console.log(
        "Image API JSON response:",
        data
      );

      const result =
        data?.image_url ||
        data?.imageUrl ||
        data?.url ||
        data?.image ||
        data?.result ||
        data?.output ||
        data?.data ||
        "";

      if (!result) {
        throw new Error(
          "Image was generated but no image data was returned."
        );
      }

      /*
        BASE64 support
      */
      if (
        typeof result === "string" &&
        !result.startsWith("http") &&
        !result.startsWith("blob:") &&
        !result.startsWith("data:")
      ) {
        setImageUrl(
          `data:image/png;base64,${result}`
        );
      } else {
        setImageUrl(result);
      }
    } catch (err) {
      console.error(
        "Image generation error:",
        err
      );

      setError(
        err?.message ||
        "Image generation failed."
      );
    } finally {
      setLoading(false);
    }
  }

  function resetStudio() {
    if (imageUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(imageUrl);
    }

    setPrompt("");
    setStyle("Cinematic");
    setRatio("1:1");
    setQuality(80);
    setImageUrl("");
    setError("");
  }

  async function downloadImage() {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);

      const blob = await response.blob();

      const downloadUrl =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = downloadUrl;

      link.download =
        `fenrir-${Date.now()}.png`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(
        downloadUrl
      );
    } catch (err) {
      console.error(
        "Download failed:",
        err
      );
    }
  }

  return (
    <section className="pv3-page">
      <div className="pv3-container">

        <div className="pv3-page-header">

          <div>
            <p className="pv3-eyebrow">
              FENRIR IMAGE STUDIO
            </p>

            <h1 className="pv3-title">
              Create anything you imagine.
            </h1>

            <p className="pv3-subtitle">
              Generate professional wallpapers,
              concepts, posters and creative
              visuals using the Fenrir image
              engine.
            </p>
          </div>

          <div className="pv3-status-pill">
            <span />
            Image engine ready
          </div>

        </div>


        <div className="pv3-studio-grid">

          <article className="pv3-card pv3-studio-panel">

            <div className="pv3-section-row">

              <div>
                <p className="pv3-card-kicker">
                  PROMPT
                </p>

                <h2>
                  Describe your image
                </h2>
              </div>

              <WandSparkles size={19} />

            </div>


            <textarea
              className="pv3-textarea"
              value={prompt}
              onChange={(event) =>
                setPrompt(
                  event.target.value
                )
              }
              placeholder="Example: A futuristic warrior standing in golden armor, cinematic lighting..."
            />


            <div className="pv3-control-block">

              <label>
                Style
              </label>

              <div className="pv3-chip-grid">

                {styles.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setStyle(item)
                    }
                    className={
                      style === item
                        ? "pv3-chip active"
                        : "pv3-chip"
                    }
                  >
                    {item}
                  </button>
                ))}

              </div>

            </div>


            <div className="pv3-control-block">

              <label>
                Aspect ratio
              </label>

              <div className="pv3-ratio-grid">

                {ratios.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setRatio(item)
                    }
                    className={
                      ratio === item
                        ? "pv3-ratio-card active"
                        : "pv3-ratio-card"
                    }
                  >
                    {item}
                  </button>
                ))}

              </div>

            </div>


            <div className="pv3-control-block">

              <div className="pv3-range-header">

                <label>
                  Quality
                </label>

                <strong>
                  {quality}%
                </strong>

              </div>

              <input
                className="pv3-range"
                type="range"
                min="40"
                max="100"
                value={quality}
                onChange={(event) =>
                  setQuality(
                    Number(
                      event.target.value
                    )
                  )
                }
              />

            </div>


            {error && (
              <div className="pv3-error-message">
                {error}
              </div>
            )}


            <button
              type="button"
              className="pv3-primary-btn pv3-full-btn"
              onClick={handleGenerate}
              disabled={!canGenerate}
            >
              <Sparkles size={17} />

              {loading
                ? "Generating..."
                : "Generate Image"}
            </button>

          </article>


          <article className="pv3-card pv3-preview-panel">

            <div className="pv3-section-row">

              <div>
                <p className="pv3-card-kicker">
                  PREVIEW
                </p>

                <h2>
                  Generated result
                </h2>
              </div>


              {imageUrl && (
                <button
                  type="button"
                  className="pv3-icon-btn"
                  onClick={resetStudio}
                  title="Reset"
                >
                  <RotateCcw size={16} />
                </button>
              )}

            </div>


            <div className="pv3-image-preview">

              {loading ? (
                <div className="pv3-empty-state">

                  <div className="pv3-empty-icon">
                    <Sparkles size={28} />
                  </div>

                  <h3>
                    Fenrir is creating your image...
                  </h3>

                  <p>
                    AI image generation may
                    take a few seconds.
                  </p>

                </div>
              ) : imageUrl ? (
                <img
                  src={imageUrl}
                  alt={prompt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              ) : (
                <div className="pv3-empty-state">

                  <div className="pv3-empty-icon">
                    <ImageIcon size={28} />
                  </div>

                  <h3>
                    Your image will appear here
                  </h3>

                  <p>
                    Enter a clear prompt and press
                    Generate Image.
                  </p>

                </div>
              )}

            </div>


            <div className="pv3-preview-footer">

              <div className="pv3-preview-tags">

                <span>
                  Style: {style}
                </span>

                <span>
                  Ratio: {ratio}
                </span>

                <span>
                  Quality: {quality}%
                </span>

              </div>


              {imageUrl && (
                <button
                  type="button"
                  className="pv3-secondary-btn"
                  onClick={downloadImage}
                >
                  <Download size={15} />

                  Download
                </button>
              )}

            </div>

          </article>

        </div>

      </div>
    </section>
  );
}