import { API_URL } from '../api/client';

/** Usa URLs de API, data URLs o blob tal cual vienen del backend. */
export function resolveMediaUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('data:') || url.includes('blob.vercel-storage.com')) {
    return url;
  }
  return url.replace(/^https?:\/\/localhost(?::\d+)?/, API_URL);
}
