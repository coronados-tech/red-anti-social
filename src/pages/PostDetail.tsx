import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Alert, Badge, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { createComment } from '../api/comment';
import {
  deletePost,
  getPostById,
  getTags,
  updatePost,
  uploadPostImage,
} from '../api/posts';
import TagSelector from '../components/TagSelector';
import ProfileAvatar from '../components/ProfileAvatar';
import { useAuth } from '../context/AuthContext';
import type { Post, Tag } from '../types';
import { formatPostDate } from '../utils/formatDate';
import { userProfilePath } from '../utils/userProfile';

export default function PostDetail() {
  const { id } = useParams();
  const postId = Number(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [commentError, setCommentError] = useState('');
  const [success, setSuccess] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editTitulo, setEditTitulo] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [editImageFiles, setEditImageFiles] = useState<File[]>([]);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = user?.id === post?.user_id;

  useEffect(() => {
    if (Number.isNaN(postId)) {
      setError('ID de publicación inválido');
      setLoading(false);
      return;
    }

    getPostById(postId, user?.id)
      .then(setPost)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [postId, user?.id]);

  function startEditing() {
    if (!post) return;

    setEditTitulo(post.titulo);
    setEditDescription(post.description);
    setSelectedTags(post.tags?.map((tag) => tag.name) ?? []);
    setEditImageFiles([]);
    setEditError('');
    setEditSuccess('');
    setIsEditing(true);

    getTags()
      .then(setAvailableTags)
      .catch((err: Error) => setEditError(err.message));
  }

  function cancelEditing() {
    setIsEditing(false);
    setEditError('');
    setEditImageFiles([]);
  }

  function toggleTag(tagName: string) {
    setSelectedTags((prev) =>
      prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName],
    );
  }

  function handleEditFilesChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setEditImageFiles(files);
  }

  async function handleEditSubmit(event: FormEvent) {
    event.preventDefault();
    setEditError('');
    setEditSuccess('');

    if (!editTitulo.trim()) {
      setEditError('El título no puede estar vacío.');
      return;
    }

    if (!editDescription.trim()) {
      setEditError('La descripción no puede estar vacía.');
      return;
    }

    setSavingEdit(true);

    try {
      const payload: { titulo: string; description: string; tags?: string[] } = {
        titulo: editTitulo.trim(),
        description: editDescription.trim(),
      };

      if (selectedTags.length > 0) {
        payload.tags = selectedTags;
      }

      const updatedPost = await updatePost(postId, payload);

      for (const file of editImageFiles) {
        await uploadPostImage(postId, file);
      }

      const refreshedPost =
        editImageFiles.length > 0 ? await getPostById(postId) : updatedPost;

      setPost((prev) =>
        prev
          ? {
              ...refreshedPost,
              comments: prev.comments,
            }
          : refreshedPost,
      );
      setIsEditing(false);
      setEditSuccess('Publicación actualizada.');
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'No se pudo actualizar la publicación');
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm('¿Seguro que querés eliminar esta publicación?');
    if (!confirmed) return;

    setDeleting(true);
    setEditError('');

    try {
      await deletePost(postId);
      navigate('/perfil');
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'No se pudo eliminar la publicación');
      setDeleting(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setCommentError('');
    setSuccess('');

    if (!content.trim()) {
      setCommentError('El comentario no puede estar vacío.');
      return;
    }

    if (!user) {
      setCommentError('Tenés que iniciar sesión para comentar.');
      return;
    }

    setSending(true);

    try {
      const newComment = await createComment({
        content: content.trim(),
        post_id: postId,
        user_id: user.id,
      });

      setPost((prev) =>
        prev
          ? {
              ...prev,
              comments: [...(prev.comments ?? []), newComment],
            }
          : prev,
      );
      setContent('');
      setSuccess('Comentario publicado.');
    } catch (err) {
      setCommentError(err instanceof Error ? err.message : 'No se pudo publicar el comentario');
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" size="sm" /> Cargando publicación...
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container>
        <Alert variant="danger">{error || 'Publicación no encontrada'}</Alert>
        <Link to="/">Volver al inicio</Link>
      </Container>
    );
  }

  return (
    <Container className="pb-5">
      <Link to="/" className="small d-inline-block mb-3">
        ← Volver al feed
      </Link>

      {editSuccess && !isEditing && <Alert variant="success">{editSuccess}</Alert>}

      <Card className="mb-4">
        <Card.Body>
          {isOwner && !isEditing && (
            <div className="d-flex justify-content-end gap-2 mb-3">
              <Button variant="outline-accent" size="sm" onClick={startEditing}>
                Editar publicación
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </Button>
            </div>
          )}

          {isEditing ? (
            <>
              <h2 className="h5 mb-3">Editar publicación</h2>

              {editError && <Alert variant="danger">{editError}</Alert>}

              <Form onSubmit={handleEditSubmit}>
                <Form.Group className="mb-3" controlId="edit-titulo">
                  <Form.Label>Título *</Form.Label>
                  <Form.Control
                    type="text"
                    value={editTitulo}
                    onChange={(e) => setEditTitulo(e.target.value)}
                    maxLength={200}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="edit-description">
                  <Form.Label>Descripción *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    required
                  />
                </Form.Group>

                <TagSelector
                  availableTags={availableTags}
                  selectedTags={selectedTags}
                  onToggle={toggleTag}
                  onChangeSelected={setSelectedTags}
                />

                <Form.Group className="mb-3" controlId="edit-images">
                  <Form.Label>Agregar imágenes (opcional)</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleEditFilesChange}
                  />
                  <Form.Text>Las imágenes nuevas se suman a las que ya tiene el post.</Form.Text>
                </Form.Group>

                <div className="d-flex flex-wrap gap-2">
                  <Button type="submit" variant="primary" disabled={savingEdit || deleting}>
                    {savingEdit ? 'Guardando...' : 'Guardar cambios'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline-accent"
                    onClick={cancelEditing}
                    disabled={savingEdit || deleting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    variant="outline-danger"
                    onClick={handleDelete}
                    disabled={savingEdit || deleting}
                  >
                    {deleting ? 'Eliminando...' : 'Eliminar publicación'}
                  </Button>
                </div>
              </Form>
            </>
          ) : (
            <>
              <h1 className="h4 mb-2">{post.titulo}</h1>

              <div className="post-card-meta text-muted small mb-3">
                <div className="post-card-meta-row">
                  <ProfileAvatar
                    url={post.user?.profilePicture}
                    alt={`Foto de ${post.user?.name ?? 'usuario'}`}
                  />
                  <span>
                    {post.user?.nickname ? (
                      <Link to={userProfilePath(Number(post.user_id))} className="post-card-author">
                        @{post.user.nickname}
                      </Link>
                    ) : (
                      <span>Usuario #{post.user_id}</span>
                    )}
                    <span className="mx-1">·</span>
                    <span>{formatPostDate(post.createdAt)}</span>
                  </span>
                </div>
              </div>

              <Card.Text className="post-description">{post.description}</Card.Text>

              {post.postImages && post.postImages.length > 0 && (
                <Row xs={1} md={2} className="g-3 mb-3">
                  {post.postImages.map((image) => (
                    <Col key={image.id}>
                      <img
                        src={image.url}
                        alt="Imagen del post"
                        className="img-fluid rounded post-detail-img"
                      />
                    </Col>
                  ))}
                </Row>
              )}

              {post.tags && post.tags.length > 0 && (
                <div>
                  {post.tags.map((tag) => (
                    <Badge key={tag.id} bg="secondary" className="me-1">
                      #{tag.name}
                    </Badge>
                  ))}
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {!isEditing && (
        <>
          <section className="mb-4">
            <h2 className="h5">Comentarios visibles</h2>
            {post.comments && post.comments.length > 0 ? (
              <ul className="list-group">
                {post.comments.map((comment) => (
                  <li key={comment.id} className="list-group-item">
                    {comment.content}
                  </li>
                ))}
              </ul>
            ) : (
              <Alert variant="light">Todavía no hay comentarios visibles en este post.</Alert>
            )}
          </section>

          <Card className="form-card">
            <Card.Body>
              <h2 className="h5 mb-3">Agregar comentario</h2>

              {!user && (
                <Alert variant="warning">
                  <Link to="/login">Iniciá sesión</Link> para poder comentar.
                </Alert>
              )}

              {commentError && <Alert variant="danger">{commentError}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="comment-content">
                  <Form.Label>Comentario *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={!user || sending}
                    required
                  />
                </Form.Group>
                <Button type="submit" variant="primary" disabled={!user || sending}>
                  {sending ? 'Enviando...' : 'Publicar comentario'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
}