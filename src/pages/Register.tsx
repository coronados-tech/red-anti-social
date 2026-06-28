import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { createUser, uploadProfilePicture } from '../api';
import ProfilePhotoPicker from '../components/ProfilePhotoPicker';
import UsuarioFormFields from '../components/UsuarioFormFields';
import PageContainer from '../components/PageContainer';
import { focusPrimerCampoConError } from '../utils/focusPrimerCampoConError';
import {
  validarRegistro,
  validarRegistroConsent,
  type RegistroConsentErrors,
  type UsuarioFormErrors,
} from '../utils/validacionUsuario';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nickname: '',
    name: '',
    lastName: '',
    email: '',
    password: '',
    birthDate: '1990-01-01',
    gender: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [declareOver16, setDeclareOver16] = useState(false);
  const [pendingPhotoFile, setPendingPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [errores, setErrores] = useState<UsuarioFormErrors>({});
  const [consentErrores, setConsentErrores] = useState<RegistroConsentErrors>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
    };
  }, [photoPreviewUrl]);

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrores((prev) => ({ ...prev, [field]: '' }));
  }

  function handlePhotoReady(file: File | null) {
    setPhotoPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
    setPendingPhotoFile(file);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setSuccess('');

    const nuevosErrores = validarRegistro(form);
    const nuevosConsentErrores = validarRegistroConsent({ acceptTerms, declareOver16 });
    setErrores(nuevosErrores);
    setConsentErrores(nuevosConsentErrores);

    if (
      Object.keys(nuevosErrores).length > 0 ||
      Object.keys(nuevosConsentErrores).length > 0
    ) {
      focusPrimerCampoConError(event.currentTarget);
      return;
    }

    setLoading(true);

    try {
      const createdUser = await createUser(form);

      if (pendingPhotoFile) {
        try {
          await uploadProfilePicture(createdUser.id, pendingPhotoFile);
        } catch {
          setSuccess(
            'Usuario creado, pero no se pudo subir la foto. Podés agregarla desde tu perfil.',
          );
          setTimeout(() => navigate('/login'), 2500);
          return;
        }
      }

      setSuccess('Usuario creado. Ahora podés iniciar sesión con tu email/nickname y contraseña.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear el usuario');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageContainer fill>
      <h1 className="h2 mb-3">Registro</h1>
      <p className="text-muted mb-4">
        Completá tus datos para crear una cuenta en Anti-Social Net.
      </p>

      <Card className="form-card">
        <Card.Body className="p-4">
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit} noValidate>
            <ProfilePhotoPicker
              controlId="reg-profile-photo"
              user={{
                nickname: form.nickname,
                name: form.name,
                lastName: form.lastName,
              }}
              previewUrl={photoPreviewUrl}
              disabled={loading}
              onPhotoReady={handlePhotoReady}
            />

            <UsuarioFormFields
              idPrefix="reg"
              form={form}
              errores={errores}
              onFieldChange={updateField}
              passwordMode="register"
              showBirthDateLimits
            />

            <Form.Group className="mb-3" controlId="reg-declare-over16">
              <Form.Check
                type="checkbox"
                checked={declareOver16}
                onChange={(e) => {
                  setDeclareOver16(e.target.checked);
                  setConsentErrores((prev) => ({ ...prev, declareOver16: '' }));
                }}
                isInvalid={!!consentErrores.declareOver16}
                label="Declaro que soy una persona mayor de 16 años"
                feedback={consentErrores.declareOver16}
                feedbackType="invalid"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="reg-accept-terms">
              <Form.Check
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => {
                  setAcceptTerms(e.target.checked);
                  setConsentErrores((prev) => ({ ...prev, acceptTerms: '' }));
                }}
                isInvalid={!!consentErrores.acceptTerms}
                label={
                  <>
                    Acepto los{' '}
                    <Link to="/terminos" target="_blank" rel="noopener noreferrer">
                      términos y condiciones
                    </Link>
                  </>
                }
                feedback={consentErrores.acceptTerms}
                feedbackType="invalid"
              />
            </Form.Group>

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </Button>
          </Form>

          <p className="mt-3 mb-0 small">
            ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
          </p>
        </Card.Body>
      </Card>
    </PageContainer>
  );
}
