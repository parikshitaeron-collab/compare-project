// ─────────────────────────────────────────────────────────────
//  pages/api/auth/signup.js
//  POST /api/auth/signup
//
//  Body: { name, email, password }
//
//  Returns: { success, user, token }
//    • user  → { id, name, email, createdAt }
//    • token → bearer token for subsequent authenticated requests
// ─────────────────────────────────────────────────────────────

import { createUser }                              from "../../../lib/store.js";
import { allowMethods, sendSuccess, sendError,
         setCors, trimBody }                       from "../../../lib/utils.js";

export default function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (!allowMethods(req, res, ["POST"])) return;

  try {
    const { name, email, password } = trimBody(req.body || {});

    const result = createUser({ name, email, password });

    if (!result.success) return sendError(res, result.error, 422);

    // Re-fetch token that was generated during createUser
    const { users } = globalThis.__specDuelStore;
    const stored    = users.find((u) => u.email === email.toLowerCase().trim());

    return sendSuccess(res, {
      message: "Account created successfully. You are now signed in.",
      user:    result.user,
      token:   stored?.token ?? null,
    }, 201);
  } catch (err) {
    console.error("[POST /api/auth/signup]", err);
    return sendError(res, "Signup failed.", 500);
  }
}
