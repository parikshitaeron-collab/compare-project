"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import SearchIcon from "./SearchIcon";
import { useCatalogFilters } from "@/components/specduel/catalog-filters-context";
import type { CompareApiData } from "@/types/compare";
import { filterByNameQuery } from "@/lib/catalog-filter";

export { CatalogFiltersProvider, useCatalogFilters } from "@/components/specduel/catalog-filters-context";
export type { CatalogFiltersContextValue } from "@/components/specduel/catalog-filters-context";

// ── Step 2: phone selector + compare ──

type Props = {
  onCompareSuccess: (data: CompareApiData) => void;
};

export default function SelectorSection({ onCompareSuccess }: Props) {
  const {
    searchQuery,
    setSearchQuery,
    filteredCatalog,
    comparePhoneA,
    comparePhoneB,
    setComparePhoneA,
    setComparePhoneB,
    registerExecuteCompare,
    catalogSectionRef,
    setCompareBusy,
  } = useCatalogFilters();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDropA, setOpenDropA] = useState(false);
  const [openDropB, setOpenDropB] = useState(false);

  useEffect(() => {
    setError(null);
  }, [comparePhoneA, comparePhoneB]);

  const runCompare = useCallback(async () => {
    const a = comparePhoneA.trim();
    const b = comparePhoneB.trim();
    setError(null);
    if (!a || !b) {
      setError("Enter both phones to compare.");
      return;
    }
    if (a.toLowerCase() === b.toLowerCase()) {
      setError("Choose two different phones.");
      return;
    }

    setLoading(true);
    setCompareBusy(true);
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneA: a, phoneB: b }),
      });
      const json = (await res.json()) as {
        success?: boolean;
        error?: string;
        data?: CompareApiData;
      };
      if (!json.success) {
        setError(json.error || "Comparison failed.");
        return;
      }
      if (json.data) onCompareSuccess(json.data);
    } catch {
      setError("Network error — could not reach the server.");
    } finally {
      setLoading(false);
      setCompareBusy(false);
    }
  }, [comparePhoneA, comparePhoneB, onCompareSuccess, setCompareBusy]);

  useEffect(() => {
    registerExecuteCompare(() => runCompare());
    return () => registerExecuteCompare(null);
  }, [registerExecuteCompare, runCompare]);

  const suggestionsA = useMemo(
    () => filterByNameQuery(filteredCatalog, comparePhoneA, 8),
    [filteredCatalog, comparePhoneA],
  );
  const suggestionsB = useMemo(
    () => filterByNameQuery(filteredCatalog, comparePhoneB, 8),
    [filteredCatalog, comparePhoneB],
  );

  const pickA = useCallback(
    (name: string) => {
      setComparePhoneA(name);
      setOpenDropA(false);
    },
    [setComparePhoneA],
  );

  const pickB = useCallback(
    (name: string) => {
      setComparePhoneB(name);
      setOpenDropB(false);
    },
    [setComparePhoneB],
  );

  return (
    <section
      className="selector-section"
      id="catalog-selector"
      ref={catalogSectionRef}
    >
      <div className="step-badge">
        <div className="step-num">2</div> Select Phones to Compare
      </div>

      <div className="glass" style={{ marginBottom: 14, padding: "14px 18px" }}>
        <div
          className="budget-header"
          style={{ marginBottom: 10 }}
        >
          <div className="budget-icon-wrap">
            <SearchIcon />
          </div>
          <span className="budget-hdr-text">
            Catalog search — narrows phones for slots below
          </span>
        </div>
        <div className="search-wrap">
          <span className="search-ico">
            <SearchIcon />
          </span>
          <input
            type="text"
            className="phone-input"
            placeholder="Filter by phone name…"
            autoComplete="off"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Filter phone catalog by name"
          />
        </div>
      </div>

      <div className="glass selector-grid">
        <div className="phone-slot">
          <div className="slot-header">
            <div className="slot-num">01</div>
            <span className="slot-title">First Device</span>
            <span
              className={`slot-fill-chip${comparePhoneA.trim() ? " show" : ""}`}
              style={{ opacity: comparePhoneA.trim() ? 1 : 0.5 }}
            >
              ✓ Set
            </span>
          </div>
          <div className="search-wrap">
            <span className="search-ico">
              <SearchIcon />
            </span>
            <input
              type="text"
              className={`phone-input${comparePhoneA.trim() ? " chosen" : ""}`}
              placeholder="Search smartphone…"
              autoComplete="off"
              value={comparePhoneA}
              onChange={(e) => {
                setComparePhoneA(e.target.value);
                setOpenDropA(true);
              }}
              onFocus={() => setOpenDropA(true)}
              onBlur={() => {
                window.setTimeout(() => setOpenDropA(false), 150);
              }}
              disabled={loading}
              aria-label="First phone name"
              aria-controls="slot-a-suggestions"
            />
            <button
              className={`clear-x${comparePhoneA ? " show" : ""}`}
              type="button"
              onClick={() => setComparePhoneA("")}
              disabled={loading}
              aria-label="Clear first phone"
            >
              ✕
            </button>
            <ul
              id="slot-a-suggestions"
              className={`drop${openDropA ? " open" : ""}`}
            >
              {openDropA && suggestionsA.length === 0 ? (
                <li className="empty">No matches in current filters</li>
              ) : null}
              {openDropA
                ? suggestionsA.map((p) => (
                    <li
                      key={p.id}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => pickA(p.name)}
                    >
                      {p.name}
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        <div className="vs-col">
          <div className="vs-line" />
          <div className="vs-chip">VS</div>
          <div className="vs-line" />
        </div>
        <div className="phone-slot">
          <div className="slot-header">
            <div className="slot-num">02</div>
            <span className="slot-title">Second Device</span>
            <span
              className={`slot-fill-chip${comparePhoneB.trim() ? " show" : ""}`}
              style={{ opacity: comparePhoneB.trim() ? 1 : 0.5 }}
            >
              ✓ Set
            </span>
          </div>
          <div className="search-wrap">
            <span className="search-ico">
              <SearchIcon />
            </span>
            <input
              type="text"
              className={`phone-input${comparePhoneB.trim() ? " chosen" : ""}`}
              placeholder="Search smartphone…"
              autoComplete="off"
              value={comparePhoneB}
              onChange={(e) => {
                setComparePhoneB(e.target.value);
                setOpenDropB(true);
              }}
              onFocus={() => setOpenDropB(true)}
              onBlur={() => {
                window.setTimeout(() => setOpenDropB(false), 150);
              }}
              disabled={loading}
              aria-label="Second phone name"
              aria-controls="slot-b-suggestions"
            />
            <button
              className={`clear-x${comparePhoneB ? " show" : ""}`}
              type="button"
              onClick={() => setComparePhoneB("")}
              disabled={loading}
              aria-label="Clear second phone"
            >
              ✕
            </button>
            <ul
              id="slot-b-suggestions"
              className={`drop${openDropB ? " open" : ""}`}
            >
              {openDropB && suggestionsB.length === 0 ? (
                <li className="empty">No matches in current filters</li>
              ) : null}
              {openDropB
                ? suggestionsB.map((p) => (
                    <li
                      key={p.id}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => pickB(p.name)}
                    >
                      {p.name}
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 20,
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
        }}
      >
        <button
          type="button"
          className="budget-find-btn"
          onClick={() => void runCompare()}
          disabled={loading}
          aria-busy={loading}
          style={{ minWidth: 200 }}
        >
          <span>{loading ? "Comparing..." : "Compare"}</span>
          {!loading ? <span>→</span> : null}
        </button>
        {error ? (
          <span
            className="modal-err show"
            style={{ flex: "1 1 220px", margin: 0 }}
          >
            {error}
          </span>
        ) : null}
      </div>
    </section>
  );
}
