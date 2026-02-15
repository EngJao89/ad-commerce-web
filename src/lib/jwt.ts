/**
 * Decodes JWT payload without verification (client-side only, for reading user id).
 * Returns numeric `sub` or `id` if present, otherwise null.
 */
export function getUserIdFromToken(token: string): number | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    if (!payload) return null;
    const decoded = atob(payload.replaceAll('-', '+').replaceAll('_', '/'));
    const parsed = JSON.parse(decoded) as { sub?: number | string; id?: number };
    const raw = parsed.sub ?? parsed.id;
    if (raw == null) return null;
    const n = typeof raw === 'number' ? raw : Number.parseInt(String(raw), 10);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}
