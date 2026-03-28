// ─────────────────────────────────────────────────────────────
//  pages/api/phones/index.js
//  GET /api/phones
//
//  Query params:
//    brand     → filter by brand (case-insensitive)
//    tier      → flagship | premium | mid | budget
//    minPrice  → min price in INR
//    maxPrice  → max price in INR
//    sort      → score (default) | price_asc | price_desc | newest
// ─────────────────────────────────────────────────────────────

import { PHONES, filterAndSort } from "../../../lib/phones.js";
import { allowMethods, sendSuccess, sendError, setCors } from "../../../lib/utils.js";

export default function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (!allowMethods(req, res, ["GET"])) return;

  try {
    const { brand, tier, minPrice, maxPrice, sort } = req.query;
    const phones = filterAndSort(PHONES, { brand, tier, minPrice, maxPrice, sort });

    return sendSuccess(res, {
      count: phones.length,
      filters: { brand, tier, minPrice, maxPrice, sort },
      data: phones,
    });
  } catch (err) {
    console.error("[GET /api/phones]", err);
    return sendError(res, "Failed to fetch phones.", 500);
  }
}
