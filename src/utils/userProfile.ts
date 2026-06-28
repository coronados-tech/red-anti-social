import { ApiRequestError, getUserById, getUsers } from '../api';
import type { User, UserPublic } from '../types';

export function userProfilePath(nickname: string): string {
  return `/usuario/${encodeURIComponent(nickname)}`;
}

export function userFollowersPath(nickname: string): string {
  return `/usuario/${encodeURIComponent(nickname)}/seguidores`;
}

export function userFollowingPath(nickname: string): string {
  return `/usuario/${encodeURIComponent(nickname)}/siguiendo`;
}

export async function resolveUserIdByNickname(
  nickname: string,
  viewerId?: number,
): Promise<number | null> {
  const trimmed = nickname.trim();
  if (!trimmed) return null;

  if (/^\d+$/.test(trimmed)) {
    try {
      const user = await getUserById(Number(trimmed), viewerId);
      return user.id;
    } catch {
      return null;
    }
  }

  const users = await getUsers(viewerId);
  const found = users.find((user) => user.nickname.toLowerCase() === trimmed.toLowerCase());
  return found?.id ?? null;
}

export function normalizeGender(gender: string): string {
  const value = gender.trim().toLowerCase();
  if (value === 'otro') return 'x';
  return value;
}

export function userToProfileForm(user: User) {
  return {
    nickname: user.nickname,
    name: user.name,
    lastName: user.lastName,
    email: user.email,
    birthDate: user.birthDate,
    gender: normalizeGender(user.gender),
    isProfilePublic: user.isProfilePublic !== false,
  };
}

export type LoadUserByNicknameResult =
  | { status: 'ok'; user: UserPublic; userId: number }
  | { status: 'redirect'; nickname: string }
  | { status: 'not_found' }
  | { status: 'forbidden'; userId: number }
  | { status: 'invalid' };

export async function loadUserByNickname(
  nickname: string,
  viewerId?: number,
): Promise<LoadUserByNicknameResult> {
  const trimmed = nickname.trim();
  if (!trimmed) return { status: 'invalid' };

  const resolvedUserId = await resolveUserIdByNickname(trimmed, viewerId);
  if (resolvedUserId === null) return { status: 'not_found' };

  try {
    const userData = await getUserById(resolvedUserId, viewerId);

    if (/^\d+$/.test(trimmed) && userData.nickname) {
      return { status: 'redirect', nickname: userData.nickname };
    }

    return { status: 'ok', user: userData, userId: resolvedUserId };
  } catch (err) {
    if (err instanceof ApiRequestError && err.status === 403) {
      return { status: 'forbidden', userId: resolvedUserId };
    }
    throw err;
  }
}
