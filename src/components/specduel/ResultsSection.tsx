"use client";

import { useEffect, useRef } from "react";

import PhoneImage from "@/components/specduel/PhoneImage";
import type { CompareApiData } from "@/types/compare";

const CAT_LABEL: Record<string, string> = {
  performance: "⚡ Performance",
  camera: "📸 Camera",
  battery: "🔋 Battery",
  overall: "⭐ Overall",
};

type Props = {
  result: CompareApiData | null;
  onReset: () => void;
};

export default function ResultsSection({ result, onReset }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (result && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  if (!result) return null;

  const { phoneA, phoneB, winner, winnerId, verdict, breakdown, priceDiff } = result;
  const winnerA = winnerId === "phoneA";
  const winnerB = winnerId === "phoneB";
  const tie = winnerId === "tie";

  const cheaperLine =
    priceDiff.cheaper === "same"
      ? "Same price tier."
      : priceDiff.cheaper === "phoneA"
        ? `${phoneA.name} is ₹${priceDiff.amount.toLocaleString("en-IN")} less.`
        : `${phoneB.name} is ₹${priceDiff.amount.toLocaleString("en-IN")} less.`;

  const categories = ["performance", "camera", "battery", "overall"] as const;

  return (
    <section className="results" ref={sectionRef}>
      <div className="results-headline">
        <h2>Comparison Results</h2>
        <p>Based on server scoring</p>
      </div>

      <div className="cards-row">
        <div className={`phone-card${winnerA ? " winner" : ""}`}>
          <div className="card-img-wrap">
            <PhoneImage
              className="card-img"
              src={phoneA.image}
              alt={phoneA.name}
            />
            <span className="img-fallback" style={{ display: "none" }} aria-hidden>
              📱
            </span>
          </div>
          <div className="card-top">
            <div className="card-num">01</div>
            <div className="card-title">{phoneA.name}</div>
          </div>
          <div>
            <div className="score-row">
              <div className="row-meta">
                <span className="row-lbl">💰 Price</span>
                <span className="row-val">
                  ₹{phoneA.price.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
            <div className="score-row">
              <div className="row-meta">
                <span className="row-lbl">⚡ Performance</span>
                <span className="row-val">{phoneA.scores.performance}</span>
              </div>
            </div>
            <div className="score-row">
              <div className="row-meta">
                <span className="row-lbl">📸 Camera</span>
                <span className="row-val">{phoneA.scores.camera}</span>
              </div>
            </div>
            <div className="score-row">
              <div className="row-meta">
                <span className="row-lbl">🔋 Battery</span>
                <span className="row-val">{phoneA.scores.battery}</span>
              </div>
            </div>
          </div>
          <div className={`winner-tag${winnerA ? " show" : ""}`}>🏆 Winner</div>
        </div>

        <div className={`phone-card${winnerB ? " winner" : ""}`}>
          <div className="card-img-wrap">
            <PhoneImage
              className="card-img"
              src={phoneB.image}
              alt={phoneB.name}
            />
            <span className="img-fallback" style={{ display: "none" }} aria-hidden>
              📱
            </span>
          </div>
          <div className="card-top">
            <div className="card-num">02</div>
            <div className="card-title">{phoneB.name}</div>
          </div>
          <div>
            <div className="score-row">
              <div className="row-meta">
                <span className="row-lbl">💰 Price</span>
                <span className="row-val">
                  ₹{phoneB.price.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
            <div className="score-row">
              <div className="row-meta">
                <span className="row-lbl">⚡ Performance</span>
                <span className="row-val">{phoneB.scores.performance}</span>
              </div>
            </div>
            <div className="score-row">
              <div className="row-meta">
                <span className="row-lbl">📸 Camera</span>
                <span className="row-val">{phoneB.scores.camera}</span>
              </div>
            </div>
            <div className="score-row">
              <div className="row-meta">
                <span className="row-lbl">🔋 Battery</span>
                <span className="row-val">{phoneB.scores.battery}</span>
              </div>
            </div>
          </div>
          <div className={`winner-tag${winnerB ? " show" : ""}`}>🏆 Winner</div>
        </div>
      </div>

      <div className="score-strip">
        <div className="score-big-card">
          <div className="score-big-name">{phoneA.name}</div>
          <div className="score-big-num">
            {breakdown.overall.phoneAScore.toFixed(1)}
          </div>
          <div className="score-big-sub">Overall Score / 10</div>
        </div>
        <div className="score-big-card">
          <div className="score-big-name">{phoneB.name}</div>
          <div className="score-big-num">
            {breakdown.overall.phoneBScore.toFixed(1)}
          </div>
          <div className="score-big-sub">Overall Score / 10</div>
        </div>
      </div>

      <div className="winner-banner">
        <div className="winner-trophy">🏆</div>
        <div className="winner-text">
          <h3>
            Winner: {tie ? "Tie" : winner}
          </h3>
          <p>{verdict}</p>
        </div>
      </div>

      <div className="insight-card">
        <div className="insight-header">
          <div className="insight-icon-wrap">✦</div>
          <span className="insight-hdr-text">Category breakdown</span>
        </div>
        <div className="insight-grid">
          {categories.map((key) => {
            const b = breakdown[key];
            return (
              <div key={key} className="insight-block">
                <div className="ib-name">{CAT_LABEL[key]}</div>
                <div className="ib-line">
                  {phoneA.name}: {b.phoneAScore}/10 · {phoneB.name}:{" "}
                  {b.phoneBScore}/10
                </div>
                <span className="ib-tag good">{b.summary}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="prediction-card">
        <div className="pred-title">
          <span>💰</span> Price comparison
        </div>
        <div id="predRows">
          <div className="pred-row">
            <span className="pred-phone">Price</span>
            <span className="pred-line">{cheaperLine}</span>
          </div>
        </div>
      </div>

      <div className="reset-wrap">
        <button
          className="reset-btn"
          type="button"
          onClick={onReset}
        >
          ← Compare Different Phones
        </button>
      </div>
    </section>
  );
}
