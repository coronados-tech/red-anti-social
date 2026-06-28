import { useState, type ChangeEvent } from 'react';
import { Button, Form } from 'react-bootstrap';
import ProfileAvatar, { type ProfileAvatarUser } from './ProfileAvatar';
import ProfilePhotoEditor from './ProfilePhotoEditor';

interface ProfilePhotoPickerProps {
  user: ProfileAvatarUser;
  previewUrl: string | null;
  disabled?: boolean;
  controlId?: string;
  onPhotoReady: (file: File | null) => void;
}

export default function ProfilePhotoPicker({
  user,
  previewUrl,
  disabled = false,
  controlId = 'profile-photo',
  onPhotoReady,
}: ProfilePhotoPickerProps) {
  const [photoEditorOpen, setPhotoEditorOpen] = useState(false);
  const [photoEditorSource, setPhotoEditorSource] = useState<string | File | null>(null);

  const avatarUser: ProfileAvatarUser = {
    ...user,
    profilePicture: previewUrl,
  };

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setPhotoEditorSource(file);
    setPhotoEditorOpen(true);
    event.target.value = '';
  }

  function handleAdjustPhoto() {
    if (!previewUrl) return;

    setPhotoEditorSource(previewUrl);
    setPhotoEditorOpen(true);
  }

  function handleClosePhotoEditor() {
    setPhotoEditorOpen(false);
    setPhotoEditorSource(null);
  }

  async function handleSavePhoto(file: File) {
    onPhotoReady(file);
  }

  return (
    <>
      <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
        <ProfileAvatar user={avatarUser} size="lg" />
        <div>
          <Form.Group controlId={controlId} className="mb-2">
            <Form.Label className="small mb-1">Foto de perfil (opcional)</Form.Label>
            <Form.Control
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              disabled={disabled}
            />
            <Form.Text className="text-muted">
              Elegí una imagen apropiada para la comunidad universitaria (sin símbolos de odio,
              violencia explícita ni contenido ofensivo).
            </Form.Text>
          </Form.Group>
          <div className="d-flex flex-wrap gap-2">
            {previewUrl && (
              <>
                <Button
                  type="button"
                  variant="outline-primary"
                  size="sm"
                  onClick={handleAdjustPhoto}
                  disabled={disabled}
                >
                  Ajustar foto
                </Button>
                <Button
                  type="button"
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onPhotoReady(null)}
                  disabled={disabled}
                >
                  Quitar foto
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <ProfilePhotoEditor
        show={photoEditorOpen}
        imageSource={photoEditorSource}
        onClose={handleClosePhotoEditor}
        onSave={handleSavePhoto}
      />
    </>
  );
}
