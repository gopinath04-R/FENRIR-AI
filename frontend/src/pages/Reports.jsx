import { useState } from "react";
import {
  FileText,
  Presentation,
  BarChart3,
  BriefcaseBusiness,
  Sparkles,
  Download,
} from "lucide-react";

export default function Reports() {
  const [selectedType, setSelectedType] = useState("seo");
  const [title, setTitle] = useState("SEO Intelligence Report");
  const [period, setPeriod] = useState("30");
  const [language, setLanguage] = useState("English");

  const reportTypes = [
    {
      id: "seo",
      title: "SEO Intelligence",
      description:
        "Search performance, content gaps and keyword opportunities.",
      format: "PDF",
      icon: Sparkles,
    },
    {
      id: "executive",
      title: "Executive Summary",
      description:
        "A concise business overview for clients and stakeholders.",
      format: "PDF",
      icon: BriefcaseBusiness,
    },
    {
      id: "presentation",
      title: "Performance Presentation",
      description:
        "Presentation-ready insights and recommendations.",
      format: "PPT",
      icon: Presentation,
    },
    {
      id: "analytics",
      title: "Analytics Report",
      description:
        "Traffic, impressions, CTR and conversion performance.",
      format: "PDF",
      icon: BarChart3,
    },
  ];

  const current = reportTypes.find((item) => item.id === selectedType);

  return (
    <section className="pv3-page">
      <div className="pv3-container">
        <div className="pv3-page-header">
          <div>
            <p className="pv3-eyebrow">
              FENRIR REPORT STUDIO
            </p>

            <h1 className="pv3-title">
              Turn intelligence into clear reports.
            </h1>

            <p className="pv3-subtitle">
              Build professional reports and presentation-ready
              summaries using insights from your Fenrir workspace.
            </p>
          </div>

          <div className="pv3-status-pill">
            <span />
            Report engine ready
          </div>
        </div>

        <div className="pv3-reports-grid">
          <article className="pv3-card pv3-reports-builder">
            <div className="pv3-section-row">
              <div>
                <p className="pv3-card-kicker">
                  REPORT TYPE
                </p>
                <h2>Select your output</h2>
              </div>

              <FileText size={19} />
            </div>

            <div className="pv3-report-type-grid">
              {reportTypes.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={
                      selectedType === item.id
                        ? "pv3-report-option active"
                        : "pv3-report-option"
                    }
                    onClick={() => setSelectedType(item.id)}
                  >
                    <div className="pv3-report-option-icon">
                      <Icon size={18} />
                    </div>

                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.description}</span>
                    </div>

                    <small>{item.format}</small>
                  </button>
                );
              })}
            </div>

            <div className="pv3-report-form-grid">
              <div className="pv3-field">
                <label>Report title</label>

                <input
                  className="pv3-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="pv3-field">
                <label>Time period</label>

                <select
                  className="pv3-select pv3-select-full"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                </select>
              </div>

              <div className="pv3-field">
                <label>Language</label>

                <select
                  className="pv3-select pv3-select-full"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option>English</option>
                  <option>Tamil</option>
                  <option>Hindi</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              className="pv3-primary-btn pv3-report-generate"
            >
              <Sparkles size={17} />
              Generate Report
            </button>
          </article>

          <article className="pv3-card pv3-report-preview-card">
            <div className="pv3-section-row">
              <div>
                <p className="pv3-card-kicker">
                  PREVIEW
                </p>
                <h2>{current?.title}</h2>
              </div>

              <button
                type="button"
                className="pv3-icon-btn"
                title="Download"
              >
                <Download size={16} />
              </button>
            </div>

            <div className="pv3-report-sheet">
              <div className="pv3-report-brand">
                <div>F</div>

                <div>
                  <strong>FENRIR AI</strong>
                  <span>INTELLIGENCE REPORT</span>
                </div>
              </div>

              <p className="pv3-card-kicker">
                {current?.title.toUpperCase()}
              </p>

              <h3>{title}</h3>

              <p className="pv3-report-meta">
                Prepared for Gopinath R • Last {period} days • {language}
              </p>

              <div className="pv3-report-preview-box">
                <FileText size={30} />

                <strong>Report preview is ready</strong>

                <span>
                  Select your options and generate the report to view
                  the final content here.
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}