"use client";

import { useCallback } from "react";
import { useCatalogFilters } from "@/components/specduel/catalog-filters-context";

const features = [
  {
    feat: "5g",
    icon: "📶",
    iconClass: "",
    label: "5G Phones",
    desc: "Future-ready network",
  },
  {
    feat: "ram8",
    icon: "🧠",
    iconClass: "green",
    label: "8GB & Above RAM",
    desc: "Smooth multitasking",
  },
  {
    feat: "storage256",
    icon: "💾",
    iconClass: "purple",
    label: "256GB+ Storage",
    desc: "Never run out of space",
  },
  {
    feat: "slim",
    icon: "🪄",
    iconClass: "orange",
    label: "Slimmest Phones",
    desc: "Ultra-thin design",
  },
  {
    feat: "120hz",
    icon: "🔄",
    iconClass: "teal",
    label: "120Hz Refresh Rate",
    desc: "Silky smooth display",
  },
  {
    feat: "ai",
    icon: "🤖",
    iconClass: "pink",
    label: "AI Smartphones",
    desc: "Intelligent features",
  },
] as const;

export default function FeaturesSection() {
  const { activeFeatureKey, setActiveFeatureKey } = useCatalogFilters();

  const onFeatClick = useCallback(
    (key: string) => {
      setActiveFeatureKey(activeFeatureKey === key ? null : key);
    },
    [activeFeatureKey, setActiveFeatureKey],
  );

  return (
    <section className="features-section">
      <div className="section-header">
        <span className="section-title">⚡ Mobiles by Popular Features</span>
        <span className="section-sub">Click to filter budget results</span>
      </div>
      <div className="features-grid">
        {features.map((f) => {
          const active = activeFeatureKey === f.feat;
          return (
            <button
              key={f.feat}
              type="button"
              className={`feat-item${active ? " active" : ""}`}
              style={{
                appearance: "none",
                font: "inherit",
                textAlign: "left",
              }}
              onClick={() => onFeatClick(f.feat)}
              aria-pressed={active}
            >
              <div className={`feat-icon ${f.iconClass}`.trim()}>{f.icon}</div>
              <div className="feat-text">
                <div className="feat-label">{f.label}</div>
                <div className="feat-desc">{f.desc}</div>
              </div>
              <span className="feat-arrow">›</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
