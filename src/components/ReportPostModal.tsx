import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { focusPrimerCampoConError } from '../utils/focusPrimerCampoConError';
import {
  REPORTE_MOTIVOS,
  validarReportePost,
  type ReportePostErrors,
  type ReportePostForm,
} from '../utils/validacionReportePost';

const estadoInicial: ReportePostForm = {
  motivo: '',
  descripcion: '',
  email: '',
  declaracion: false,
};

interface ReportPostModalProps {
  show: boolean;
  onHide: () => void;
  postTitulo: string;
  postSlug: string;
}

export default function ReportPostModal({
  show,
  onHide,
  postTitulo,
  postSlug,
}: ReportPostModalProps) {
  const { user } = useAuth();
  const [form, setForm] = useState(estadoInicial);
  const [errores, setErrores] = useState<ReportePostErrors>({});
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    if (!show) return;

    setForm(estadoInicial);
    setErrores({});
    setEnviado(false);
  }, [show, postSlug]);

  function handleClose() {
    onHide();
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: '' }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nuevosErrores = validarReportePost(form, !user);
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      focusPrimerCampoConError(event.currentTarget);
      return;
    }

    setEnviado(true);
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Reportar publicación</Modal.Title>
      </Modal.Header>

      {enviado ? (
        <>
          <Modal.Body>
            <Alert variant="success" className="mb-0 border-0">
              <Alert.Heading className="h6">Reporte recibido</Alert.Heading>
              <p className="mb-0 small">
                Gracias por ayudarnos a cuidar la comunidad. Registramos tu reporte sobre{' '}
                <strong>{postTitulo}</strong>.
              </p>
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              Cerrar
            </Button>
          </Modal.Footer>
        </>
      ) : (
        <Form onSubmit={handleSubmit} noValidate>
          <Modal.Body>
            <p className="text-muted small">
              Estás reportando: <strong>{postTitulo}</strong>
            </p>

            {user ? (
              <p className="text-muted small">
                Reportás como <strong>@{user.nickname}</strong>
              </p>
            ) : (
              <Alert variant="light" className="small py-2">
                <Link to="/login">Iniciá sesión</Link> para reportar con tu cuenta o completá tu
                email abajo.
              </Alert>
            )}

            <Form.Group className="mb-3" controlId="report-motivo">
              <Form.Label>Motivo del reporte *</Form.Label>
              <Form.Select
                name="motivo"
                value={form.motivo}
                onChange={handleChange}
                isInvalid={!!errores.motivo}
              >
                <option value="">Seleccionar motivo</option>
                {REPORTE_MOTIVOS.map((motivo) => (
                  <option key={motivo.value} value={motivo.value}>
                    {motivo.label}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errores.motivo}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="report-descripcion">
              <Form.Label>Descripción *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                isInvalid={!!errores.descripcion}
                maxLength={500}
                placeholder="Contanos qué contenido incumple las normas de la comunidad..."
              />
              <Form.Control.Feedback type="invalid">{errores.descripcion}</Form.Control.Feedback>
            </Form.Group>

            {!user && (
              <Form.Group className="mb-3" controlId="report-email">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  isInvalid={!!errores.email}
                  placeholder="ejemplo@mail.com"
                />
                <Form.Control.Feedback type="invalid">{errores.email}</Form.Control.Feedback>
              </Form.Group>
            )}

            <Form.Group controlId="report-declaracion">
              <Form.Check
                type="checkbox"
                name="declaracion"
                checked={form.declaracion}
                onChange={(event) => {
                  setForm((prev) => ({ ...prev, declaracion: event.target.checked }));
                  setErrores((prev) => ({ ...prev, declaracion: '' }));
                }}
                isInvalid={!!errores.declaracion}
                label="Confirmo que este reporte es de buena fe y se basa en un incumplimiento real de las normas"
                feedback={errores.declaracion}
                feedbackType="invalid"
              />
            </Form.Group>

            <p className="text-muted small mb-0 mt-3">
              Consultá las{' '}
              <Link to="/terminos" target="_blank" rel="noopener noreferrer">
                normas de la comunidad
              </Link>
              .
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="danger">
              Enviar reporte
            </Button>
          </Modal.Footer>
        </Form>
      )}
    </Modal>
  );
}
