import { Link } from 'react-router-dom';
import { userProfilePath } from '../utils/userProfile';
import { resolveMediaUrl } from '../utils/mediaUrl';

type AvatarSize = 'sm' | 'md' | 'lg';

export interface ProfileAvatarUser {
  id?: number;
  nickname?: string;
  name?: string;
  lastName?: string;
  profilePicture?: string | null;
}

interface ProfileAvatarProps {
  user: ProfileAvatarUser;
  size?: AvatarSize;
  linkToProfile?: boolean;
  className?: string;
}

function getInitials(user: ProfileAvatarUser): string {
  const fromName = user.name?.charAt(0) ?? '';
  const fromLast = user.lastName?.charAt(0) ?? '';
  if (fromName || fromLast) {
    return `${fromName}${fromLast}`.toUpperCase();
  }
  return user.nickname?.charAt(0)?.toUpperCase() ?? '?';
}

export default function ProfileAvatar({
  user,
  size = 'md',
  linkToProfile = false,
  className = '',
}: ProfileAvatarProps) {
  const label = user.nickname ? `@${user.nickname}` : 'Usuario';
  const avatarClass = `profile-avatar profile-avatar-${size} ${className}`.trim();

  const avatar = user.profilePicture ? (
    <img src={resolveMediaUrl(user.profilePicture)} alt={`Foto de ${label}`} className={avatarClass} />
  ) : (
    <span className={`${avatarClass} profile-avatar-fallback`} aria-hidden="true">
      {getInitials(user)}
    </span>
  );

  if (linkToProfile && user.nickname) {
    return (
      <Link to={userProfilePath(user.nickname)} className="profile-avatar-link" title={label}>
        {avatar}
      </Link>
    );
  }

  return avatar;
}
