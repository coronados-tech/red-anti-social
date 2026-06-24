import type { ApiError } from '../types';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const AUTH_TOKEN_KEY = 'antisocial-token';

let authToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export function setOnUnauthorized(callback: (() => void) | null) {
  onUnauthorized = callback;
}

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

export function getAuthToken(): string | null {
  if (authToken) return authToken;
  authToken = localStorage.getItem(AUTH_TOKEN_KEY);
  return authToken;
}

export class ApiRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
  }
}

export function withViewerId(url: string, viewerId?: number): string {
  if (viewerId === undefined) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}viewer_id=${viewerId}`;
}

function parseErrorMessage(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined;

  const payload = data as ApiError & {
    errores?: Array<{ atributo?: string; error?: string }>;
  };

  if (payload.message) return payload.message;

  if (payload.errores?.length) {
    return payload.errores
      .map((item) => item.error)
      .filter(Boolean)
      .join(' ');
  }

  return undefined;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 401) {
      setAuthToken(null);
      onUnauthorized?.();
    }

    let message = 'Ocurrió un error';
    try {
      const data = await response.json();
      message = parseErrorMessage(data) ?? message;
    } catch {
      // respuesta sin JSON
    }
    throw new ApiRequestError(message, response.status);
  }

  return response.json() as Promise<T>;
}

export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  try {
    const headers = new Headers(init?.headers);
    const token = getAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return await fetch(input, { ...init, headers });
  } catch {
    throw new Error(
      'No se pudo conectar con la API. Verificá que el backend esté corriendo en el puerto 3001.',
    );
  }
}

export async function requestJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await apiFetch(input, init);
  return handleResponse<T>(response);
}

export async function requestEmpty(input: RequestInfo | URL, init?: RequestInit): Promise<void> {
  const response = await apiFetch(input, init);
  await handleResponse<{ message: string }>(response);
}
