import { API_URL } from '../api/client';

/** Reescribe URLs guardadas con localhost hacia la API configurada en producción. */
export function resolveMediaUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  return url.replace(/^https?:\/\/localhost(?::\d+)?/, API_URL);
}
