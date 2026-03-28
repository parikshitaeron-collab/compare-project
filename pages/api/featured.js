// ─────────────────────────────────────────────────────────────
//  pages/api/featured.js
//  GET /api/featured
//
//  Returns three curated phone collections:
//    • flagship  — top-scored tier:"flagship" phones
//    • trending  — phones marked trending:true, sorted by score
//    • budget    — best-scored phones under ₹35,000
//
//  Optional query params:
//    flagshipLimit  (default 6)
//    trendingLimit  (default 6)
//    budgetLimit    (default 6)
//    budgetMax      price ceiling for budget section (default 35000)
// ─────────────────────────────────────────────────────────────

import { PHONES } from "../../lib/phones.js";
import { allowMethods, sendSuccess, sendError, setCors } from "../../lib/utils.js";

export default function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (!allowMethods(req, res, ["GET"])) return;

  try {
    const {
      flagshipLimit = 6,
      trendingLimit = 6,
      budgetLimit   = 6,
      budgetMax     = 35000,
    } = req.query;

    const fLimit = Math.min(Number(flagshipLimit) || 6, 20);
    const tLimit = Math.min(Number(trendingLimit) || 6, 20);
    const bLimit = Math.min(Number(budgetLimit)   || 6, 20);
    const bMax   = Number(budgetMax) || 35000;

    // ── Flagship ─────────────────────────────────────────────
    const flagship = [...PHONES]
      .filter((p) => p.tier === "flagship")
      .sort((a, b) => b.scores.overall - a.scores.overall)
      .slice(0, fLimit);

    // ── Trending ─────────────────────────────────────────────
    const trending = [...PHONES]
      .filter((p) => p.trending === true)
      .sort((a, b) => b.scores.overall - a.scores.overall)
      .slice(0, tLimit);

    // ── Budget ───────────────────────────────────────────────
    const budget = [...PHONES]
      .filter((p) => p.price <= bMax)
      .sort((a, b) => b.scores.overall - a.scores.overall)
      .slice(0, bLimit);

    // ── Editor's pick (single best-value phone) ───────────────
    const editorsPick = [...PHONES]
      .map((p) => ({ ...p, value: p.scores.overall / (p.price / 10000) }))
      .sort((a, b) => b.value - a.value)[0];

    return sendSuccess(res, {
      data: {
        flagship: {
          label:       "🏆 Flagship Phones",
          description: "The absolute best money can buy",
          count:       flagship.length,
          phones:      flagship,
        },
        trending: {
          label:       "🔥 Trending Right Now",
          description: "Most-discussed phones this week",
          count:       trending.length,
          phones:      trending,
        },
        budget: {
          label:       `💸 Best Under ₹${bMax.toLocaleString("en-IN")}`,
          description: "Top performers at an affordable price",
          count:       budget.length,
          phones:      budget,
        },
        editorsPick: {
          label:       "⭐ Editor's Pick",
          description: "Best overall value for money",
          phone:       editorsPick,
        },
      },
    });
  } catch (err) {
    console.error("[GET /api/featured]", err);
    return sendError(res, "Failed to load featured phones.", 500);
  }
}
