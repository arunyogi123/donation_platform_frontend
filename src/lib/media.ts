import { API_BASE_URL } from './api';

export const DEFAULT_CAMPAIGN_IMAGE = '/src/assets/images/campaign_health_maya_1790232042675.jpg';

/**
 * Normalizes image and document URLs returned by the backend or local assets.
 * Ensures:
 * 1. Absolute URLs (http://, https://, blob:, data:) are never double-prepended.
 * 2. Vite/frontend local assets (/src/assets/...) are served directly.
 * 3. Relative media paths (/media/... or media/...) are prepended with API_BASE_URL.
 */
export function getMediaUrl(
  url?: string | null,
  fallback: string = DEFAULT_CAMPAIGN_IMAGE
): string {
  if (!url) return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;

  // Masked documents returned for unauthenticated/unauthorized users
  if (trimmed === '**') return '';

  // Already an absolute URL or local blob/data preview
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('data:')
  ) {
    return trimmed;
  }

  // Local Vite frontend assets
  if (trimmed.startsWith('/src/') || trimmed.startsWith('src/')) {
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  }

  // Backend relative media or static URL
  const base = API_BASE_URL.replace(/\/$/, '');
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${base}${cleanPath}`;
}
