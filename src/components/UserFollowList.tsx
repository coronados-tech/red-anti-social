import { Link } from 'react-router-dom';
import { Alert, Button, ListGroup } from 'react-bootstrap';
import ProfileAvatar from './ProfileAvatar';
import type { FollowUserSummary } from '../types';
import { userProfilePath } from '../utils/userProfile';

interface UserFollowListProps {
  title: string;
  users: FollowUserSummary[];
  emptyMessage: string;
  canUnfollow?: boolean;
  unfollowingId?: number | null;
  onUnfollow?: (userId: number) => void;
}

export default function UserFollowList({
  title,
  users,
  emptyMessage,
  canUnfollow = false,
  unfollowingId = null,
  onUnfollow,
}: UserFollowListProps) {
  return (
    <section className="mb-4">
      <h2 className="h5 mb-3">
        {title} ({users.length})
      </h2>

      {users.length === 0 ? (
        <Alert variant="info" className="mb-0">
          {emptyMessage}
        </Alert>
      ) : (
        <ListGroup className="user-follow-list">
          {users.map((person) => (
            <ListGroup.Item key={person.id} className="user-follow-list-item">
              <Link to={userProfilePath(person.nickname)} className="user-follow-list-link">
                <ProfileAvatar user={person} size="sm" />
                <div className="user-follow-list-info">
                  <span className="user-follow-list-name">
                    {person.name} {person.lastName}
                  </span>
                  <span className="user-follow-list-nickname text-muted">@{person.nickname}</span>
                </div>
              </Link>
              {canUnfollow && onUnfollow && (
                <Button
                  type="button"
                  variant="outline-secondary"
                  size="sm"
                  className="user-follow-list-unfollow"
                  disabled={unfollowingId === person.id}
                  onClick={() => onUnfollow(person.id)}
                >
                  {unfollowingId === person.id ? 'Procesando...' : 'Dejar de seguir'}
                </Button>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </section>
  );
}
