import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';

const estadoInicial = {
  nombre: '',
  email: '',
  asunto: '',
  mensaje: '',
};

type FormData = typeof estadoInicial;
type FormErrors = Partial<Record<keyof FormData, string>>;

function validarFormulario(formData: FormData): FormErrors {
  const errores: FormErrors = {};

  if (!formData.nombre.trim()) {
    errores.nombre = 'El nombre es obligatorio';
  } else if (formData.nombre.trim().length < 2) {
    errores.nombre = 'El nombre debe tener al menos 2 caracteres';
  }

  if (!formData.email.trim()) {
    errores.email = 'El email es obligatorio';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errores.email = 'Ingresá un email válido';
  }

  if (!formData.mensaje.trim()) {
    errores.mensaje = 'El mensaje es obligatorio';
  } else if (formData.mensaje.trim().length < 10) {
    errores.mensaje = 'El mensaje debe tener al menos 10 caracteres';
  }

  return errores;
}

export default function FormularioContacto() {
  const [formData, setFormData] = useState(estadoInicial);
  const [errores, setErrores] = useState<FormErrors>({});
  const [enviado, setEnviado] = useState(false);
  const [nombreConfirmado, setNombreConfirmado] = useState('');

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: '' }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nuevosErrores = validarFormulario(formData);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setNombreConfirmado(formData.nombre.trim());
    setEnviado(true);
  }

  function volverAlFormulario() {
    setEnviado(false);
    setFormData(estadoInicial);
    setErrores({});
  }

  if (enviado) {
    return (
      <Alert variant="success" className="border-0">
        <Alert.Heading>¡Mensaje enviado!</Alert.Heading>
        <p className="mb-3">
          Gracias {nombreConfirmado}. Recibimos tu consulta y te responderemos a la brevedad por
          email. (Simulación: no se envió ningún correo real.)
        </p>
        <Button variant="outline-primary" size="sm" onClick={volverAlFormulario}>
          Enviar otro mensaje
        </Button>
      </Alert>
    );
  }

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre *</Form.Label>
            <Form.Control
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              isInvalid={!!errores.nombre}
              placeholder="Ej: Carla"
            />
            <Form.Control.Feedback type="invalid">{errores.nombre}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Email *</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!errores.email}
              placeholder="ejemplo@mail.com"
            />
            <Form.Control.Feedback type="invalid">{errores.email}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Asunto (opcional)</Form.Label>
        <Form.Control
          name="asunto"
          value={formData.asunto}
          onChange={handleChange}
          placeholder="Ej: Reporte de contenido"
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Mensaje *</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="mensaje"
          value={formData.mensaje}
          onChange={handleChange}
          isInvalid={!!errores.mensaje}
          placeholder="Contanos en qué podemos ayudarte..."
        />
        <Form.Control.Feedback type="invalid">{errores.mensaje}</Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" variant="primary">
        Enviar consulta
      </Button>
    </Form>
  );
}