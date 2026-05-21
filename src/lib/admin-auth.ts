import crypto from "crypto";

// Secret used to sign session tokens.
// Set ADMIN_SECRET in Vercel env vars for production.
// Falls back to a default so local dev works with zero config.
const SECRET = process.env.ADMIN_SECRET ?? "wcm-admin-local-secret";

export const ADMIN_COOKIE = "wcm_admin_session";
const TTL_MS = 24 * 60 * 60 * 1000; // 24 h

// ── Create a signed session token ────────────────────────────────────────────
export function createToken(username: string): string {
  const payload = Buffer.from(
    JSON.stringify({ u: username, t: Date.now() })
  ).toString("base64url");

  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("base64url");

  return `${payload}.${sig}`;
}

// ── Verify a token and return true if valid and not expired ──────────────────
export function verifyToken(token: string): boolean {
  try {
    const dot = token.lastIndexOf(".");
    if (dot === -1) return false;

    const payload = token.slice(0, dot);
    const sig     = token.slice(dot + 1);

    const expectedSig = crypto
      .createHmac("sha256", SECRET)
      .update(payload)
      .digest("base64url");

    // Constant-time comparison to prevent timing attacks
    if (
      sig.length !== expectedSig.length ||
      !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))
    ) {
      return false;
    }

    const { t } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return Date.now() - t < TTL_MS;
  } catch {
    return false;
  }
}
