// ─────────────────────────────────────────────────────────────
//  lib/utils.js  —  Response helpers + middleware
// ─────────────────────────────────────────────────────────────

// ── Standard JSON response senders ───────────────────────────

export function sendSuccess(res, data, statusCode = 200) {
  return res.status(statusCode).json({ success: true, ...data });
}

export function sendError(res, message, statusCode = 400) {
  return res.status(statusCode).json({ success: false, error: message });
}

// ── Method guard ──────────────────────────────────────────────

/**
 * Ensures the request method matches one of the allowed methods.
 * Returns true when the check passes so handlers can do early returns cleanly.
 *
 * Usage:
 *   if (!allowMethods(req, res, ["GET"])) return;
 */
export function allowMethods(req, res, methods = []) {
  if (methods.includes(req.method)) return true;
  res.setHeader("Allow", methods);
  sendError(res, `Method ${req.method} not allowed. Use: ${methods.join(", ")}.`, 405);
  return false;
}

// ── CORS headers (handy if frontend is on a different origin) ─

export function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

// ── Bearer token extractor ────────────────────────────────────

/**
 * Reads the Authorization header and returns the raw token string.
 * Returns null if the header is missing or malformed.
 */
export function extractToken(req) {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer ")) return null;
  return auth.slice(7).trim() || null;
}

// ── Simple input sanitiser ────────────────────────────────────

/** Strip leading/trailing whitespace from all string values in an object */
export function trimBody(obj = {}) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v])
  );
}
