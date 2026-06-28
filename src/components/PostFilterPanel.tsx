import { Badge, Card, Col, Form, Row } from 'react-bootstrap';
import UserSearch, { type SearchableUser } from './UserSearch';

interface PostFilterPanelProps {
  title?: string;
  idPrefix: string;
  allTags: string[];
  tagFilter: string;
  onTagFilterChange: (tag: string) => void;
  textFilter: string;
  onTextFilterChange: (text: string) => void;
  dateFrom: string;
  onDateFromChange: (date: string) => void;
  dateTo: string;
  onDateToChange: (date: string) => void;
  onClear: () => void;
  canClear?: boolean;
  showUserFilter?: boolean;
  selectedUser?: SearchableUser | null;
  onSelectUser?: (user: SearchableUser) => void;
  onClearUser?: () => void;
  layout?: 'default' | 'sidebar';
}

export default function PostFilterPanel({
  title = 'Buscador de publicaciones',
  idPrefix,
  allTags,
  tagFilter,
  onTagFilterChange,
  textFilter,
  onTextFilterChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onClear,
  canClear = false,
  showUserFilter = false,
  selectedUser = null,
  onSelectUser,
  onClearUser,
  layout = 'default',
}: PostFilterPanelProps) {
  const isSidebar = layout === 'sidebar';

  return (
    <Card className={`form-card ${isSidebar ? 'home-feed-filters-card mb-0' : 'mb-4'}`}>
      <Card.Body>
        <h3 className="h6 mb-3">{title}</h3>
        <Row className={`g-3 home-post-filters ${isSidebar ? 'home-post-filters-sidebar flex-column' : ''}`}>
          <Col xs={12} md={isSidebar ? 12 : showUserFilter ? 6 : 12}>
            <Form.Group controlId={`${idPrefix}-filter-text`}>
              <Form.Label className="small">{showUserFilter ? 'Texto' : 'Buscar'}</Form.Label>
              <Form.Control
                type="search"
                placeholder="Título o descripción"
                value={textFilter}
                onChange={(e) => onTextFilterChange(e.target.value)}
              />
            </Form.Group>
          </Col>
          {showUserFilter && onSelectUser && onClearUser && (
            <Col xs={12} md={isSidebar ? 12 : 6}>
              <Form.Group>
                <Form.Label className="small" htmlFor={`${idPrefix}-filter-user-input`}>
                  Usuario
                </Form.Label>
                <UserSearch
                  mode="select"
                  selectedUser={selectedUser}
                  onSelectUser={onSelectUser}
                  onClearSelection={onClearUser}
                  placeholder="Nickname o nombre"
                  controlId={`${idPrefix}-filter-user-input`}
                />
              </Form.Group>
            </Col>
          )}
          <Col xs={12} md={isSidebar ? 12 : 4}>
            <Form.Group controlId={`${idPrefix}-filter-date-from`}>
              <Form.Label className="small">Desde</Form.Label>
              <Form.Control
                type="date"
                value={dateFrom}
                onChange={(e) => onDateFromChange(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={isSidebar ? 12 : 4}>
            <Form.Group controlId={`${idPrefix}-filter-date-to`}>
              <Form.Label className="small">Hasta</Form.Label>
              <Form.Control
                type="date"
                value={dateTo}
                onChange={(e) => onDateToChange(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        {allTags.length > 0 && (
          <div
            className={`mt-3 d-flex flex-wrap gap-2 align-items-center ${isSidebar ? 'home-feed-filters-tags' : ''}`}
          >
            <span className="small text-muted">Etiqueta:</span>
            <Badge
              bg={tagFilter === '' ? 'primary' : 'secondary'}
              role="button"
              className="tag-filter"
              onClick={() => onTagFilterChange('')}
            >
              Todas
            </Badge>
            {allTags.map((tag) => (
              <Badge
                key={tag}
                bg={tagFilter === tag ? 'primary' : 'secondary'}
                role="button"
                className="tag-filter"
                onClick={() => onTagFilterChange(tag)}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {canClear && (
          <button
            type="button"
            className="btn btn-danger w-100 mt-3 post-filters-clear-btn"
            onClick={onClear}
          >
            Limpiar filtros
          </button>
        )}
      </Card.Body>
    </Card>
  );
}
