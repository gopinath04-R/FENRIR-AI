import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Image,
  Search,
  Sparkles,
} from "lucide-react";

const workflowSteps = [
  {
    title: "Ask Fenrir",
    description:
      "Start with a question, idea, coding problem or business requirement.",
    icon: Bot,
  },
  {
    title: "Generate Assets",
    description:
      "Create images, content concepts and useful AI-assisted outputs.",
    icon: Image,
  },
  {
    title: "Analyze Performance",
    description:
      "Review SEO and analytics data before making decisions.",
    icon: Search,
  },
  {
    title: "Take Action",
    description:
      "Use Fenrir insights to improve your project and workflow.",
    icon: Sparkles,
  },
];

function Workflow() {
  return (
    <section className="workflow-page">
      <div className="workflow-header">
        <div>
          <p className="eyebrow">FENRIR WORKFLOW</p>

          <h1>Move from idea to action.</h1>

          <p>
            A simple AI-powered workflow for planning, creating,
            analyzing and improving your work.
          </p>
        </div>

        <div className="workflow-status">
          <CheckCircle2 size={18} />
          Workflow Engine Ready
        </div>
      </div>

      <div className="workflow-grid">
        {workflowSteps.map((step, index) => {
          const Icon = step.icon;

          return (
            <article className="workflow-card" key={step.title}>
              <div className="workflow-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="workflow-icon">
                <Icon size={23} />
              </div>

              <h2>{step.title}</h2>

              <p>{step.description}</p>

              {index < workflowSteps.length - 1 && (
                <ArrowRight
                  className="workflow-arrow"
                  size={20}
                />
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Workflow;