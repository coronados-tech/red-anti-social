import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Alert, Badge, Button, Card, Col, Row, Spinner } from 'react-bootstrap';
import PageContainer from '../components/PageContainer';
import {
  followUser,
  getPosts,
  getUserFollowers,
  getUserFollowing,
  unfollowUser,
} from '../api';
import PostCard from '../components/PostCard';
import PostFilterPanel from '../components/PostFilterPanel';
import ProfileAvatar from '../components/ProfileAvatar';
import BackLink from '../components/BackLink';
import { LockIcon } from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import { usePostFilters } from '../hooks/usePostFilters';
import type { Post, UserPublic } from '../types';
import {
  loadUserByNickname,
  userFollowersPath,
  userFollowingPath,
  userProfilePath,
} from '../utils/userProfile';

export default function PublicProfile() {
  const { nickname: nicknameParam } = useParams();
  const nickname = decodeURIComponent(nicknameParam ?? '');
  const navigate = useNavigate();
  const { user: sessionUser, loading: authLoading } = useAuth();
  const viewerId = sessionUser?.id;
  const isOwnProfile =
    sessionUser?.nickname.toLowerCase() === nickname.trim().toLowerCase();

  const [userId, setUserId] = useState<number | null>(null);
  const [profileUser, setProfileUser] = useState<UserPublic | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [followLoading, setFollowLoading] = useState(false);
  const [followError, setFollowError] = useState('');

  const {
    tagFilter,
    setTagFilter,
    textFilter,
    setTextFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    allTags,
    filteredPosts,
    hasActiveFilters,
    clearFilters,
  } = usePostFilters(posts, { syncTagWithUrl: true });

  const loadProfile = useCallback(async () => {
    if (!nickname.trim()) {
      setError('Nickname de usuario inválido');
      setLoading(false);
      return;
    }

    if (authLoading) return;

    const effectiveViewerId = viewerId ?? (isOwnProfile ? sessionUser?.id : undefined);

    setLoading(true);
    setError('');
    setIsPrivate(false);
    setProfileUser(null);
    setPosts([]);
    setUserId(null);

    try {
      const result = await loadUserByNickname(nickname, effectiveViewerId);

      if (result.status === 'redirect') {
        navigate(userProfilePath(result.nickname), { replace: true });
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
        setUserId(result.userId);
        setIsPrivate(true);
        setIsFollowing(false);
        return;
      }

      const { user: userData, userId: resolvedUserId } = result;
      setUserId(resolvedUserId);
      setProfileUser(userData);

      const [userPosts, followers, followingList] = await Promise.all([
        getPosts(resolvedUserId, effectiveViewerId),
        getUserFollowers(resolvedUserId, effectiveViewerId),
        getUserFollowing(resolvedUserId, effectiveViewerId),
      ]);

      setPosts(userPosts);
      setFollowerCount(followers.length);
      setFollowingCount(followingList.length);
      setIsFollowing(
        viewerId !== undefined && followers.some((follower) => follower.id === viewerId),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el perfil');
    } finally {
      setLoading(false);
    }
  }, [nickname, viewerId, authLoading, isOwnProfile, sessionUser?.id, navigate]);

  useEffect(() => {
    if (authLoading) return;
    loadProfile();
  }, [loadProfile, authLoading]);

  async function handleFollowToggle() {
    if (!sessionUser || isOwnProfile || userId === null) return;

    setFollowError('');
    setFollowLoading(true);

    try {
      if (isFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
      await loadProfile();
    } catch (err) {
      setFollowError(err instanceof Error ? err.message : 'No se pudo actualizar el seguimiento');
    } finally {
      setFollowLoading(false);
    }
  }

  if (authLoading || loading) {
    return (
      <PageContainer className="text-center">
        <Spinner animation="border" size="sm" /> Cargando perfil...
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Alert variant="danger">{error}</Alert>
        <Link to="/">Volver al inicio</Link>
      </PageContainer>
    );
  }

  if (isPrivate) {
    return (
      <PageContainer>
        <BackLink to="/">Volver al feed</BackLink>

        <Card className="form-card text-center py-5">
          <Card.Body>
            <LockIcon className="private-profile-lock-icon mb-3" />
            <h1 className="h4 mb-2">Este perfil es privado</h1>
            <p className="text-muted mb-4">
              Solo sus seguidores pueden ver sus publicaciones y datos completos.
            </p>

            {followError && <Alert variant="danger">{followError}</Alert>}

            {isOwnProfile ? (
              <p className="mb-0">
                <Link to="/perfil">Ir a mi perfil</Link>
              </p>
            ) : sessionUser ? (
              <Button variant="primary" onClick={handleFollowToggle} disabled={followLoading}>
                {followLoading ? 'Procesando...' : 'Seguir'}
              </Button>
            ) : (
              <p className="mb-0">
                <Link to="/login">Iniciá sesión</Link> para seguir a este usuario.
              </p>
            )}
          </Card.Body>
        </Card>
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

  return (
    <PageContainer>
      <BackLink to="/">Volver al feed</BackLink>

      <div className="profile-header mb-4">
        <ProfileAvatar user={profileUser} size="lg" linkToProfile />
        <div className="flex-grow-1">
          <h1 className="h3 mb-1">
            {profileUser.name} {profileUser.lastName}
          </h1>
          <p className="text-muted mb-1">@{profileUser.nickname}</p>
          <p className="small text-muted mb-2">
            <Link to={userFollowersPath(profileUser.nickname)} className="follow-stat-link">
              {followerCount} {followerCount === 1 ? 'seguidor' : 'seguidores'}
            </Link>
            {' · '}
            <Link to={userFollowingPath(profileUser.nickname)} className="follow-stat-link">
              {followingCount} siguiendo
            </Link>
            {profileUser.isProfilePublic === false && (
              <Badge bg="secondary" className="ms-2">
                Privado
              </Badge>
            )}
          </p>

          {followError && (
            <Alert variant="danger" className="py-2 small">
              {followError}
            </Alert>
          )}

          {!isOwnProfile && sessionUser && (
            <Button
              variant={isFollowing ? 'outline-secondary' : 'primary'}
              size="sm"
              onClick={handleFollowToggle}
              disabled={followLoading}
            >
              {followLoading ? 'Procesando...' : isFollowing ? 'Dejar de seguir' : 'Seguir'}
            </Button>
          )}

          {!isOwnProfile && !sessionUser && (
            <p className="small mb-0">
              <Link to="/login">Iniciá sesión</Link> para seguir a este usuario.
            </p>
          )}
        </div>
      </div>

      {posts.length > 0 && (
        <PostFilterPanel
          title="Filtrar publicaciones"
          idPrefix="profile"
          allTags={allTags}
          tagFilter={tagFilter}
          onTagFilterChange={setTagFilter}
          textFilter={textFilter}
          onTextFilterChange={setTextFilter}
          dateFrom={dateFrom}
          onDateFromChange={setDateFrom}
          dateTo={dateTo}
          onDateToChange={setDateTo}
          onClear={clearFilters}
          canClear={hasActiveFilters}
        />
      )}

      <h2 className="h5 mb-3">Publicaciones ({filteredPosts.length})</h2>

      {filteredPosts.length === 0 ? (
        <Alert variant="info">No hay publicaciones con esos filtros.</Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredPosts.map((post) => (
            <Col key={post.id}>
              <PostCard
                post={post}
                tagFilterBasePath={userProfilePath(nickname)}
                activeTagFilter={tagFilter}
              />
            </Col>
          ))}
        </Row>
      )}
    </PageContainer>
  );
}
