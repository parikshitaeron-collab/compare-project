// ─────────────────────────────────────────────────────────────
//  pages/api/favorites/index.js
//  GET  /api/favorites      → list all favorites
//  POST /api/favorites/add  (handled in add.js)
// ─────────────────────────────────────────────────────────────
//
//  Auth (optional): pass  Authorization: Bearer <token>
//  header to scope favorites to a specific user. Without it,
//  favorites are stored under the "guest" userId.
// ─────────────────────────────────────────────────────────────

import { getFavorites }                             from "../../../lib/store.js";
import { getUserByToken }                           from "../../../lib/store.js";
import { allowMethods, sendSuccess, sendError,
         setCors, extractToken }                    from "../../../lib/utils.js";

export default function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (!allowMethods(req, res, ["GET"])) return;

  try {
    // Resolve caller identity (guest if no valid token)
    const token  = extractToken(req);
    const user   = token ? getUserByToken(token) : null;
    const userId = user ? user.id : null; // null → return ALL for guest session

    const favorites = getFavorites(userId ?? "guest");

    return sendSuccess(res, {
      count: favorites.length,
      userId: user ? user.id : "guest",
      data: favorites,
    });
  } catch (err) {
    console.error("[GET /api/favorites]", err);
    return sendError(res, "Failed to fetch favorites.", 500);
  }
}
