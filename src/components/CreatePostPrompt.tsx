import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import ProfileAvatar from './ProfileAvatar';
import { useAuth } from '../context/AuthContext';
import type { User } from '../types';

function getDisplayName(user: User) {
  const fullName = `${user.name} ${user.lastName}`.trim();
  return fullName || user.nickname;
}

export default function CreatePostPrompt() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Card className="post-card post-card-feed create-post-prompt">
        <Card.Body className="create-post-prompt-body">
          <p className="create-post-prompt-guest-text mb-2">
            ¿Querés compartir algo en Anti-Social Net?
          </p>
          <div className="create-post-prompt-guest-actions">
            <Link to="/login" className="create-post-prompt-guest-link">
              Iniciar sesión
            </Link>
            <span className="text-muted">·</span>
            <Link to="/registro" className="create-post-prompt-guest-link">
              Registrate
            </Link>
          </div>
        </Card.Body>
      </Card>
    );
  }

  const displayName = getDisplayName(user);

  return (
    <Card className="post-card post-card-feed create-post-prompt">
      <Card.Body className="create-post-prompt-body">
        <div className="create-post-prompt-row">
          <ProfileAvatar user={user} size="md" linkToProfile />
          <Link to="/nuevo-post" className="create-post-prompt-input">
            ¿Qué estás pensando, {displayName}?
          </Link>
        </div>

        <div className="create-post-prompt-actions">
          <Link to="/nuevo-post" className="create-post-prompt-action">
            <span className="create-post-prompt-action-icon create-post-prompt-action-icon-photo" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 14H5V7h14v12zm-7-9c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
              </svg>
            </span>
            Foto
          </Link>
          <Link to="/nuevo-post" className="create-post-prompt-action">
            <span className="create-post-prompt-action-icon create-post-prompt-action-icon-post" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
              </svg>
            </span>
            Publicación
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}
