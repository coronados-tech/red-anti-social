import { useState, useEffect, type FormEvent } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap';
import PageContainer from '../components/PageContainer';
import {
  createComment,
  deletePost,
  deletePostImage,
  getPostById,
  getPostBySlug,
  getTags,
  updatePost,
  uploadPostImage,
} from '../api';
import TagSelector from '../components/TagSelector';
import TagBadge from '../components/TagBadge';
import ProfileAvatar from '../components/ProfileAvatar';
import PostImageCarousel from '../components/PostImageCarousel';
import BackLink from '../components/BackLink';
import PostImageEditor from '../components/PostImageEditor';
import ReportPostModal from '../components/ReportPostModal';
import ReportPostButton from '../components/ReportPostButton';
import { useAuth } from '../context/AuthContext';
import { useAsyncData } from '../hooks/useAsyncData';
import { DEFAULT_POST_IMAGE } from '../constants/assets';
import type { Post, PostImage, Tag } from '../types';
import { formatCommentDate, formatPostDate } from '../utils/formatDate';
import { postPath } from '../utils/postPath';
import { userProfilePath } from '../utils/userProfile';
import { focusPrimerCampoConError } from '../utils/focusPrimerCampoConError';
import { validarPost, type PostFormErrors } from '../utils/validacionPost';

