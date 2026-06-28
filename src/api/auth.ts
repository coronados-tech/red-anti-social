import type { User } from '../types';
import { API_URL, requestJson, setAuthToken } from './client';

interface AuthLoginResponse {
  token: string;
  user: User;
}

export async function loginUser(identifier: string, password: string): Promise<AuthLoginResponse> {
  const data = await requestJson<AuthLoginResponse>(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });
  setAuthToken(data.token);
  return data;
}

export async function getCurrentUser(): Promise<User> {
  return requestJson<User>(`${API_URL}/auth/me`);
}
