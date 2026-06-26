import { Link } from 'react-router-dom';
import { Alert, ListGroup } from 'react-bootstrap';
import ProfileAvatar from './ProfileAvatar';
import type { FollowUserSummary } from '../types';
import { userProfilePath } from '../utils/userProfile';

interface UserFollowListProps {
  title: string;
  users: FollowUserSummary[];
  emptyMessage: string;
}

export default function UserFollowList({ title, users, emptyMessage }: UserFollowListProps) {
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
            <ListGroup.Item
              key={person.id}
              action
              as={Link}
              to={userProfilePath(person.id)}
              className="user-follow-list-item"
            >
              <ProfileAvatar 
                url={person.profilePicture} 
                alt={`Foto de ${person.name}`} 
              />
              <div className="user-follow-list-info">
                <span className="user-follow-list-name">
                  {person.name} {person.lastName}
                </span>
                <span className="user-follow-list-nickname text-muted">@{person.nickname}</span>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </section>
  );
}