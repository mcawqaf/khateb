// Route slug for the supervisor dashboard.
//
// Set VITE_ADMIN_ROUTE at build time (GitHub Actions secret ADMIN_ROUTE) so the
// real slug never appears in this repository. The fallback below is only a
// placeholder for local development.
//
// NOTE: whatever slug is used ends up inside the built JavaScript bundle, which
// every visitor downloads. This hides the dashboard from casual discovery; it is
// not an access control. Real protection requires server-side authentication.

const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};

export const ADMIN_ROUTE = (env.VITE_ADMIN_ROUTE || 'idara-1448-9f3a71').toLowerCase();

/** True when the current location hash matches the dashboard slug exactly. */
export function isAdminRoute(): boolean {
  if (typeof window === 'undefined') return false;
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  return hash === ADMIN_ROUTE;
}

/** Absolute URL of the dashboard, for the "copy link" button. */
export function adminUrl(): string {
  return `${window.location.origin}${window.location.pathname}#${ADMIN_ROUTE}`;
}
