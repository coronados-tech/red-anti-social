import { Alert, Col, Container, Row, Spinner } from 'react-bootstrap';
import { getPosts } from '../api';
import PostCard from '../components/PostCard';
import PostFilterPanel from '../components/PostFilterPanel';
import { useAuth } from '../context/AuthContext';
import { integrantes } from '../data/integrantes';
import { useAsyncData } from '../hooks/useAsyncData';
import { usePostFilters } from '../hooks/usePostFilters';
import type { Post } from '../types';
import { getEmptyFilterMessage } from '../utils/emptyFilterMessage';

export default function Home() {
  const { user } = useAuth();

  const {
    data: posts,
    loading,
    error,
  } = useAsyncData(() => getPosts(undefined, user?.id), [user?.id], {
    initialData: [] as Post[],
  });

  const {
    tagFilter,
    setTagFilter,
    textFilter,
    setTextFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    selectedUser,
    setSelectedUser,
    allTags,
    filteredPosts,
    hasActiveFilters,
    clearFilters,
  } = usePostFilters(posts ?? []);

  return (
    <Container>
      <section className="hero-banner text-center mb-5">
        <h1 className="display-5 fw-bold">UnaHur Anti-Social Net</h1>
        <p className="lead mb-0">
          La red donde compartís lo mínimo indispensable y leés los comentarios filtrados por antigüedad.
        </p>
      </section>

      <section className="mb-5">
        <h2 className="h4 mb-3">Feed reciente</h2>

        {!loading && !error && (posts?.length ?? 0) > 0 && (
          <PostFilterPanel
            idPrefix="home"
            allTags={allTags}
            tagFilter={tagFilter}
            onTagFilterChange={setTagFilter}
            textFilter={textFilter}
            onTextFilterChange={setTextFilter}
            dateFrom={dateFrom}
            onDateFromChange={setDateFrom}
            dateTo={dateTo}
            onDateToChange={setDateTo}
            onClear={clearFilters}
            canClear={hasActiveFilters}
            showUserFilter
            selectedUser={selectedUser}
            onSelectUser={setSelectedUser}
            onClearUser={() => setSelectedUser(null)}
          />
        )}

        {!loading && !error && (posts?.length ?? 0) > 0 && (
          <p className="small text-muted mb-3">
            {filteredPosts.length}{' '}
            {filteredPosts.length === 1 ? 'publicación' : 'publicaciones'}
            {hasActiveFilters ? ' con los filtros aplicados' : ''}
          </p>
        )}

        {loading && (
          <div className="text-center py-4">
            <Spinner animation="border" size="sm" /> Cargando publicaciones...
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && (posts?.length ?? 0) === 0 && (
          <Alert variant="info">No hay publicaciones para mostrar.</Alert>
        )}

        {!loading && !error && (posts?.length ?? 0) > 0 && filteredPosts.length === 0 && (
          <Alert variant="light" className="alert-accent">
            {getEmptyFilterMessage({ selectedUser, textFilter, tagFilter })}
          </Alert>
        )}

        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredPosts.map((post) => (
            <Col key={post.id}>
              <PostCard post={post} />
            </Col>
          ))}
        </Row>
      </section>

      <section className="about-section mb-5">
        <h2 className="h4 mb-3">Sobre nosotros</h2>
        <p>
          Somos el grupo <strong>Coronados Tech</strong>. Desarrollamos este frontend en React + TypeScript
          para la materia CIU, conectado a nuestra API de Estrategia de Persistencia.
        </p>
        <ul className="list-unstyled mb-0">
          {integrantes.map((persona) => (
            <li key={persona.dni}>
              {persona.nombre} {persona.apellido} — DNI {persona.dni}
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
