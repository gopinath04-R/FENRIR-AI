import {
  BarChart3,
  Eye,
  MousePointerClick,
  Percent,
  Activity,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function Analytics() {
  const navigate = useNavigate();

  const stats = [
    {
      label: "Total impressions",
      value: "148K",
      note: "Search visibility",
      trend: "+12.8%",
      icon: Eye,
    },
    {
      label: "Total clicks",
      value: "24,860",
      note: "Organic visits",
      trend: "+18.4%",
      icon: MousePointerClick,
    },
    {
      label: "Average CTR",
      value: "4.8%",
      note: "Clicks from impressions",
      trend: "+1.3%",
      icon: Percent,
    },
    {
      label: "Conversions",
      value: "1,284",
      note: "Completed goals",
      trend: "+9.6%",
      icon: Activity,
    },
  ];

  const chartData = [38, 54, 48, 70, 63, 82, 76];

  return (
    <section className="pv3-page">
      <div className="pv3-container">
        <div className="pv3-page-header">
          <div>
            <p className="pv3-eyebrow">FENRIR ANALYTICS</p>

            <h1 className="pv3-title">
              Understand what drives your growth.
            </h1>

            <p className="pv3-subtitle">
              Review traffic, impressions, clicks, CTR and conversion
              performance from one focused dashboard.
            </p>
          </div>

          <div className="pv3-header-actions">
            <select className="pv3-select" defaultValue="30">
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>

            <button type="button" className="pv3-secondary-btn">
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>
        </div>

        <div className="pv3-metric-grid">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.label} className="pv3-metric-card">
                <div className="pv3-metric-top">
                  <div className="pv3-icon-box">
                    <Icon size={18} />
                  </div>

                  <span className="pv3-trend">{item.trend}</span>
                </div>

                <p className="pv3-metric-label">{item.label}</p>

                <div className="pv3-metric-value">
                  <strong>{item.value}</strong>
                </div>

                <p className="pv3-stat-note">{item.note}</p>
              </article>
            );
          })}
        </div>

        <div className="pv3-dashboard-main-grid">
          <article className="pv3-card pv3-growth-card">
            <div className="pv3-card-header">
              <div>
                <p className="pv3-card-kicker">PERFORMANCE TREND</p>
                <h2>Traffic and engagement</h2>
              </div>

              <BarChart3 size={19} />
            </div>

            <div className="pv3-chart-shell">
              <div className="pv3-chart-grid-lines">
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className="pv3-bar-chart">
                {chartData.map((height, index) => (
                  <div key={index} className="pv3-bar-column">
                    <div
                      className="pv3-bar"
                      style={{ height: `${height}%` }}
                    />

                    <span>
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="pv3-card pv3-insight-card">
            <div className="pv3-large-icon">
              <Activity size={22} />
            </div>

            <p className="pv3-card-kicker">FENRIR INSIGHT</p>

            <h2>Performance insights appear here.</h2>

            <p>
              Connect real search and analytics data to identify traffic
              changes, CTR drops and conversion opportunities.
            </p>

            <button
              type="button"
              className="pv3-link-btn pv3-insight-link"
              onClick={() => navigate("/seo")}
            >
              Open SEO Intelligence
              <ArrowUpRight size={15} />
            </button>
          </article>
        </div>
      </div>
    </section>
  );
}