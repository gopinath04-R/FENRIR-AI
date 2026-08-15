import { useRef, useState } from "react";
import {
  Upload,
  Search,
  MousePointerClick,
  Percent,
  Sparkles,
  BarChart3,
  FileSpreadsheet,
} from "lucide-react";

export default function SEOIntelligence() {
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState({
    impressions: "—",
    clicks: "—",
    ctr: "—",
    opportunities: "—",
  });

  const [opportunities, setOpportunities] = useState([]);

  async function runAnalysis() {
    if (!file) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "https://fenrir-ai.onrender.com/api/seo/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("SEO analysis failed");
      }

      const data = await response.json();

      setSummary({
        impressions:
          data.total_impressions ??
          data.impressions ??
          "—",
        clicks:
          data.total_clicks ??
          data.clicks ??
          "—",
        ctr:
          data.average_ctr ??
          data.ctr ??
          "—",
        opportunities:
          data.opportunities_count ??
          data.opportunities?.length ??
          "—",
      });

      setOpportunities(
        Array.isArray(data.opportunities)
          ? data.opportunities
          : []
      );
    } catch (error) {
      console.error(error);
      alert("SEO analysis failed. Backend endpoint check pannu bro.");
    } finally {
      setLoading(false);
    }
  }

  const cards = [
    {
      label: "Total impressions",
      value: summary.impressions,
      note: "Search visibility",
      icon: BarChart3,
    },
    {
      label: "Total clicks",
      value: summary.clicks,
      note: "Organic visits",
      icon: MousePointerClick,
    },
    {
      label: "Average CTR",
      value: summary.ctr,
      note: "Clicks from impressions",
      icon: Percent,
    },
    {
      label: "SEO opportunities",
      value: summary.opportunities,
      note: "Priority items",
      icon: Sparkles,
    },
  ];

  return (
    <section className="pv3-page">
      <div className="pv3-container">
        <div className="pv3-page-header">
          <div>
            <p className="pv3-eyebrow">
              FENRIR SEO INTELLIGENCE
            </p>

            <h1 className="pv3-title">
              Turn search data into decisions.
            </h1>

            <p className="pv3-subtitle">
              Upload real Google Search Console CSV
              data and discover impressions, clicks,
              CTR and high-value SEO opportunities.
            </p>
          </div>

          <div className="pv3-status-pill">
            <span />
            SEO engine ready
          </div>
        </div>

        <div className="pv3-seo-grid">
          <article className="pv3-card pv3-upload-card">
            <div className="pv3-section-row">
              <div>
                <p className="pv3-card-kicker">
                  DATA SOURCE
                </p>
                <h2>Upload Search Console CSV</h2>
              </div>

              <FileSpreadsheet size={19} />
            </div>

            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              hidden
              onChange={(e) =>
                setFile(e.target.files?.[0] || null)
              }
            />

            <button
              type="button"
              className="pv3-upload-zone"
              onClick={() => inputRef.current?.click()}
            >
              <div className="pv3-upload-icon">
                <Upload size={22} />
              </div>

              <strong>
                {file ? file.name : "Choose CSV file"}
              </strong>

              <span>
                Recommended columns: Query, Page,
                Clicks, Impressions, CTR and Position.
              </span>

              <small>
                {file ? "Click to replace" : "Click to browse"}
              </small>
            </button>

            <button
              type="button"
              className="pv3-primary-btn pv3-full-btn"
              disabled={!file || loading}
              onClick={runAnalysis}
            >
              <Sparkles size={17} />
              {loading
                ? "Analyzing..."
                : "Run Fenrir Analysis"}
            </button>
          </article>

          <article className="pv3-card pv3-summary-card">
            <div className="pv3-section-row">
              <div>
                <p className="pv3-card-kicker">
                  ANALYSIS SUMMARY
                </p>
                <h2>Search performance</h2>
              </div>

              <BarChart3 size={19} />
            </div>

            <div className="pv3-summary-grid">
              {cards.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="pv3-summary-item"
                  >
                    <div className="pv3-summary-icon">
                      <Icon size={17} />
                    </div>

                    <div>
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                      <small>{item.note}</small>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        </div>

        <article className="pv3-card pv3-opportunity-card">
          <div className="pv3-section-row">
            <div>
              <p className="pv3-card-kicker">
                OPPORTUNITY ENGINE
              </p>
              <h2>Priority SEO opportunities</h2>
            </div>

            <span className="pv3-count-pill">
              {opportunities.length} results
            </span>
          </div>

          {opportunities.length === 0 ? (
            <div className="pv3-empty-opportunity">
              <div className="pv3-empty-icon">
                <Search size={27} />
              </div>

              <h3>No analysis data yet</h3>

              <p>
                Upload a CSV and run the analysis to
                see real SEO opportunities here.
              </p>
            </div>
          ) : (
            <div className="pv3-table-wrap">
              <table className="pv3-table">
                <thead>
                  <tr>
                    <th>Query / Page</th>
                    <th>Issue</th>
                    <th>Priority</th>
                  </tr>
                </thead>

                <tbody>
                  {opportunities.map((item, index) => (
                    <tr key={index}>
                      <td>
                        {item.query ||
                          item.page ||
                          item.keyword ||
                          "Opportunity"}
                      </td>
                      <td>
                        {item.issue ||
                          item.reason ||
                          item.insight ||
                          "Optimization opportunity"}
                      </td>
                      <td>
                        {item.priority ||
                          item.score ||
                          "High"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}