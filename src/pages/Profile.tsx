import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap';
import PageContainer from '../components/PageContainer';
import {
  deleteProfilePicture,
  getUserById,
  updateUser,
  uploadProfilePicture,
} from '../api';
import ProfileAvatar from '../components/ProfileAvatar';
import ProfilePhotoEditor from '../components/ProfilePhotoEditor';
import UsuarioFormFields from '../components/UsuarioFormFields';
import { useAuth } from '../context/AuthContext';
import { useAsyncData } from '../hooks/useAsyncData';
import type { User } from '../types';
import { focusPrimerCampoConError } from '../utils/focusPrimerCampoConError';
import { userToProfileForm } from '../utils/userProfile';
import { validarPerfil, type UsuarioFormErrors } from '../utils/validacionUsuario';

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

interface ProfileData {
  profileUser: User;
  form: ProfileForm;
}

export default function Profile() {
  const { user, updateSessionUser } = useAuth();

  const {
    data: profileData,
    loading,
    error,
    setData: setProfileData,
  } = useAsyncData<ProfileData>(
    async () => {
      const freshUser = await getUserById(user!.id, user!.id);
      return {
        profileUser: freshUser,
        form: { ...userToProfileForm(freshUser), password: '' },
      };
    },
    [user?.id],
    { enabled: !!user },
  );

  const profileUser = profileData?.profileUser ?? null;
  const form = profileData?.form ?? null;

  const [errores, setErrores] = useState<UsuarioFormErrors>({});
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [photoSuccess, setPhotoSuccess] = useState('');
  const [photoEditorOpen, setPhotoEditorOpen] = useState(false);
  const [photoEditorSource, setPhotoEditorSource] = useState<string | File | null>(null);

  function updateField(field: keyof ProfileForm, value: string | boolean) {
    setProfileData((prev) =>
      prev ? { ...prev, form: { ...prev.form, [field]: value } } : prev,
    );
    if (field !== 'isProfilePublic') {
      setErrores((prev) => ({ ...prev, [field]: '' }));
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!user || !form) return;

    setSaveError('');
    setSaveSuccess('');

    const nuevosErrores = validarPerfil(form);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) {
      focusPrimerCampoConError(event.currentTarget);
      return;
    }

    setSaving(true);

    try {
      const updated = await updateUser(user.id, {
        nickname: form.nickname.trim(),
        name: form.name.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        birthDate: form.birthDate,
        gender: form.gender,
        isProfilePublic: form.isProfilePublic,
      });

      setProfileData({
        profileUser: updated,
        form: { ...userToProfileForm(updated), password: '' },
      });
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
      const updated = await uploadProfilePicture(user.id, file);
      setProfileData((prev) =>
        prev ? { ...prev, profileUser: updated } : prev,
      );
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
      await deleteProfilePicture(user.id);
      const updated = { ...profileUser, profilePicture: null };
      setProfileData((prev) =>
        prev ? { ...prev, profileUser: updated } : prev,
      );
      updateSessionUser(updated);
      setPhotoSuccess('Foto de perfil eliminada.');
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : 'No se pudo eliminar la foto');
    } finally {
      setUploadingPhoto(false);
    }
  }

  if (!user) return null;

  if (loading && !form) {
    return (
      <PageContainer className="text-center">
        <Spinner animation="border" size="sm" /> Cargando perfil...
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Alert variant="danger">{error}</Alert>
      </PageContainer>
    );
  }

  if (!form || !profileUser) return null;

  return (
    <PageContainer>
      <Card className="form-card">
        <Card.Body>
          <h1 className="h4 mb-3">Mi perfil</h1>

          {saveError && <Alert variant="danger">{saveError}</Alert>}
          {saveSuccess && <Alert variant="success">{saveSuccess}</Alert>}

          <Form onSubmit={handleSubmit} noValidate>
            <UsuarioFormFields
              idPrefix="profile"
              form={form}
              errores={errores}
              onFieldChange={updateField}
              passwordMode="confirm"
            />

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

          <h2 className="h6 mb-3">Foto de perfil</h2>
          {photoError && <Alert variant="danger">{photoError}</Alert>}
          {photoSuccess && <Alert variant="success">{photoSuccess}</Alert>}

          <div className="d-flex flex-wrap align-items-center gap-3">
            <ProfileAvatar user={profileUser} size="md" />
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
    </PageContainer>
  );
}
