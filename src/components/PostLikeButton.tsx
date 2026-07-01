import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { likePost, unlikePost } from '../api';
import { useAuth } from '../context/AuthContext';
import { HeartIcon } from './Icons';

interface PostLikeButtonProps {
  postId: number;
  likeCount?: number;
  likedByViewer?: boolean;
  variant?: 'feed' | 'inline';
  onUpdate?: (state: { likeCount: number; likedByViewer: boolean }) => void;
}

function formatLikeLabel(count: number): string {
  if (count === 0) return 'Me gusta';
  if (count === 1) return '1 me gusta';
  return `${count} me gusta`;
}

export default function PostLikeButton({
  postId,
  likeCount = 0,
  likedByViewer = false,
  variant = 'feed',
  onUpdate,
}: PostLikeButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [count, setCount] = useState(likeCount);
  const [liked, setLiked] = useState(likedByViewer);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (!user) {
      navigate('/login');
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      const response = liked ? await unlikePost(postId) : await likePost(postId);
      setCount(response.likeCount);
      setLiked(response.likedByViewer);
      onUpdate?.({ likeCount: response.likeCount, likedByViewer: response.likedByViewer });
    } catch {
      // Mantener el estado actual si falla la petición.
    } finally {
      setLoading(false);
    }
  }

  const label = formatLikeLabel(count);
  const className = [
    variant === 'feed' ? 'post-card-feed-action' : 'post-like-btn-inline',
    'post-like-btn',
    liked ? 'post-like-btn--active' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={className}
      onClick={handleToggle}
      disabled={loading}
      aria-pressed={liked}
      aria-label={liked ? `Quitar me gusta. ${label}` : `Dar me gusta. ${label}`}
    >
      <HeartIcon className="post-like-btn-icon" filled={liked} />
      <span>{label}</span>
    </button>
  );
}

export function PostLikeLoginHint() {
  return (
    <p className="text-muted small mb-0">
      <Link to="/login">Iniciá sesión</Link> para dar me gusta.
    </p>
  );
}
