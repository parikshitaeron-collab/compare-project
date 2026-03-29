"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";

import { useCatalogFilters } from "@/components/specduel/catalog-filters-context";
import PhoneImage from "@/components/specduel/PhoneImage";
import { getAiTopPhones, type AiRankedPhone } from "@/lib/ai-recommend";

export default function AiRecommendationSection() {
  const {
    budgetMin,
    budgetMax,
    selectedBrand,
    priorityKeys,
    activeFeatureKey,
  } = useCatalogFilters();

  const [results, setResults] = useState<AiRankedPhone[] | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const loadToken = useRef(0);

  const runAi = useCallback(() => {
    const token = ++loadToken.current;
    setLoadingAi(true);
    setResults(null);
    window.setTimeout(() => {
      if (loadToken.current !== token) return;
      const top = getAiTopPhones({
        budgetMin,
        budgetMax,
        selectedBrand,
        priorityKeys,
        activeFeatureKey,
        limit: 3,
      });
      setResults(top);
      setLoadingAi(false);
    }, 320);
  }, [budgetMin, budgetMax, selectedBrand, priorityKeys, activeFeatureKey]);

  const hint = useMemo(() => {
    const parts: string[] = [];
    parts.push(`Budget ₹${budgetMin.toLocaleString("en-IN")}–₹${budgetMax.toLocaleString("en-IN")}`);
    if (selectedBrand) parts.push(`Brand: ${selectedBrand}`);
    if (activeFeatureKey) parts.push(`Feature filter: ${activeFeatureKey}`);
    if (priorityKeys.length)
      parts.push(`Priorities: ${priorityKeys.join(", ")}`);
    else parts.push("Priorities: balanced");
    return parts.join(" · ");
  }, [budgetMin, budgetMax, selectedBrand, priorityKeys, activeFeatureKey]);

  return (
    <section className="budget-section" style={{ marginTop: 8 }}>
      <div className="glass budget-panel">
        <div className="budget-header">
          <div className="budget-icon-wrap">✨</div>
          <span className="budget-hdr-text">AI recommendation (on-device)</span>
        </div>
        <p
          style={{
            fontSize: "0.82rem",
            color: "var(--t3)",
            marginBottom: 14,
            lineHeight: 1.45,
          }}
        >
          {hint}
        </p>
        <button
          type="button"
          className="budget-find-btn"
          onClick={runAi}
          disabled={loadingAi}
          style={{ marginBottom: loadingAi || results?.length ? 18 : 0 }}
        >
          <span>
            {loadingAi ? "Analyzing…" : "👉 Find Best Phone for Me"}
          </span>
          <span>{loadingAi ? "⏳" : "→"}</span>
        </button>

        {loadingAi ? (
          <p
            className="ai-loading-hint"
            style={{
              fontSize: "0.85rem",
              color: "var(--t3)",
              marginTop: 4,
              animation: "pulse 1.2s ease-in-out infinite",
            }}
          >
            Scoring phones from your budget, brand, and active feature filters…
          </p>
        ) : null}

        {results && results.length > 0 ? (
          <div className="budget-cards-grid ai-rec-grid" style={{ marginTop: 8 }}>
            {results.map((row, i) => (
              <Link
                key={row.phone.id}
                href={`/phone/${row.phone.id}`}
                className={
                  "bpc ai-rec-card" + (i === 0 ? " best-choice" : "")
                }
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  animationDelay: `${i * 0.06}s`,
                  transition:
                    "transform 0.25s cubic-bezier(.4,0,.2,1), box-shadow 0.25s cubic-bezier(.4,0,.2,1)",
                }}
              >
                {i === 0 ? (
                  <div className="best-tag">🤖 AI Recommended</div>
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      zIndex: 10,
                      fontSize: "0.62rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "var(--t4)",
                    }}
                  >
                    #{i + 1}
                  </div>
                )}
                <div className="bpc-img-wrap">
                  <PhoneImage
                    className="bpc-img"
                    src={row.phone.image}
                    alt={row.phone.name}
                  />
                </div>
                <div className="bpc-body">
                  <div className="bpc-name">{row.phone.name}</div>
                  <div className="bpc-price">
                    ₹{row.phone.price.toLocaleString("en-IN")}
                  </div>
                  <div className="bpc-overall">
                    <span className="bpc-overall-lbl">AI match score</span>
                    <span className="bpc-overall-num">
                      {row.aiScore.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : null}

        {results && results.length === 0 ? (
          <p
            className="empty-state-ai"
            style={{
              color: "var(--t4)",
              fontSize: "0.88rem",
              marginTop: 12,
              padding: "14px 16px",
              borderRadius: 12,
              border: "1px dashed var(--border-strong)",
              background: "var(--bg-2)",
            }}
          >
            No phones match your current filters (budget, brand, or feature chip).
            Widen the budget, clear the brand filter, or tap the feature again to
            turn it off.
          </p>
        ) : null}
      </div>
    </section>
  );
}
