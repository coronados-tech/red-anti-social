import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { createPost, getTags, uploadPostImage } from '../api';
import TagSelector from '../components/TagSelector';
import PageContainer from '../components/PageContainer';
import { useAuth } from '../context/AuthContext';
import type { Tag } from '../types';
import { focusPrimerCampoConError } from '../utils/focusPrimerCampoConError';
import { validarPost, type PostFormErrors } from '../utils/validacionPost';
import { postPath } from '../utils/postPath';

export default function NewPost() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState<PostFormErrors>({});
  const [error, setError] = useState('');

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
    setErrores((prev) => ({ ...prev, imageFiles: '' }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    const nuevosErrores = validarPost({ titulo, description, imageFiles });
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) {
      focusPrimerCampoConError(event.currentTarget);
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
        user_id: user.id,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      });

      for (const file of imageFiles) {
        await uploadPostImage(post.id, file);
      }

      navigate(postPath(post.slug));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la publicación');
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  return (
    <PageContainer>
      <Card className="form-card">
        <Card.Body className="p-4">
          <h1 className="h3 mb-1">Compartí tu opinión</h1>
          <p className="text-muted small mb-4">
            Contale a la comunidad lo que pensás. Podés agregar imágenes y etiquetas.
          </p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit} noValidate>
                <Form.Group className="mb-3" controlId="post-titulo">
                  <Form.Label>Título *</Form.Label>
                  <Form.Control
                    type="text"
                    value={titulo}
                    onChange={(e) => {
                      setTitulo(e.target.value);
                      setErrores((prev) => ({ ...prev, titulo: '' }));
                    }}
                    maxLength={200}
                    isInvalid={!!errores.titulo}
                  />
                  <Form.Control.Feedback type="invalid">{errores.titulo}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="post-description">
                  <Form.Label>Descripción *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setErrores((prev) => ({ ...prev, description: '' }));
                    }}
                    maxLength={5000}
                    isInvalid={!!errores.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.description}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="post-images">
                  <Form.Label>Imágenes (opcional)</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleFilesChange}
                    isInvalid={!!errores.imageFiles}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.imageFiles}
                  </Form.Control.Feedback>
                  <Form.Text>
                    JPG, PNG o WEBP. Se suben una por una después de crear el post. Solo imágenes
                    apropiadas para la comunidad: sin violencia gráfica, símbolos de odio ni
                    contenido ofensivo.
                  </Form.Text>
                </Form.Group>

                <TagSelector
                  availableTags={tags}
                  selectedTags={selectedTags}
                  onToggle={toggleTag}
                  onChangeSelected={setSelectedTags}
                />

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Publicando...' : 'Publicar'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </PageContainer>
  );
}
