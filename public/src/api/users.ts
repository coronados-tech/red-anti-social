import type {
  CreateUserPayload,
  FollowUserSummary,
  UpdateUserPayload,
  User,
} from "../types";
import {
  API_URL,
  requestEmpty,
  requestJson,
  setAuthToken,
  withViewerId,
} from "./client";

export { setAuthToken } from "./client";

interface AuthLoginResponse {
  token: string;
  user: User;
}

export async function loginUser(
  identifier: string,
  password: string,
): Promise<AuthLoginResponse> {
  const payload = { identifier, password };
  const data = await requestJson<AuthLoginResponse>(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  setAuthToken(data.token);
  return data;
}

export async function getCurrentUser(): Promise<User> {
  return requestJson<User>(`${API_URL}/auth/me`);
}

export async function getUsers(viewerId?: number): Promise<User[]> {
  return requestJson<User[]>(withViewerId(`${API_URL}/users`, viewerId));
}

export async function getUserById(
  id: number,
  viewerId?: number,
): Promise<User> {
  return requestJson<User>(withViewerId(`${API_URL}/users/${id}`, viewerId));
}

export async function updateUser(
  id: number,
  payload: UpdateUserPayload,
): Promise<User> {
  return requestJson<User>(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function uploadProfilePicture(
  id: number,
  file: File,
): Promise<User> {
  const formData = new FormData();
  formData.append("image", file);

  return requestJson<User>(`${API_URL}/users/${id}/profile-picture`, {
    method: "PUT",
    body: formData,
  });
}

export async function deleteProfilePicture(id: number): Promise<void> {
  return requestEmpty(`${API_URL}/users/${id}/profile-picture`, {
    method: "DELETE",
  });
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  return requestJson<User>(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function getUserFollowers(
  id: number,
  viewerId?: number,
): Promise<FollowUserSummary[]> {
  return requestJson<FollowUserSummary[]>(
    withViewerId(`${API_URL}/users/${id}/followers`, viewerId),
  );
}

export async function getUserFollowing(
  id: number,
  viewerId?: number,
): Promise<FollowUserSummary[]> {
  return requestJson<FollowUserSummary[]>(
    withViewerId(`${API_URL}/users/${id}/following`, viewerId),
  );
}

export async function followUser(targetUserId: number): Promise<void> {
  return requestEmpty(`${API_URL}/users/${targetUserId}/follow`, {
    method: "POST",
  });
}

export async function unfollowUser(targetUserId: number): Promise<void> {
  return requestEmpty(`${API_URL}/users/${targetUserId}/follow`, {
    method: "DELETE",
  });
}
