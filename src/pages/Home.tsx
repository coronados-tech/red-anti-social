import { useEffect, useState } from 'react';
import { Alert, Badge, Col, Container, Row, Spinner } from 'react-bootstrap';
import { getPosts } from '../api/posts';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import { integrantes } from '../data/integrantes';
import type { Post } from '../types';

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tagFilter, setTagFilter] = useState('');

  useEffect(() => {
    getPosts(undefined, user?.id)
      .then(setPosts)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags?.map((tag) => tag.name) ?? [])),
  ).sort();

  const filteredPosts = tagFilter
    ? posts.filter((post) => post.tags?.some((tag) => tag.name === tagFilter))
    : posts;

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

        {allTags.length > 0 && (
          <div className="mb-3 d-flex flex-wrap gap-2 align-items-center">
            <span className="small text-muted">Filtrar por tag:</span>
            <Badge
              bg={tagFilter === '' ? 'primary' : 'secondary'}
              role="button"
              onClick={() => setTagFilter('')}
              className="tag-filter"
            >
              Todos
            </Badge>
            {allTags.map((tag) => (
              <Badge
                key={tag}
                bg={tagFilter === tag ? 'primary' : 'secondary'}
                role="button"
                onClick={() => setTagFilter(tag)}
                className="tag-filter"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {loading && (
          <div className="text-center py-4">
            <Spinner animation="border" size="sm" /> Cargando publicaciones...
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && filteredPosts.length === 0 && (
          <Alert variant="info">No hay publicaciones para mostrar.</Alert>
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
