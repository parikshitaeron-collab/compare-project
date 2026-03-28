// ─────────────────────────────────────────────────────────────
//  pages/api/compare.js
//  POST /api/compare
//
//  Body: { phoneA: "iPhone 15 Pro Max", phoneB: "Galaxy S24 Ultra" }
//
//  Returns a full scored breakdown across performance, camera,
//  battery, and overall, plus a plain-English verdict.
// ─────────────────────────────────────────────────────────────

import { findPhone, scoreDetail } from "../../lib/phones.js";
import { allowMethods, sendSuccess, sendError, setCors } from "../../lib/utils.js";

// ── Category comparison logic ─────────────────────────────────

function compareCategory(a, b, category) {
  const scoreA = a.scores[category];
  const scoreB = b.scores[category];
  const diff   = Math.abs(scoreA - scoreB);

  let winner, winnerName;
  if (diff <= 0.15) {
    winner = "tie"; winnerName = "Tie";
  } else if (scoreA > scoreB) {
    winner = "phoneA"; winnerName = a.name;
  } else {
    winner = "phoneB"; winnerName = b.name;
  }

  return {
    winner,
    winnerName,
    phoneAScore:   scoreA,
    phoneBScore:   scoreB,
    phoneADetail:  scoreDetail(a, category),
    phoneBDetail:  scoreDetail(b, category),
    summary:
      winner === "tie"
        ? `${category.charAt(0).toUpperCase() + category.slice(1)}: Too close to call (${scoreA} vs ${scoreB}).`
        : `${category.charAt(0).toUpperCase() + category.slice(1)}: ${winnerName} leads (${
            winner === "phoneA" ? scoreA : scoreB
          } vs ${winner === "phoneA" ? scoreB : scoreA}).`,
  };
}

// ── Verdict sentence builder ──────────────────────────────────

function buildVerdict(a, b, breakdown, winnerId, margin) {
  const overall = breakdown.overall;
  if (winnerId === "tie") {
    return `${a.name} and ${b.name} are evenly matched with identical overall scores of ${overall.phoneAScore}/10. Choose based on price or design preference.`;
  }

  const winner = winnerId === "phoneA" ? a : b;
  const loser  = winnerId === "phoneA" ? b : a;
  const wScore = winnerId === "phoneA" ? overall.phoneAScore : overall.phoneBScore;
  const lScore = winnerId === "phoneA" ? overall.phoneBScore : overall.phoneAScore;

  // Find categories where winner is strictly better
  const cats     = ["performance", "camera", "battery"];
  const winsIn   = cats.filter((c) => breakdown[c].winner === winnerId);
  const winsText = winsIn.length ? ` It leads on ${winsIn.join(", ")}.` : "";

  const marginText =
    margin === "dominant" ? "dominates"
    : margin === "clear"  ? "clearly beats"
    : "narrowly beats";

  return `${winner.name} ${marginText} ${loser.name} with an overall score of ${wScore} vs ${lScore}.${winsText}`;
}

// ── Route handler ─────────────────────────────────────────────

export default function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (!allowMethods(req, res, ["POST"])) return;

  try {
    const { phoneA: nameA, phoneB: nameB } = req.body || {};

    if (!nameA || !nameB) {
      return sendError(res, 'Request body must include "phoneA" and "phoneB".');
    }
    if (nameA.toLowerCase() === nameB.toLowerCase()) {
      return sendError(res, "Please choose two different phones to compare.");
    }

    const phoneA = findPhone(nameA);
    const phoneB = findPhone(nameB);

    if (!phoneA) return sendError(res, `Phone not found: "${nameA}".`, 404);
    if (!phoneB) return sendError(res, `Phone not found: "${nameB}".`, 404);

    // Build category breakdown
    const breakdown = {
      performance: compareCategory(phoneA, phoneB, "performance"),
      camera:      compareCategory(phoneA, phoneB, "camera"),
      battery:     compareCategory(phoneA, phoneB, "battery"),
      overall:     compareCategory(phoneA, phoneB, "overall"),
    };

    // Determine overall winner
    const diff   = Math.abs(phoneA.scores.overall - phoneB.scores.overall);
    const margin =
      diff > 1.0 ? "dominant"
      : diff > 0.4 ? "clear"
      : "close";

    let winnerId, winnerName;
    if (breakdown.overall.winner === "tie") {
      winnerId   = "tie";
      winnerName = "Tie";
    } else {
      winnerId   = breakdown.overall.winner;
      winnerName = winnerId === "phoneA" ? phoneA.name : phoneB.name;
    }

    const verdict = buildVerdict(phoneA, phoneB, breakdown, winnerId, margin);

    return sendSuccess(res, {
      data: {
        phoneA,
        phoneB,
        winner:   winnerName,
        winnerId,
        margin,
        verdict,
        breakdown,
        priceDiff: {
          amount:   Math.abs(phoneA.price - phoneB.price),
          cheaper:  phoneA.price < phoneB.price ? "phoneA" : phoneA.price > phoneB.price ? "phoneB" : "same",
        },
      },
    });
  } catch (err) {
    console.error("[POST /api/compare]", err);
    return sendError(res, "Comparison failed.", 500);
  }
}
