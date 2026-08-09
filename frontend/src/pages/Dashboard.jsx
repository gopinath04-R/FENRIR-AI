import {
  ArrowUpRight,
  Bot,
  Image,
  Search,
  Activity,
  Sparkles,
  TrendingUp,
  Target,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const now = new Date();
  const hour = now.getHours();

  let greeting = "Hello";

  if (hour < 12) {
    greeting = "Good morning";
  } else if (hour < 17) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  const displayName =
    user?.firstName ||
    user?.name?.split(" ")[0] ||
    "User";

  const metrics = [
    {
      label: "SEO Health",
      value: "84",
      suffix: "/100",
      trend: "+6.2%",
      icon: Search,
    },
    {
      label: "AI Opportunities",
      value: "18",
      trend: "+4 this week",
      icon: Sparkles,
    },
    {
      label: "Predicted Traffic",
      value: "24.8K",
      trend: "+18.4%",
      icon: TrendingUp,
    },
    {
      label: "Fenrir Confidence",
      value: "91",
      suffix: "%",
      trend: "High",
      icon: Target,
    },
  ];

  const chartData = [42, 58, 51, 72, 66, 84, 78];

  return (
    <section className="pv3-page">
      <div className="pv3-container">

        <div className="pv3-page-header">
          <div>
            <p className="pv3-eyebrow">
              FENRIR AI CONTROL CENTER
            </p>

            <h1 className="pv3-title">
              {greeting}, {displayName}.
            </h1>

            <p className="pv3-subtitle">
              Your workspace is ready. Start a new task
              or review your latest intelligence.
            </p>
          </div>

          <button
            type="button"
            className="pv3-primary-btn"
            onClick={() => navigate("/assistant")}
          >
            <Sparkles size={17} />
            New AI Task
          </button>
        </div>

        <div className="pv3-metric-grid">
          {metrics.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.label}
                className="pv3-metric-card"
              >
                <div className="pv3-metric-top">
                  <div className="pv3-icon-box">
                    <Icon size={18} />
                  </div>

                  <span className="pv3-trend">
                    {item.trend}
                  </span>
                </div>

                <p className="pv3-metric-label">
                  {item.label}
                </p>

                <div className="pv3-metric-value">
                  <strong>{item.value}</strong>

                  {item.suffix && (
                    <span>{item.suffix}</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div className="pv3-dashboard-main-grid">
          <article className="pv3-card pv3-growth-card">

            <div className="pv3-card-header">
              <div>
                <p className="pv3-card-kicker">
                  PERFORMANCE
                </p>

                <h2>
                  Growth overview
                </h2>
              </div>

              <button
                type="button"
                className="pv3-link-btn"
                onClick={() => navigate("/analytics")}
              >
                View analytics
                <ArrowUpRight size={15} />
              </button>
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
                  <div
                    key={index}
                    className="pv3-bar-column"
                  >
                    <div
                      className="pv3-bar"
                      style={{
                        height: `${height}%`,
                      }}
                    />

                    <span>
                      {
                        [
                          "Mon",
                          "Tue",
                          "Wed",
                          "Thu",
                          "Fri",
                          "Sat",
                          "Sun",
                        ][index]
                      }
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

            <p className="pv3-card-kicker">
              FENRIR INSIGHT
            </p>

            <h2>
              Focus on high-intent content.
            </h2>

            <p>
              Upload real Google Search Console
              data to identify pages with strong
              impressions and weak click-through
              performance.
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

        <div className="pv3-section-heading">
          <div>
            <p className="pv3-card-kicker">
              QUICK ACTIONS
            </p>

            <h2>
              Start with Fenrir
            </h2>
          </div>
        </div>

        <div className="pv3-action-grid">

          <button
            type="button"
            className="pv3-action-card"
            onClick={() => navigate("/assistant")}
          >
            <div className="pv3-action-icon">
              <Bot size={20} />
            </div>

            <div>
              <strong>
                Ask Fenrir
              </strong>

              <span>
                Chat with your AI intelligence assistant.
              </span>
            </div>

            <ArrowUpRight size={16} />
          </button>

          <button
            type="button"
            className="pv3-action-card"
            onClick={() => navigate("/image-studio")}
          >
            <div className="pv3-action-icon">
              <Image size={20} />
            </div>

            <div>
              <strong>
                Create Image
              </strong>

              <span>
                Generate professional visuals from a simple prompt.
              </span>
            </div>

            <ArrowUpRight size={16} />
          </button>

          <button
            type="button"
            className="pv3-action-card"
            onClick={() => navigate("/seo")}
          >
            <div className="pv3-action-icon">
              <Search size={20} />
            </div>

            <div>
              <strong>
                Analyze SEO
              </strong>

              <span>
                Upload real search data and discover opportunities.
              </span>
            </div>

            <ArrowUpRight size={16} />
          </button>

        </div>

      </div>
    </section>
  );
}