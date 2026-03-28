// ─────────────────────────────────────────────────────────────
//  pages/api/phones/search.js
//  GET /api/phones/search
//
//  Query params:
//    q         → search query (searches name, brand, processor,
//                camera, display)
//    brand     → optional extra brand filter
//    tier      → optional tier filter
//    maxPrice  → price ceiling in INR
//    limit     → max results to return (default 10)
// ─────────────────────────────────────────────────────────────

import { PHONES, filterAndSort, fuzzyMatch } from "../../../lib/phones.js";
import { allowMethods, sendSuccess, sendError, setCors } from "../../../lib/utils.js";

export default function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (!allowMethods(req, res, ["GET"])) return;

  try {
    const { q = "", brand, tier, maxPrice, limit = 10 } = req.query;
    const query   = q.trim();
    const maxHits = Math.min(Math.max(Number(limit) || 10, 1), 50);

    // 1. Run text search across key fields
    let results = query
      ? PHONES.filter(
          (p) =>
            fuzzyMatch(p.name,      query) ||
            fuzzyMatch(p.brand,     query) ||
            fuzzyMatch(p.processor, query) ||
            fuzzyMatch(p.camera,    query) ||
            fuzzyMatch(p.display,   query) ||
            fuzzyMatch(p.os,        query)
        )
      : [...PHONES];

    // 2. Apply optional narrowing filters
    results = filterAndSort(results, { brand, tier, maxPrice });

    // 3. Cap results
    const total = results.length;
    results = results.slice(0, maxHits);

    return sendSuccess(res, {
      count: results.length,
      total,
      query,
      data: results,
    });
  } catch (err) {
    console.error("[GET /api/phones/search]", err);
    return sendError(res, "Search failed.", 500);
  }
}
