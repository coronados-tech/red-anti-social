import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import { focusPrimerCampoConError } from '../utils/focusPrimerCampoConError';
import {
  CONTACTO_FORM_INICIAL,
  validarContacto,
  type ContactoFormData,
  type ContactoFormErrors,
} from '../utils/validacionContacto';

export default function FormularioContacto() {
  const [formData, setFormData] = useState<ContactoFormData>(CONTACTO_FORM_INICIAL);
  const [errores, setErrores] = useState<ContactoFormErrors>({});
  const [enviado, setEnviado] = useState(false);
  const [nombreConfirmado, setNombreConfirmado] = useState('');

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    const sanitizedValue = name === 'telefono' ? value.replace(/\D/g, '') : value;
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    setErrores((prev) => ({ ...prev, [name]: '' }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nuevosErrores = validarContacto(formData);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) {
      focusPrimerCampoConError(event.currentTarget);
      return;
    }

    setNombreConfirmado(formData.nombre.trim());
    setEnviado(true);
  }

  function volverAlFormulario() {
    setEnviado(false);
    setFormData(CONTACTO_FORM_INICIAL);
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
              placeholder="Ej: Juan"
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

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Teléfono (opcional)</Form.Label>
            <Form.Control
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              isInvalid={!!errores.telefono}
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Ej: 1123456789"
            />
            <Form.Control.Feedback type="invalid">{errores.telefono}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Asunto (opcional)</Form.Label>
            <Form.Control
              name="asunto"
              value={formData.asunto}
              onChange={handleChange}
              placeholder="Ej: Reporte de contenido"
            />
          </Form.Group>
        </Col>
      </Row>

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
