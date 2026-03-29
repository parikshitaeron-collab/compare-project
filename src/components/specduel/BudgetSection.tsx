"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import PhoneImage from "@/components/specduel/PhoneImage";
import { useCatalogFilters } from "@/components/specduel/catalog-filters-context";
import { BRANDS } from "@/data/brands";
import type { CatalogPhone } from "@/lib/catalog-filter";

const PRESETS = [
  { id: "p0", label: "Under ₹15K", min: 0, max: 15000 },
  { id: "p1", label: "₹15K – ₹25K", min: 15000, max: 25000 },
  { id: "p2", label: "₹25K – ₹45K", min: 25000, max: 45000 },
  { id: "p3", label: "₹45K – ₹80K", min: 45000, max: 80000 },
  { id: "p4", label: "₹80K+", min: 80000, max: 999999 },
] as const;

function MiniScoreRow({
  label,
  val,
  fillClass,
}: {
  label: string;
  val: number;
  fillClass: string;
}) {
  const pct = (val / 10) * 100;
  return (
    <div className="bpc-score-row">
      <span className="bpc-score-label">{label}</span>
      <div className="bpc-track">
        <div
          className={`bpc-fill ${fillClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="bpc-val">{val.toFixed(1)}</span>
    </div>
  );
}

function BudgetPhoneCard({
  phone,
  index,
  comparePhoneA,
  comparePhoneB,
  setComparePhoneA,
  setComparePhoneB,
}: {
  phone: CatalogPhone;
  index: number;
  comparePhoneA: string;
  comparePhoneB: string;
  setComparePhoneA: (v: string) => void;
  setComparePhoneB: (v: string) => void;
}) {
  const router = useRouter();
  const inA = comparePhoneA === phone.name;
  const inB = comparePhoneB === phone.name;
  const isBest = index === 0;
  const perf = phone.scores.performance;
  const cam = phone.scores.camera;
  const batt = phone.scores.battery;
  const overall = phone.scores.overall.toFixed(1);
  const specs = phone.specs;

  return (
    <div
      className={
        "bpc" +
        (isBest ? " best-choice" : "") +
        (inA ? " in-slot-a" : "") +
        (inB ? " in-slot-b" : "")
      }
      style={{ animationDelay: `${index * 0.055}s`, cursor: "pointer" }}
      role="link"
      tabIndex={0}
      onClick={() => router.push(`/phone/${phone.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(`/phone/${phone.id}`);
        }
      }}
    >
      {isBest ? <div className="best-tag">⭐ Best Match</div> : null}
      <div className="bpc-img-wrap">
        <PhoneImage
          className="bpc-img"
          src={phone.image}
          alt={phone.name}
        />
      </div>
      <div className="bpc-body">
        <div className="bpc-name">{phone.name}</div>
        <div className="bpc-price">
          ₹{phone.price.toLocaleString("en-IN")}
        </div>
        {specs ? (
          <div className="bpc-specs">
            <span className="bpc-spec">💾 {specs.ram}</span>
            <span className="bpc-spec">📷 {specs.camera}</span>
            <span className="bpc-spec">🔋 {specs.battery}</span>
          </div>
        ) : null}
        <MiniScoreRow label="Perf" val={perf} fillClass="fill-perf" />
        <MiniScoreRow label="Camera" val={cam} fillClass="fill-camera" />
        <MiniScoreRow label="Battery" val={batt} fillClass="fill-battery" />
        <div className="bpc-overall">
          <span className="bpc-overall-lbl">Overall Score</span>
          <span className="bpc-overall-num">{overall}</span>
        </div>
      </div>
      <div
        className="bpc-actions"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={`bpc-slot-btn${inA ? " filled-a" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setComparePhoneA(inA ? "" : phone.name);
          }}
        >
          {inA ? "✓ Slot A" : "+ Slot A"}
        </button>
        <button
          type="button"
          className={`bpc-slot-btn${inB ? " filled-b" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setComparePhoneB(inB ? "" : phone.name);
          }}
        >
          {inB ? "✓ Slot B" : "+ Slot B"}
        </button>
      </div>
    </div>
  );
}

