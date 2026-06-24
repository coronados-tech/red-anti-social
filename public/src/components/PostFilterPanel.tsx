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
}

export default function PostFilterPanel({
  title = 'Buscar publicaciones',
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
  canClear = true,
  showUserFilter = false,
  selectedUser = null,
  onSelectUser,
  onClearUser,
}: PostFilterPanelProps) {
  return (
    <Card className="form-card mb-4">
      <Card.Body>
        <h3 className="h6 mb-3">{title}</h3>
        <Row className="g-3 home-post-filters">
          <Col xs={12} md={showUserFilter ? 6 : 12}>
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
            <Col xs={12} md={6}>
              <Form.Group controlId={`${idPrefix}-filter-user`}>
                <Form.Label className="small">Usuario</Form.Label>
                <UserSearch
                  mode="select"
                  selectedUser={selectedUser}
                  onSelectUser={onSelectUser}
                  onClearSelection={onClearUser}
                  placeholder="Buscar por nickname o nombre..."
                  controlId={`${idPrefix}-filter-user-input`}
                />
              </Form.Group>
            </Col>
          )}
          <Col xs={12} md={4}>
            <Form.Group controlId={`${idPrefix}-filter-date-from`}>
              <Form.Label className="small">Desde</Form.Label>
              <Form.Control
                type="date"
                value={dateFrom}
                onChange={(e) => onDateFromChange(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={4}>
            <Form.Group controlId={`${idPrefix}-filter-date-to`}>
              <Form.Label className="small">Hasta</Form.Label>
              <Form.Control
                type="date"
                value={dateTo}
                onChange={(e) => onDateToChange(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={4} className="d-flex align-items-end">
            <button
              type="button"
              className={`btn btn-outline-danger-soft ${showUserFilter ? 'w-100 home-post-filters-clear' : 'btn-sm'}`}
              onClick={onClear}
              disabled={!canClear}
            >
              Limpiar filtros
            </button>
          </Col>
        </Row>

        {allTags.length > 0 && (
          <div className="mt-3 d-flex flex-wrap gap-2 align-items-center">
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
      </Card.Body>
    </Card>
  );
}
