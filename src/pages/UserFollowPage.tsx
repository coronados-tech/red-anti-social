import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Alert, Spinner } from 'react-bootstrap';
import PageContainer from '../components/PageContainer';
import { getUserFollowers, getUserFollowing, unfollowUser } from '../api';
import ProfileAvatar from '../components/ProfileAvatar';
import UserFollowList from '../components/UserFollowList';
import BackLink from '../components/BackLink';
import { useAuth } from '../context/AuthContext';
import type { FollowUserSummary, UserPublic } from '../types';
import {
  loadUserByNickname,
  userFollowersPath,
  userFollowingPath,
  userProfilePath,
} from '../utils/userProfile';

type FollowListType = 'seguidores' | 'siguiendo';

function isFollowListType(value: string | undefined): value is FollowListType {
  return value === 'seguidores' || value === 'siguiendo';
}

export default function UserFollowPage() {
  const { nickname: nicknameParam } = useParams();
  const { pathname } = useLocation();
  const nickname = decodeURIComponent(nicknameParam ?? '');
  const listType = pathname.endsWith('/siguiendo')
    ? 'siguiendo'
    : pathname.endsWith('/seguidores')
      ? 'seguidores'
      : undefined;
  const navigate = useNavigate();
  const { user: sessionUser, loading: authLoading } = useAuth();
  const viewerId = sessionUser?.id;
  const isOwnProfile =
    sessionUser?.nickname.toLowerCase() === nickname.trim().toLowerCase();

  const [profileUser, setProfileUser] = useState<UserPublic | null>(null);
  const [users, setUsers] = useState<FollowUserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unfollowError, setUnfollowError] = useState('');
  const [unfollowingId, setUnfollowingId] = useState<number | null>(null);

  const loadFollowList = useCallback(async () => {
    if (!nickname.trim()) {
      setError('Nickname de usuario inválido');
      setLoading(false);
      return;
    }

    if (!isFollowListType(listType)) {
      setError('Lista no encontrada');
      setLoading(false);
      return;
    }

    if (authLoading) return;

    const effectiveViewerId = viewerId ?? (isOwnProfile ? sessionUser?.id : undefined);

    setLoading(true);
    setError('');
    setProfileUser(null);
    setUsers([]);

    try {
      const result = await loadUserByNickname(nickname, effectiveViewerId);

      if (result.status === 'redirect') {
        navigate(
          listType === 'seguidores'
            ? userFollowersPath(result.nickname)
            : userFollowingPath(result.nickname),
          { replace: true },
        );
        return;
      }

      if (result.status === 'invalid') {
        setError('Nickname de usuario inválido');
        return;
      }

      if (result.status === 'not_found') {
        setError('Usuario no encontrado');
        return;
      }

      if (result.status === 'forbidden') {
        setError('No tenés permiso para ver esta lista.');
        return;
      }

      setProfileUser(result.user);

      const followList =
        listType === 'seguidores'
          ? await getUserFollowers(result.userId, effectiveViewerId)
          : await getUserFollowing(result.userId, effectiveViewerId);

      setUsers(followList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar la lista');
    } finally {
      setLoading(false);
    }
  }, [nickname, listType, viewerId, authLoading, isOwnProfile, sessionUser?.id, navigate]);

  async function handleUnfollow(targetUserId: number) {
    setUnfollowError('');
    setUnfollowingId(targetUserId);

    try {
      await unfollowUser(targetUserId);
      setUsers((current) => current.filter((person) => person.id !== targetUserId));
    } catch (err) {
      setUnfollowError(
        err instanceof Error ? err.message : 'No se pudo dejar de seguir a este usuario',
      );
    } finally {
      setUnfollowingId(null);
    }
  }

  useEffect(() => {
    if (authLoading) return;
    loadFollowList();
  }, [loadFollowList, authLoading]);

  if (!isFollowListType(listType)) {
    return (
      <PageContainer>
        <Alert variant="danger">Lista no encontrada</Alert>
        <Link to="/">Volver al inicio</Link>
      </PageContainer>
    );
  }

  if (authLoading || loading) {
    return (
      <PageContainer className="text-center">
        <Spinner animation="border" size="sm" /> Cargando...
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Alert variant="danger">{error}</Alert>
        {profileUser ? (
          <Link to={userProfilePath(profileUser.nickname)}>Volver al perfil</Link>
        ) : (
          <Link to="/">Volver al inicio</Link>
        )}
      </PageContainer>
    );
  }

  if (!profileUser) {
    return (
      <PageContainer>
        <Alert variant="danger">Usuario no encontrado</Alert>
        <Link to="/">Volver al inicio</Link>
      </PageContainer>
    );
  }

  const title =
    listType === 'seguidores'
      ? isOwnProfile
        ? 'Mis seguidores'
        : `Seguidores de @${profileUser.nickname}`
      : isOwnProfile
        ? 'Personas que sigo'
        : `Personas que sigue @${profileUser.nickname}`;

  const emptyMessage =
    listType === 'seguidores'
      ? isOwnProfile
        ? 'Todavía no tenés seguidores.'
        : 'Este usuario no tiene seguidores todavía.'
      : isOwnProfile
        ? 'Todavía no seguís a nadie. Visitá perfiles y tocá Seguir.'
        : 'Este usuario no sigue a nadie todavía.';

  return (
    <PageContainer>
      <BackLink to={userProfilePath(profileUser.nickname)}>Volver al perfil</BackLink>

      <div className="profile-header mb-4">
        <ProfileAvatar user={profileUser} size="lg" linkToProfile />
        <div>
          <h1 className="h4 mb-1">
            {profileUser.name} {profileUser.lastName}
          </h1>
          <p className="text-muted mb-0">@{profileUser.nickname}</p>
        </div>
      </div>

      {unfollowError && <Alert variant="danger">{unfollowError}</Alert>}

      <UserFollowList
        title={title}
        users={users}
        emptyMessage={emptyMessage}
        canUnfollow={isOwnProfile && listType === 'siguiendo'}
        unfollowingId={unfollowingId}
        onUnfollow={handleUnfollow}
      />
    </PageContainer>
  );
}
