"use client";

import { useCatalogFilters } from "@/components/specduel/catalog-filters-context";

export default function FloatingCompare() {
  const {
    comparePhoneA,
    comparePhoneB,
    runRegisteredCompare,
    compareBusy,
  } = useCatalogFilters();

  const ready = Boolean(
    comparePhoneA.trim() && comparePhoneB.trim(),
  );
  const short = (s: string) => {
    const t = s.trim();
    if (t.length <= 22) return t || "—";
    return `${t.slice(0, 20)}…`;
  };

  return (
    <div
      className={`floating-compare${ready ? " visible" : ""}`}
      aria-hidden={!ready}
    >
      <button
        className={`compare-btn-float${compareBusy ? " loading" : ""}`}
        type="button"
        disabled={!ready || compareBusy}
        onClick={() => void runRegisteredCompare()}
      >
        <span className="btn-spinner" aria-hidden />
        <div className="float-phone-chips">
          <span className="fpc">{short(comparePhoneA)}</span>
          <span className="fpc-vs">vs</span>
          <span className="fpc">{short(comparePhoneB)}</span>
        </div>
        <span className="btn-label">
          {compareBusy ? "Comparing…" : "⚡ Compare Now"}
        </span>
      </button>
    </div>
  );
}
