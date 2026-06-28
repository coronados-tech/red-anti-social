import { Link } from 'react-router-dom';
import { Badge } from 'react-bootstrap';
import { buildTagFilterPath } from '../utils/tagFilter';

interface TagBadgeProps {
  name: string;
  filterBasePath?: string;
  activeTagFilter?: string;
  className?: string;
}

export default function TagBadge({
  name,
  filterBasePath = '/',
  activeTagFilter,
  className,
}: TagBadgeProps) {
  const isActive = Boolean(activeTagFilter) && name === activeTagFilter;

  return (
    <Badge
      as={Link}
      to={buildTagFilterPath(filterBasePath, name)}
      bg={isActive ? 'primary' : 'secondary'}
      className={`tag-badge-link me-1 ${isActive ? 'tag-badge-link-active' : ''} ${className ?? ''}`.trim()}
    >
      #{name}
    </Badge>
  );
}
