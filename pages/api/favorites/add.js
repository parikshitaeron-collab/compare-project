// ─────────────────────────────────────────────────────────────
//  pages/api/favorites/add.js
//  POST /api/favorites/add
//
//  Body: { phoneId: "samsung-s24-ultra" }
//        OR
//        { phone: { ...full phone object } }
//
//  Auth (optional): Authorization: Bearer <token>
//  Without a token the favorite is saved under "guest".
// ─────────────────────────────────────────────────────────────

import { addFavorite, getUserByToken } from "../../../lib/store.js";
import { findPhone }                   from "../../../lib/phones.js";
import { allowMethods, sendSuccess, sendError,
         setCors, extractToken, trimBody }          from "../../../lib/utils.js";

export default function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (!allowMethods(req, res, ["POST"])) return;

  try {
    const body = trimBody(req.body || {});

    // Resolve phone — accept either a full object or just an id/name
    let phone = body.phone || null;
    if (!phone && body.phoneId) {
      phone = findPhone(body.phoneId);
    }
    if (!phone) {
      return sendError(res, 'Provide "phoneId" (string) or "phone" (object) in the request body.');
    }
    if (!phone.id || !phone.name) {
      return sendError(res, "Phone object must include at least an id and name.");
    }

    // Resolve user identity
    const token  = extractToken(req);
    const user   = token ? getUserByToken(token) : null;
    const userId = user ? user.id : "guest";

    const result = addFavorite({ phone, userId });

    if (!result.success) return sendError(res, result.error, 409);

    return sendSuccess(res, {
      message:  `${phone.name} added to favorites.`,
      favorite: result.favorite,
    }, 201);
  } catch (err) {
    console.error("[POST /api/favorites/add]", err);
    return sendError(res, "Failed to add favorite.", 500);
  }
}
