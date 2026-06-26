import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import { getPosts } from '../api/posts';
import { 
  deleteProfilePicture, 
  getUserById, 
  getUserFollowing, 
  updateUser, 
  uploadProfilePicture 
} from '../api/users';

import PostCard from '../components/PostCard';
import ProfileAvatar from '../components/ProfileAvatar';
import { useAuth } from '../context/AuthContext';
import type { FollowUserSummary, Post, User } from '../types';
import { userProfilePath } from '../utils/userProfile';

interface ProfileForm {
  nickname: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: string;
  gender: string;
  isProfilePublic: boolean;
}

function normalizeGender(gender: string): string {
  return gender.toLowerCase();
}

function userToForm(user: User): Omit<ProfileForm, 'password'> {
  return {
    nickname: user.nickname,
    name: user.name,
    lastName: user.lastName,
    email: user.email,
    birthDate: user.birthDate,
    gender: normalizeGender(user.gender),
    isProfilePublic: user.isProfilePublic !== false,
  };
}

export default function Profile() {
  const { user, updateSessionUser, logout } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);
  const [following, setFollowing] = useState<FollowUserSummary[]>([]);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [form, setForm] = useState<ProfileForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [photoSuccess, setPhotoSuccess] = useState('');
  const [photoEditorOpen, setPhotoEditorOpen] = useState(false);
  const [photoEditorSource, setPhotoEditorSource] = useState<string | File | null>(null);

  useEffect(() => {
    if (!user) return;

    const numericUserId = Number(user.id);

    Promise.all([
      getPosts(numericUserId, numericUserId),
      getUserById(numericUserId, numericUserId),
      getUserFollowing(numericUserId, numericUserId),
    ])
      .then(([userPosts, freshUser, followingList]) => {
        setPosts(userPosts);
        setProfileUser(freshUser);
        setFollowing(followingList);
        setForm({ ...userToForm(freshUser), password: '' });
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user?.id]);

  function updateField(field: keyof ProfileForm, value: string | boolean) {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!user || !form) return;

    setSaveError('');
    setSaveSuccess('');

    if (!form.password.trim()) {
      setSaveError('Ingresá tu contraseña para guardar los cambios.');
      return;
    }

    setSaving(true);

    try {
      const updated = await updateUser(Number(user.id), {
        nickname: form.nickname.trim(),
        name: form.name.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        birthDate: form.birthDate,
        gender: form.gender,
        isProfilePublic: form.isProfilePublic,
      });

      setProfileUser(updated);
      setForm({ ...userToForm(updated), password: '' });
      updateSessionUser(updated);
      setSaveSuccess('Datos actualizados correctamente.');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'No se pudieron guardar los cambios');
    } finally {
      setSaving(false);
    }
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setPhotoError('');
    setPhotoSuccess('');
    setPhotoEditorSource(file);
    setPhotoEditorOpen(true);
    event.target.value = '';
  }

  function handleAdjustPhoto() {
    if (!profileUser?.profilePicture) return;

    setPhotoError('');
    setPhotoSuccess('');
    setPhotoEditorSource(profileUser.profilePicture);
    setPhotoEditorOpen(true);
  }

  function handleClosePhotoEditor() {
    setPhotoEditorOpen(false);
    setPhotoEditorSource(null);
  }

  async function handleSavePhoto(file: File) {
    if (!user) return;

    setPhotoError('');
    setPhotoSuccess('');
    setUploadingPhoto(true);

    try {
      const updated = await uploadProfilePicture(Number(user.id), file);
      setProfileUser(updated);
      updateSessionUser(updated);
      setPhotoSuccess('Foto de perfil actualizada.');
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : 'No se pudo subir la foto');
      throw err;
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleRemovePhoto() {
    if (!user || !profileUser?.profilePicture) return;

    setPhotoError('');
    setPhotoSuccess('');
    setUploadingPhoto(true);

    try {
      await deleteProfilePicture(Number(user.id));
      const updated = { ...profileUser, profilePicture: null };
      setProfileUser(updated);
      updateSessionUser(updated);
      setPhotoSuccess('Foto de perfil eliminada.');
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : 'No se pudo eliminar la foto');
    } finally {
      setUploadingPhoto(false);
    }
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  if (!user) return null;

  if (loading && !form) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" size="sm" /> Cargando perfil...
      </Container>
    );
  }

  if (!form || !profileUser) return null;

  return (
    <Container className="pb-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div className="profile-header">
          <ProfileAvatar url={profileUser?.profilePicture} alt={`Foto de ${profileUser?.name}`} />
          <div>
            <h1 className="h3 mb-1">Mi perfil</h1>
            <p className="text-muted mb-1">
              @{profileUser.nickname} — {profileUser.name} {profileUser.lastName}
            </p>
            <Link to={userProfilePath(profileUser.id)} className="small">
              Ver perfil público
            </Link>
          </div>
        </div>
        <Button variant="outline-danger" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </div>

      <Card className="form-card mb-4">
        <Card.Body>
          <h2 className="h5 mb-3">Editar mis datos</h2>

          {saveError && <Alert variant="danger">{saveError}</Alert>}
          {saveSuccess && <Alert variant="success">{saveSuccess}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="profile-nickname">
                  <Form.Label>Nickname *</Form.Label>
                  <Form.Control
                    value={form.nickname}
                    onChange={(e) => updateField('nickname', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="profile-email">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="profile-name">
                  <Form.Label>Nombre *</Form.Label>
                  <Form.Control
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="profile-lastName">
                  <Form.Label>Apellido *</Form.Label>
                  <Form.Control
                    value={form.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="profile-birthDate">
                  <Form.Label>Fecha de nacimiento *</Form.Label>
                  <Form.Control
                    type="date"
                    value={form.birthDate}
                    onChange={(e) => updateField('birthDate', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="profile-gender">
                  <Form.Label>Género *</Form.Label>
                  <Form.Select
                    value={form.gender}
                    onChange={(e) => updateField('gender', e.target.value)}
                  >
                    <option value="femenino">Femenino</option>
                    <option value="masculino">Masculino</option>
                    <option value="otro">Otro</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="profile-password">
              <Form.Label>Contraseña *</Form.Label>
              <Form.Control
                type="password"
                value={form.password}
                onChange={(e) => updateField('password', e.target.value)}
                minLength={6}
                placeholder="Ingresá tu contraseña para confirmar"
                required
              />
              <Form.Text className="text-muted">
                La API pide la contraseña cada vez que guardás cambios.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="profile-public">
              <Form.Check
                type="switch"
                id="profile-is-public"
                label="Cuenta pública"
                checked={form.isProfilePublic}
                onChange={(e) => updateField('isProfilePublic', e.target.checked)}
              />
              <Form.Text className="text-muted">
                Si desactivás esta opción, solo tus seguidores podrán ver tu perfil y publicaciones.
              </Form.Text>
            </Form.Group>

            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </Form>

          <hr className="my-4" />

          <h3 className="h6 mb-3">Foto de perfil</h3>
          {photoError && <Alert variant="danger">{photoError}</Alert>}
          {photoSuccess && <Alert variant="success">{photoSuccess}</Alert>}

          <div className="d-flex flex-wrap align-items-center gap-3">
            <ProfileAvatar url={profileUser?.profilePicture} alt={`Foto de ${profileUser?.name}`} />
            <div>
              <Form.Group controlId="profile-photo" className="mb-2">
                <Form.Label className="small mb-1">Elegir imagen</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  disabled={uploadingPhoto}
                />
              </Form.Group>
              <div className="d-flex flex-wrap gap-2">
                {profileUser.profilePicture && (
                  <>
                    <Button
                      type="button"
                      variant="outline-primary"
                      size="sm"
                      onClick={handleAdjustPhoto}
                      disabled={uploadingPhoto}
                    >
                      Ajustar foto
                    </Button>
                    <Button
                      type="button"
                      variant="outline-danger"
                      size="sm"
                      onClick={handleRemovePhoto}
                      disabled={uploadingPhoto}
                    >
                      {uploadingPhoto ? 'Procesando...' : 'Quitar foto'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      <ProfilePhotoEditor
        show={photoEditorOpen}
        imageSource={photoEditorSource}
        onClose={handleClosePhotoEditor}
        onSave={handleSavePhoto}
      />

      <UserFollowList
        title="Personas que sigo"
        users={following}
        emptyMessage="Todavía no seguís a nadie. Visitá perfiles y tocá Seguir."
      />

      <h2 className="h5 mb-3">Mis publicaciones</h2>

      {loading && (
        <div className="text-center py-4">
          <Spinner animation="border" size="sm" /> Cargando...
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && posts.length === 0 && (
        <Alert variant="info">Todavía no publicaste nada. ¡Creá tu primer post!</Alert>
      )}

      <Row xs={1} md={2} lg={3} className="g-4">
        {posts.map((post) => (
          <Col key={post.id}>
            <PostCard post={post} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}