import { useEffect, useState } from 'react';
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

function usePreloadedImage(url?: string): string | null {
  const [readyUrl, setReadyUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setReadyUrl(null);
      return;
    }

    let cancelled = false;
    const img = new Image();

    img.onload = () => {
      if (!cancelled) {
        setReadyUrl(url);
      }
    };
    img.onerror = () => {
      if (!cancelled) {
        setReadyUrl(null);
      }
    };
    img.src = url;

    return () => {
      cancelled = true;
      img.onload = null;
      img.onerror = null;
    };
  }, [url]);

  return readyUrl;
}

export default function ProfileAvatar({
  user,
  size = 'md',
  linkToProfile = false,
  className = '',
}: ProfileAvatarProps) {
  const label = user.nickname ? `@${user.nickname}` : 'Usuario';
  const pictureUrl = resolveMediaUrl(user.profilePicture);
  const readyUrl = usePreloadedImage(pictureUrl);
  const isLoading = Boolean(pictureUrl && !readyUrl);

  const wrapClass = `profile-avatar-wrap profile-avatar-wrap-${size} ${className}`.trim();
  const avatarClass = `profile-avatar profile-avatar-${size}`;

  const avatar = pictureUrl ? (
    <span className={wrapClass}>
      <span
        className={`${avatarClass} profile-avatar-fallback${isLoading ? ' profile-avatar-fallback-loading' : ''}`}
        aria-hidden={Boolean(readyUrl)}
      >
        {getInitials(user)}
      </span>
      {readyUrl && (
        <img
          src={readyUrl}
          alt={`Foto de ${label}`}
          className={`${avatarClass} profile-avatar-img`}
        />
      )}
    </span>
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