export default function PostDetail() {
  const { slug: slugParam } = useParams();
  const { hash } = useLocation();
  const [searchParams] = useSearchParams();
  const activeTagFilter = searchParams.get('tag') ?? '';
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    data: post,
    loading,
    error,
    setData: setPost,
  } = useAsyncData(
    async () => {
      const param = slugParam?.trim();
      if (!param) {
        throw new Error('Publicación no encontrada');
      }

      if (/^\d+$/.test(param)) {
        return getPostById(Number(param), user?.id);
      }

      return getPostBySlug(param, user?.id);
    },
    [slugParam, user?.id],
  );

  const postId = post?.id;

  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [success, setSuccess] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editTitulo, setEditTitulo] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [editExistingImages, setEditExistingImages] = useState<PostImage[]>([]);
  const [editImageFiles, setEditImageFiles] = useState<File[]>([]);
  const [editErrores, setEditErrores] = useState<PostFormErrors>({});
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const isOwner = user?.id === post?.user_id;

  useEffect(() => {
    if (!post?.slug || !slugParam) return;

    if (/^\d+$/.test(slugParam) && slugParam !== post.slug) {
      navigate({ pathname: postPath(post.slug), hash }, { replace: true });
    }
  }, [post, slugParam, navigate, hash]);

  useEffect(() => {
    if (!hash || loading || !post) return;

    const targetId = hash.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hash, loading, post]);

  function startEditing() {
    if (!post) return;

    setEditTitulo(post.titulo);
    setEditDescription(post.description);
    setSelectedTags(post.tags?.map((tag) => tag.name) ?? []);
    setEditExistingImages(post.postImages ?? []);
    setEditImageFiles([]);
    setEditErrores({});
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
    setEditErrores({});
    setEditImageFiles([]);
    setEditExistingImages([]);
  }

  function toggleTag(tagName: string) {
    setSelectedTags((prev) =>
      prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName],
    );
  }

  function handleAddEditFiles(files: File[]) {
    setEditImageFiles((prev) => [...prev, ...files]);
    setEditErrores((prev) => ({ ...prev, imageFiles: '' }));
  }

  function removeExistingImage(imageId: number) {
    setEditExistingImages((prev) => prev.filter((image) => image.id !== imageId));
  }

  function removeNewImage(index: number) {
    setEditImageFiles((prev) => prev.filter((_, i) => i !== index));
    setEditErrores((prev) => ({ ...prev, imageFiles: '' }));
  }

  async function handleEditSubmit(event: FormEvent) {
    event.preventDefault();
    setEditError('');
    setEditSuccess('');

    const nuevosErrores = validarPost({
      titulo: editTitulo,
      description: editDescription,
      imageFiles: editImageFiles,
    });
    setEditErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) {
      focusPrimerCampoConError(event.currentTarget);
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

      const updatedPost = await updatePost(postId!, payload);

      const originalImageIds = new Set(post.postImages?.map((image) => image.id) ?? []);
      const remainingImageIds = new Set(editExistingImages.map((image) => image.id));
      const imageIdsToDelete = [...originalImageIds].filter(
        (imageId) => !remainingImageIds.has(imageId),
      );

      for (const imageId of imageIdsToDelete) {
        await deletePostImage(postId!, imageId);
      }

      for (const file of editImageFiles) {
        await uploadPostImage(postId!, file);
      }

      const imagesChanged = imageIdsToDelete.length > 0 || editImageFiles.length > 0;
      const refreshedPost = imagesChanged
        ? await getPostById(postId!, user?.id)
        : updatedPost;

      setPost((prev) =>
        prev
          ? {
              ...refreshedPost,
              comments: prev.comments,
            }
          : refreshedPost,
      );
      setIsEditing(false);
      setEditImageFiles([]);
      setEditExistingImages([]);
      setEditSuccess('Publicación actualizada.');

      if (refreshedPost.slug && refreshedPost.slug !== slugParam) {
        navigate(postPath(refreshedPost.slug), { replace: true });
      }
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
      await deletePost(postId!);
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
      focusPrimerCampoConError(event.currentTarget);
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
        post_id: postId!,
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
      <PageContainer className="text-center">
        <Spinner animation="border" size="sm" /> Cargando publicación...
      </PageContainer>
    );
  }

  if (error || !post) {
    return (
      <PageContainer>
        <Alert variant="danger">{error || 'Publicación no encontrada'}</Alert>
        <Link to="/">Volver al inicio</Link>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <BackLink to="/">Volver al feed</BackLink>

      {editSuccess && !isEditing && <Alert variant="success">{editSuccess}</Alert>}

      {!user && (
        <Alert variant="warning" className="mb-3">
          <Link to="/login">Iniciá sesión</Link> para poder comentar.
        </Alert>
      )}

      <Card className="post-card mb-4">
        <Card.Body>
          {!isEditing && (
            <div className="d-flex justify-content-end gap-2 mb-3">
              {isOwner ? (
                <>
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
                </>
              ) : (
                <ReportPostButton onClick={() => setShowReportModal(true)} />
              )}
            </div>
          )}

          {isEditing ? (
            <>
              <h2 className="h5 mb-3">Editar publicación</h2>

              {editError && <Alert variant="danger">{editError}</Alert>}

              <Form onSubmit={handleEditSubmit} noValidate>
                <Form.Group className="mb-3" controlId="edit-titulo">
                  <Form.Label>Título *</Form.Label>
                  <Form.Control
                    type="text"
                    value={editTitulo}
                    onChange={(e) => {
                      setEditTitulo(e.target.value);
                      setEditErrores((prev) => ({ ...prev, titulo: '' }));
                    }}
                    maxLength={200}
                    isInvalid={!!editErrores.titulo}
                  />
                  <Form.Control.Feedback type="invalid">
                    {editErrores.titulo}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="edit-description">
                  <Form.Label>Descripción *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={editDescription}
                    onChange={(e) => {
                      setEditDescription(e.target.value);
                      setEditErrores((prev) => ({ ...prev, description: '' }));
                    }}
                    maxLength={5000}
                    isInvalid={!!editErrores.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {editErrores.description}
                  </Form.Control.Feedback>
                </Form.Group>

                <TagSelector
                  availableTags={availableTags}
                  selectedTags={selectedTags}
                  onToggle={toggleTag}
                  onChangeSelected={setSelectedTags}
                />

                <PostImageEditor
                  inputId="edit-images"
                  existingImages={editExistingImages}
                  newFiles={editImageFiles}
                  onRemoveExisting={removeExistingImage}
                  onRemoveNew={removeNewImage}
                  onAddFiles={handleAddEditFiles}
                  imageError={editErrores.imageFiles}
                />

                <div className="d-flex flex-wrap gap-2">
                  <Button type="submit" variant="primary" disabled={savingEdit || deleting}>
                    {savingEdit ? 'Guardando...' : 'Guardar cambios'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline-secondary"
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
                    user={post.user ?? { id: post.user_id }}
                    size="md"
                    linkToProfile={Boolean(post.user?.nickname)}
                  />
                  <span>
                    {post.user?.nickname ? (
                      <Link to={userProfilePath(post.user.nickname)} className="post-card-author">
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

              {post.postImages && post.postImages.length > 0 ? (
                <div className="mb-3">
                  <PostImageCarousel images={post.postImages} />
                </div>
              ) : (
                <div className="mb-3">
                  <img
                    src={DEFAULT_POST_IMAGE}
                    alt="Anti-Social Net"
                    className="post-detail-img post-detail-img-placeholder rounded"
                  />
                </div>
              )}

              {post.tags && post.tags.length > 0 && (
                <div>
                  {post.tags.map((tag) => (
                    <TagBadge key={tag.id} name={tag.name} activeTagFilter={activeTagFilter} />
                  ))}
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {!isEditing && (
        <>
          <section id="comentarios" className="mb-4 post-comments-section">
            <h2 className="h5">Comentarios</h2>
            {post.comments && post.comments.length > 0 ? (
              <ul className="list-group">
                {post.comments.map((comment) => {
                  const authorId = comment.user?.id ?? comment.user_id;
                  const authorLabel = comment.user?.nickname
                    ? `@${comment.user.nickname}`
                    : authorId
                      ? `Usuario #${authorId}`
                      : 'Usuario desconocido';

                  return (
                    <li key={comment.id} className="list-group-item">
                      <div className="post-card-meta text-muted small mb-2">
                        <div className="post-card-meta-row">
                          <ProfileAvatar
                            user={comment.user ?? { id: comment.user_id }}
                            size="sm"
                            linkToProfile={Boolean(comment.user?.nickname)}
                          />
                          <span>
                            {comment.user?.nickname ? (
                              <Link
                                to={userProfilePath(comment.user.nickname)}
                                className="post-card-author"
                              >
                                {authorLabel}
                              </Link>
                            ) : (
                              <span>{authorLabel}</span>
                            )}
                            <span className="mx-1">·</span>
                            <span>{formatCommentDate(comment.createdAt)}</span>
                          </span>
                        </div>
                      </div>
                      <p className="mb-0">{comment.content}</p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <Alert variant="light">Todavía no hay comentarios en este post.</Alert>
            )}
          </section>

          {user && (
            <Card className="form-card">
              <Card.Body>
                <h2 className="h5 mb-3">Dejanos tu opinión</h2>

                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="comment-content">
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={content}
                      onChange={(e) => {
                        setContent(e.target.value);
                        setCommentError('');
                      }}
                      placeholder={`Comentar como ${user.nickname}`}
                      disabled={sending}
                      isInvalid={!!commentError}
                    />
                    <Form.Control.Feedback type="invalid">{commentError}</Form.Control.Feedback>
                  </Form.Group>
                  <Button type="submit" variant="primary" disabled={sending}>
                    {sending ? 'Enviando...' : 'Comentar'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}
        </>
      )}

      <ReportPostModal
        show={showReportModal}
        onHide={() => setShowReportModal(false)}
        postTitulo={post.titulo}
        postSlug={post.slug}
      />
    </PageContainer>
  );
}
