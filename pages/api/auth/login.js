// ─────────────────────────────────────────────────────────────
//  pages/api/auth/login.js
//  POST /api/auth/login
//
//  Body: { email, password }
//
//  Returns: { success, user, token }
//    Store the token in localStorage / a cookie on the frontend
//    and send it as  Authorization: Bearer <token>  on every
//    request that needs identity (favorites, etc.).
// ─────────────────────────────────────────────────────────────

import { loginUser }                               from "../../../lib/store.js";
import { allowMethods, sendSuccess, sendError,
         setCors, trimBody }                       from "../../../lib/utils.js";

export default function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (!allowMethods(req, res, ["POST"])) return;

  try {
    const { email, password } = trimBody(req.body || {});

    const result = loginUser({ email, password });

    if (!result.success) {
      // Use 401 for auth failures so the frontend can distinguish them
      return sendError(res, result.error, 401);
    }

    return sendSuccess(res, {
      message: `Welcome back, ${result.user.name}!`,
      user:    result.user,
      token:   result.token,
    });
  } catch (err) {
    console.error("[POST /api/auth/login]", err);
    return sendError(res, "Login failed.", 500);
  }
}
