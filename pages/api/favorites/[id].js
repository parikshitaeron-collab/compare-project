// ─────────────────────────────────────────────────────────────
//  pages/api/favorites/[id].js
//  DELETE /api/favorites/:id
//
//  URL param: id → the favorite record ID (not the phone ID)
//  Auth (optional): Authorization: Bearer <token>
// ─────────────────────────────────────────────────────────────

import { removeFavorite, getUserByToken } from "../../../lib/store.js";
import { allowMethods, sendSuccess, sendError,
         setCors, extractToken }          from "../../../lib/utils.js";

export default function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (!allowMethods(req, res, ["DELETE"])) return;

  try {
    const { id } = req.query;
    if (!id) return sendError(res, "Favorite ID is required.");

    // Resolve user identity
    const token  = extractToken(req);
    const user   = token ? getUserByToken(token) : null;
    const userId = user ? user.id : "guest";

    const result = removeFavorite(id, userId);

    if (!result.success) return sendError(res, result.error, 404);

    return sendSuccess(res, {
      message: `${result.removed.phoneName} removed from favorites.`,
      removed: result.removed,
    });
  } catch (err) {
    console.error(`[DELETE /api/favorites/:id]`, err);
    return sendError(res, "Failed to remove favorite.", 500);
  }
}
