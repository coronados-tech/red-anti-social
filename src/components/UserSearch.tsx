import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Form, ListGroup, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getUsers } from '../api';
import { useAuth } from '../context/AuthContext';
import ProfileAvatar from './ProfileAvatar';
import { CloseIcon } from './Icons';
import type { User, UserLimitedPublic } from '../types';
import { userProfilePath } from '../utils/userProfile';

export type SearchableUser = Pick<User, 'id' | 'nickname' | 'name' | 'lastName' | 'profilePicture'>;

const MAX_RESULTS = 6;
const MIN_QUERY_LENGTH = 2;

interface UserSearchProps {
  mode?: 'navigate' | 'select';
  selectedUser?: SearchableUser | null;
  onSelectUser?: (user: SearchableUser) => void;
  onClearSelection?: () => void;
  placeholder?: string;
  className?: string;
  controlId?: string;
}

function matchesQuery(user: User | UserLimitedPublic, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return false;

  if (user.nickname.toLowerCase().includes(normalized)) return true;

  if (!('name' in user)) return false;

  if (user.name?.toLowerCase().includes(normalized)) return true;
  if (user.lastName?.toLowerCase().includes(normalized)) return true;

  const fullName = `${user.name ?? ''} ${user.lastName ?? ''}`.trim().toLowerCase();
  return fullName.includes(normalized);
}

function toSearchableUser(user: User | UserLimitedPublic): SearchableUser {
  return {
    id: user.id,
    nickname: user.nickname,
    name: 'name' in user ? user.name : undefined,
    lastName: 'lastName' in user ? user.lastName : undefined,
    profilePicture: 'profilePicture' in user ? user.profilePicture : undefined,
  };
}

export default function UserSearch({
  mode = 'navigate',
  selectedUser = null,
  onSelectUser,
  onClearSelection,
  placeholder = 'Buscar usuarios...',
  className = '',
  controlId,
}: UserSearchProps) {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<SearchableUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [usersCache, setUsersCache] = useState<(User | UserLimitedPublic)[] | null>(null);

  const isSelectMode = mode === 'select';

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  const loadUsers = useCallback(async () => {
    if (usersCache) return usersCache;

    setLoading(true);
    try {
      const users = await getUsers(currentUser?.id);
      setUsersCache(users);
      return users;
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id, usersCache]);

  useEffect(() => {
    if (debouncedQuery.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setOpen(false);
      return;
    }

    let cancelled = false;

    async function searchUsers() {
      const users = await loadUsers();
      if (cancelled || !users) return;

      const filtered = users
        .filter((user) => matchesQuery(user, debouncedQuery))
        .slice(0, MAX_RESULTS)
        .map(toSearchableUser);

      setResults(filtered);
      setOpen(true);
    }

    searchUsers();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, loadUsers]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(user: SearchableUser) {
    setQuery('');
    setDebouncedQuery('');
    setResults([]);
    setOpen(false);

    if (isSelectMode) {
      onSelectUser?.(user);
      return;
    }

    navigate(userProfilePath(user.nickname));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    if (results.length === 1) {
      handleSelect(results[0]);
      return;
    }

    const exactMatch = results.find(
      (user) => user.nickname.toLowerCase() === trimmed.toLowerCase(),
    );
    if (exactMatch) {
      handleSelect(exactMatch);
    }
  }

  const showDropdown = open && debouncedQuery.length >= MIN_QUERY_LENGTH;
  const showEmptyState = showDropdown && !loading && results.length === 0;
  const resultsId = controlId ? `${controlId}-results` : 'navbar-user-search-results';

  if (isSelectMode && selectedUser) {
    return (
      <div
        ref={containerRef}
        className={`navbar-user-search navbar-user-search--form ${className}`.trim()}
      >
        <div className="navbar-user-search-selected">
          <ProfileAvatar user={selectedUser} size="sm" />
          <div className="navbar-user-search-info">
            {selectedUser.name ? (
              <span className="navbar-user-search-name">
                {selectedUser.name} {selectedUser.lastName}
              </span>
            ) : null}
            <span className="navbar-user-search-nickname text-muted">
              @{selectedUser.nickname}
            </span>
          </div>
          <Button
            type="button"
            variant="outline-secondary"
            size="sm"
            className="navbar-user-search-clear"
            onClick={onClearSelection}
            aria-label="Quitar filtro de usuario"
          >
            <CloseIcon className="navbar-user-search-clear-icon" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`navbar-user-search ${isSelectMode ? 'navbar-user-search--form' : ''} ${className}`.trim()}
    >
      <Form onSubmit={handleSubmit} role="search">
        <div className="navbar-user-search-field">
        <Form.Control
          id={controlId}
          type="search"
          size={isSelectMode ? undefined : 'sm'}
          placeholder={placeholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => {
            if (debouncedQuery.length >= MIN_QUERY_LENGTH) setOpen(true);
          }}
          aria-label={placeholder}
          aria-expanded={showDropdown}
          aria-controls={resultsId}
          autoComplete="off"
        />
        {loading && (
          <Spinner
            animation="border"
            size="sm"
            className="navbar-user-search-spinner"
            aria-hidden="true"
          />
        )}
      </div>

      {showDropdown && (
        <ListGroup
          id={resultsId}
          className="navbar-user-search-results"
          aria-label="Resultados de búsqueda"
        >
          {results.map((person) =>
            isSelectMode ? (
              <ListGroup.Item
                key={person.id}
                action
                type="button"
                className="navbar-user-search-item"
                onClick={() => handleSelect(person)}
              >
                <ProfileAvatar user={person} size="sm" />
                <div className="navbar-user-search-info">
                  {person.name ? (
                    <span className="navbar-user-search-name">
                      {person.name} {person.lastName}
                    </span>
                  ) : null}
                  <span className="navbar-user-search-nickname text-muted">@{person.nickname}</span>
                </div>
              </ListGroup.Item>
            ) : (
              <ListGroup.Item
                key={person.id}
                action
                as={Link}
                to={userProfilePath(person.nickname)}
                className="navbar-user-search-item"
                onClick={() => {
                  setQuery('');
                  setDebouncedQuery('');
                  setResults([]);
                  setOpen(false);
                }}
              >
                <ProfileAvatar user={person} size="sm" />
                <div className="navbar-user-search-info">
                  {person.name ? (
                    <span className="navbar-user-search-name">
                      {person.name} {person.lastName}
                    </span>
                  ) : null}
                  <span className="navbar-user-search-nickname text-muted">@{person.nickname}</span>
                </div>
              </ListGroup.Item>
            ),
          )}

          {showEmptyState && (
            <ListGroup.Item className="navbar-user-search-empty text-muted">
              No se encontraron usuarios
            </ListGroup.Item>
          )}
        </ListGroup>
      )}
      </Form>
    </div>
  );
}