export default function BudgetSection() {
  const {
    setBudgetRange,
    setActiveFeatureKey,
    budgetResultsQuery,
    setBudgetResultsQuery,
    showBudgetResults,
    setShowBudgetResults,
    selectedBrand,
    setSelectedBrand,
    budgetGridPhones,
    comparePhoneA,
    comparePhoneB,
    setComparePhoneA,
    setComparePhoneB,
    runRegisteredCompare,
    catalogSectionRef,
  } = useCatalogFilters();

  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [budgetInputFlash, setBudgetInputFlash] = useState(false);
  const [maxBudgetField, setMaxBudgetField] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);
  const didScrollRef = useRef(false);

  const applyPreset = useCallback(
    (id: (typeof PRESETS)[number]["id"], min: number, max: number) => {
      setActiveFeatureKey(null);
      setBudgetResultsQuery("");
      setBudgetRange(min, max);
      setActivePresetId(id);
      setShowBudgetResults(true);
      setMaxBudgetField(max >= 999999 ? "" : String(max));
    },
    [
      setActiveFeatureKey,
      setBudgetResultsQuery,
      setBudgetRange,
      setShowBudgetResults,
    ],
  );

  const onFindPhones = useCallback(() => {
    const val = parseInt(maxBudgetField.replace(/,/g, ""), 10);
    if (!val || val < 1000) {
      setBudgetInputFlash(true);
      window.setTimeout(() => setBudgetInputFlash(false), 1200);
      return;
    }
    setActivePresetId(null);
    setActiveFeatureKey(null);
    setBudgetResultsQuery("");
    setBudgetRange(0, val);
    setShowBudgetResults(true);
  }, [
    maxBudgetField,
    setActiveFeatureKey,
    setBudgetResultsQuery,
    setBudgetRange,
    setShowBudgetResults,
  ]);

  useEffect(() => {
    if (!showBudgetResults) return;
    if (didScrollRef.current) return;
    didScrollRef.current = true;
    const t = window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
    return () => window.clearTimeout(t);
  }, [showBudgetResults]);

  const countLabel =
    budgetGridPhones.length === 0
      ? "0 results"
      : `${budgetGridPhones.length} phone${budgetGridPhones.length !== 1 ? "s" : ""} found`;

  const compareReady = Boolean(
    comparePhoneA.trim() && comparePhoneB.trim(),
  );

  const onBudgetCompare = useCallback(async () => {
    catalogSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    if (compareReady) await runRegisteredCompare();
  }, [catalogSectionRef, compareReady, runRegisteredCompare]);

  const placeholder =
    budgetInputFlash
      ? "Enter at least ₹1,000"
      : "Enter your max budget…";

  return (
    <section className="budget-section">
      <div className="step-badge">
        <div className="step-num">1</div> Set Your Budget
      </div>
      <div className="glass budget-panel">
        <div className="budget-header">
          <div className="budget-icon-wrap">₹</div>
          <span className="budget-hdr-text">
            Price Range — Find phones that fit your pocket
          </span>
        </div>
        <div className="budget-presets">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`bp-btn${activePresetId === p.id ? " active" : ""}`}
              onClick={() => applyPreset(p.id, p.min, p.max)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <label
            htmlFor="brandFilter"
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--t4)",
            }}
          >
            Brand filter
          </label>
          <select
            id="brandFilter"
            className="budget-input"
            style={{ maxWidth: 240, paddingLeft: 14 }}
            value={selectedBrand ?? ""}
            onChange={(e) =>
              setSelectedBrand(e.target.value ? e.target.value : null)
            }
          >
            <option value="">All brands</option>
            {BRANDS.map((b) => (
              <option key={b.slug} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div className="budget-input-row">
          <div className="budget-input-wrap">
            <span className="budget-prefix">₹</span>
            <input
              type="number"
              className="budget-input"
              placeholder={placeholder}
              min={1000}
              max={999999}
              value={maxBudgetField}
              onChange={(e) => setMaxBudgetField(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onFindPhones();
              }}
              style={
                budgetInputFlash
                  ? { borderColor: "#ef4444" }
                  : undefined
              }
              aria-invalid={budgetInputFlash}
            />
          </div>
          <button
            className="budget-find-btn"
            type="button"
            onClick={onFindPhones}
          >
            <span>Find Phones</span>
            <span>→</span>
          </button>
        </div>
      </div>

      <div
        className="budget-results"
        ref={resultsRef}
        hidden={!showBudgetResults}
      >
        <div className="budget-results-top">
          <div className="budget-results-headline-row">
            <h2>Phones in Your Budget</h2>
            <span className="budget-count">{countLabel}</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div className="budget-search-wrap">
              <span className="budget-search-ico">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </span>
              <input
                type="text"
                className="budget-search-input"
                placeholder="Search in results…"
                autoComplete="off"
                value={budgetResultsQuery}
                onChange={(e) => setBudgetResultsQuery(e.target.value)}
              />
            </div>
            <button
              type="button"
              className={`budget-compare-btn${compareReady ? " ready" : ""}`}
              onClick={() => void onBudgetCompare()}
            >
              <span>⚡ Compare Now</span>
            </button>
          </div>
        </div>
        <div className="slot-indicators">
          <div className="slot-indicator">
            <div className="slot-indicator-dot" />
            <span>
              Slot A — {comparePhoneA.trim() || "empty"}
            </span>
          </div>
          <div className="slot-indicator">
            <div className="slot-indicator-dot" />
            <span>
              Slot B — {comparePhoneB.trim() || "empty"}
            </span>
          </div>
        </div>
        <div className="budget-cards-grid">
          {budgetGridPhones.length === 0 ? (
            <div
              className="budget-empty"
              style={{ gridColumn: "1 / -1" }}
            >
              <div className="budget-empty-icon">🔍</div>
              <p>
                No phones found.
                <br />
                Try adjusting your budget or search.
              </p>
            </div>
          ) : (
            budgetGridPhones.map((phone, index) => (
              <BudgetPhoneCard
                key={phone.id}
                phone={phone}
                index={index}
                comparePhoneA={comparePhoneA}
                comparePhoneB={comparePhoneB}
                setComparePhoneA={setComparePhoneA}
                setComparePhoneB={setComparePhoneB}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
