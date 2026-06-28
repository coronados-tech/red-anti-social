import { Link } from 'react-router-dom';
import { Card, Col, Row } from 'react-bootstrap';
import FormularioContacto from '../components/FormularioContacto';
import BackLink from '../components/BackLink';
import PageContainer from '../components/PageContainer';
import { integrantes } from '../data/integrantes';

export default function Contact() {
  return (
    <PageContainer fill>
      <BackLink to="/">Volver al inicio</BackLink>

      <Row className="g-4">
        <Col lg={5}>
          <h1 className="h2 mb-3">Contacto</h1>
          <p className="text-muted mb-4">
            ¿Tenés dudas sobre el proyecto, encontraste un error o querés reportar contenido
            inapropiado? Escribinos y te respondemos a la brevedad.
          </p>

          <Card className="form-card mb-3">
            <Card.Body>
              <h2 className="h6">Email</h2>
              <p className="text-muted small mb-0">
                <a href="mailto:coronados.tech@unahur.edu.ar">coronados.tech@unahur.edu.ar</a>
              </p>
            </Card.Body>
          </Card>

          <Card className="form-card mb-3">
            <Card.Body>
              <h2 className="h6">Institución</h2>
              <p className="text-muted small mb-0">
                Universidad Nacional de Hurlingham
                <br />
                Construcción de Interfaces de Usuario (CIU)
              </p>
            </Card.Body>
          </Card>

          <Card className="form-card mb-3">
            <Card.Body>
              <h2 className="h6">Integrantes</h2>
              <ul className="text-muted small mb-0 ps-3">
                {integrantes.map((persona) => (
                  <li key={persona.dni}>
                    {persona.nombre} {persona.apellido}
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>

          <p className="text-muted small mb-0">
            Para reportar contenido, también podés consultar nuestros{' '}
            <Link to="/terminos">términos y condiciones</Link>.
          </p>
        </Col>

        <Col lg={7}>
          <Card className="form-card">
            <Card.Body className="p-4">
              <h2 className="h5 mb-4">Formulario de contacto</h2>
              <FormularioContacto />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
}
