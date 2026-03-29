"use client";

import { useCatalogFilters } from "@/components/specduel/catalog-filters-context";

const PRIORITIES = [
  { key: "gaming", icon: "🎮", label: "Gaming" },
  { key: "camera", icon: "📸", label: "Camera" },
  { key: "daily", icon: "📱", label: "Daily Use" },
  { key: "battery", icon: "🔋", label: "Battery" },
] as const;

const LABEL: Record<string, string> = {
  gaming: "Gaming",
  camera: "Camera",
  daily: "Daily Use",
  battery: "Battery",
};

export default function PrioritySection() {
  const { priorityKeys, togglePriority } = useCatalogFilters();

  return (
    <section className="priority-section">
      <div className="step-badge">
        <div className="step-num">3</div> Set Your Priorities
      </div>
      <div className="glass priority-panel">
        <div className="priority-header">
          <div className="priority-title">
            What matters to you? — Select all that apply
          </div>
          <span className="priority-hint">Multi-select · Combines weights</span>
        </div>
        <p className="priority-desc">
          Selecting multiple priorities blends their scoring weights for a more
          personalised verdict. Ordering of phones in your budget list updates
          instantly. None selected = balanced weights.
        </p>
        <div className="priority-grid">
          {PRIORITIES.map((item) => {
            const active = priorityKeys.includes(item.key);
            return (
              <button
                key={item.key}
                type="button"
                className={`p-btn${active ? " active" : ""}`}
                aria-pressed={active}
                onClick={() => togglePriority(item.key)}
              >
                <span className="p-icon">{item.icon}</span>
                <span className="p-label">{item.label}</span>
                <div className="p-check">✓</div>
              </button>
            );
          })}
        </div>
        <div className="priority-active-tags" id="priorityTags">
          {priorityKeys.length === 0 ? (
            <span
              style={{
                fontSize: "0.72rem",
                color: "var(--t4)",
              }}
            >
              Balanced (performance / camera / battery weighted equally)
            </span>
          ) : (
            priorityKeys.map((k) => (
              <span
                key={k}
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: "#eff6ff",
                  border: "1px solid rgba(37,99,235,.35)",
                  color: "var(--a1)",
                }}
              >
                {LABEL[k] ?? k}
              </span>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
