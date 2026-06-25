import { Link } from 'react-router-dom';
import { Badge, Button, Card } from 'react-bootstrap';
import ProfileAvatar from './ProfileAvatar';
import type { Post } from '../types';
import { formatPostDate } from '../utils/formatDate';
import { userProfilePath } from '../utils/userProfile';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const commentCount = post.comments?.length ?? 0;
  const firstImage = post.postImages?.[0]?.url;
  const authorId = post.user?.id ?? post.user_id;
  const authorLabel = post.user?.nickname ? `@${post.user.nickname}` : `Usuario #${authorId}`;

  return (
    <Card className="post-card h-100">
      {firstImage && (
        <Card.Img variant="top" src={firstImage} alt="Imagen del post" className="post-card-img" />
      )}
      <Card.Body className="d-flex flex-column">
        <Card.Title className="post-card-title h6">
          <Link to={`/post/${post.id}`} className="post-card-title-link">
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
              <Badge key={tag.id} bg="secondary" className="me-1">
                #{tag.name}
              </Badge>
            ))}
          </div>
        )}

        <p className="text-muted small mb-3">
          {commentCount === 1 ? '1 comentario visible' : `${commentCount} comentarios visibles`}
        </p>

        <Button as={Link} to={`/post/${post.id}`} variant="outline-primary" size="sm" className="mt-auto">
          Ver más
        </Button>
      </Card.Body>
    </Card>
  );
}
