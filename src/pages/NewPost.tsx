import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { createPost, uploadPostImage, getTags } from '../api/posts';
import { useAuth } from '../context/AuthContext';
import type { Tag } from '../types';

export default function NewPost() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getTags()
      .then(setTags)
      .catch((err: Error) => setError(err.message));
  }, []);

  function toggleTag(tagName: string) {
    setSelectedTags((prev) =>
      prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName],
    );
  }

  function handleFilesChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setImageFiles(files);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!titulo.trim()) {
      setError('El título es obligatorio.');
      return;
    }

    if (!description.trim()) {
      setError('La descripción es obligatoria.');
      return;
    }

    if (!user) {
      setError('Tenés que estar logueado.');
      return;
    }

    setLoading(true);

    try {
      const post = await createPost({
        titulo: titulo.trim(),
        description: description.trim(),
        user_id: Number(user.id), // Aseguramos tipado numérico
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      });

      for (const file of imageFiles) {
        await uploadPostImage(post.id, file);
      }

      setSuccess('Publicación creada correctamente.');
      setTimeout(() => navigate('/perfil'), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la publicación');
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="form-card">
            <Card.Body>
              <h1 className="h3 mb-3">Nueva publicación</h1>
              <p className="text-muted small">
                Primero creamos el post con <code>POST /posts</code> y después subimos cada imagen con{' '}
                <code>POST /posts/:id/images</code>.
              </p>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="post-titulo">
                  <Form.Label>Título *</Form.Label>
                  <Form.Control
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    maxLength={200}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="post-description">
                  <Form.Label>Descripción *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="post-images">
                  <Form.Label>Imágenes (opcional)</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleFilesChange}
                  />
                  <Form.Text className="text-muted">
                    JPG, PNG o WEBP. Se suben una por una después de crear el post.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Etiquetas</Form.Label>
                  <div className="d-flex flex-wrap gap-2">
                    {tags.map((tag) => {
                      const isSelected = selectedTags.includes(tag.name);
                      return (
                        <Button
                          key={tag.id}
                          type="button"
                          variant={isSelected ? 'primary' : 'outline-secondary'}
                          size="sm"
                          onClick={() => toggleTag(tag.name)}
                        >
                          {isSelected ? `✓ ${tag.name}` : tag.name}
                        </Button>
                      );
                    })}
                  </div>
                </Form.Group>

                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? 'Publicando...' : 'Publicar'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}