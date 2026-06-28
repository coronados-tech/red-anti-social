import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import ProfileAvatar from './ProfileAvatar';
import ReportPostModal from './ReportPostModal';
import ReportPostButton from './ReportPostButton';
import TagBadge from './TagBadge';
import { DEFAULT_POST_IMAGE } from '../constants/assets';
import type { Post } from '../types';
import { formatPostDate } from '../utils/formatDate';
import { postCommentsPath, postPath } from '../utils/postPath';
import { resolveMediaUrl } from '../utils/mediaUrl';
import { userProfilePath } from '../utils/userProfile';

interface PostCardProps {
  post: Post;
  tagFilterBasePath?: string;
  activeTagFilter?: string;
  layout?: 'grid' | 'feed';
}

export default function PostCard({
  post,
  tagFilterBasePath = '/',
  activeTagFilter,
  layout = 'grid',
}: PostCardProps) {
  const [showReportModal, setShowReportModal] = useState(false);
  const commentCount = post.comments?.length ?? 0;
  const firstImage = resolveMediaUrl(post.postImages?.[0]?.url);
  const coverImage = firstImage ?? DEFAULT_POST_IMAGE;
  const authorId = post.user?.id ?? post.user_id;
  const authorName = post.user?.nickname
    ? post.user.nickname
    : authorId
      ? `Usuario #${authorId}`
      : 'Usuario desconocido';
  const authorLabel = post.user?.nickname ? `@${post.user.nickname}` : authorName;
  const commentsLabel =
    commentCount === 0
      ? 'Sé el primero en comentar'
      : commentCount === 1
        ? '1 comentario'
        : `${commentCount} comentarios`;

  if (layout === 'feed') {
    return (
      <Card className="post-card post-card-feed">
        <Card.Body className="post-card-feed-body">
          <header className="post-card-feed-header">
            <ProfileAvatar
              user={post.user ?? { id: authorId }}
              size="md"
              linkToProfile={Boolean(post.user?.nickname)}
            />
            <div className="post-card-feed-author">
              {post.user?.nickname ? (
                <Link to={userProfilePath(post.user.nickname)} className="post-card-feed-author-name">
                  {authorName}
                </Link>
              ) : (
                <span className="post-card-feed-author-name">{authorName}</span>
              )}
              <div className="post-card-feed-meta">
                {post.user?.nickname && (
                  <>
                    <span>{authorLabel}</span>
                    <span className="mx-1">·</span>
                  </>
                )}
                <span>{formatPostDate(post.createdAt)}</span>
              </div>
            </div>
            <ReportPostButton onClick={() => setShowReportModal(true)} />
          </header>

          <h2 className="post-card-feed-title h6 mb-2">
            <Link to={postPath(post.slug)} className="post-card-title-link">
              {post.titulo}
            </Link>
          </h2>

          <Card.Text className="post-card-feed-description mb-2">{post.description}</Card.Text>

          {post.tags && post.tags.length > 0 && (
            <div className="post-card-feed-tags mb-0">
              {post.tags.map((tag) => (
                <TagBadge
                  key={tag.id}
                  name={tag.name}
                  filterBasePath={tagFilterBasePath}
                  activeTagFilter={activeTagFilter}
                />
              ))}
            </div>
          )}
        </Card.Body>

        <div className="post-card-feed-media">
          <Link to={postPath(post.slug)} className="post-card-feed-media-link" aria-label={`Ver publicación: ${post.titulo}`}>
            <img
              src={coverImage}
              alt={firstImage ? `Imagen de ${post.titulo}` : 'Anti-Social Net'}
              className={firstImage ? '' : 'post-card-img-placeholder'}
            />
          </Link>
        </div>

        <div className="post-card-feed-actions">
          <Link to={postPath(post.slug)} className="post-card-feed-action">
            Ver publicación
          </Link>
          <Link to={postCommentsPath(post.slug)} className="post-card-feed-action">
            {commentsLabel}
          </Link>
        </div>

        <ReportPostModal
          show={showReportModal}
          onHide={() => setShowReportModal(false)}
          postTitulo={post.titulo}
          postSlug={post.slug}
        />
      </Card>
    );
  }

  return (
    <Card className="post-card h-100">
      <Card.Img
        variant="top"
        src={coverImage}
        alt={firstImage ? 'Imagen del post' : 'Anti-Social Net'}
        className={`post-card-img ${firstImage ? '' : 'post-card-img-placeholder'}`.trim()}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="post-card-title h6">
          <Link to={postPath(post.slug)} className="post-card-title-link">
            {post.titulo}
          </Link>
        </Card.Title>

        <div className="post-card-meta text-muted small mb-2">
          <div className="post-card-meta-row">
            <ProfileAvatar
              user={post.user ?? { id: authorId }}
              size="sm"
              linkToProfile={Boolean(post.user?.nickname)}
            />
            <span>
              {post.user?.nickname ? (
                <Link to={userProfilePath(post.user.nickname)} className="post-card-author">
                  {authorLabel}
                </Link>
              ) : (
                <span>{authorLabel}</span>
              )}
              <span className="mx-1">·</span>
              <span>{formatPostDate(post.createdAt)}</span>
            </span>
          </div>
        </div>

        <Card.Text className="post-card-description text-muted small mb-2">
          {post.description}
        </Card.Text>

        {post.tags && post.tags.length > 0 && (
          <div className="mb-2">
            {post.tags.map((tag) => (
              <TagBadge
                key={tag.id}
                name={tag.name}
                filterBasePath={tagFilterBasePath}
                activeTagFilter={activeTagFilter}
              />
            ))}
          </div>
        )}

        <div className="post-card-footer mt-auto d-flex align-items-center justify-content-between gap-2">
          <Button as={Link} to={postPath(post.slug)} variant="outline-primary" size="sm">
            Ver más
          </Button>
          <div className="d-flex align-items-center gap-2 ms-auto">
            <ReportPostButton onClick={() => setShowReportModal(true)} />
            <Link to={postCommentsPath(post.slug)} className="post-card-comments-link">
              {commentsLabel}
            </Link>
          </div>
        </div>
      </Card.Body>

      <ReportPostModal
        show={showReportModal}
        onHide={() => setShowReportModal(false)}
        postTitulo={post.titulo}
        postSlug={post.slug}
      />
    </Card>
  );
}
