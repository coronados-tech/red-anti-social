import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';

const footerLinks = [
  { to: '/nosotros', label: 'Sobre nosotros' },
  { to: '/terminos', label: 'Términos y condiciones' },
  { to: '/privacidad', label: 'Política de privacidad' },
  { to: '/contacto', label: 'Contacto' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <Container>
        <Row className="g-3">
          <Col md={4}>
            <h2 className="footer-title h6">UnaHur Anti-Social Net</h2>
            <p className="footer-text small mb-0">
              Red social académica desarrollada por Coronados Tech para la materia CIU.
              Proyecto demostrativo con fines educativos.
            </p>
          </Col>

          <Col md={4}>
            <h2 className="footer-title h6">Información legal</h2>
            <ul className="footer-links list-unstyled small mb-0">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </Col>

          <Col md={4}>
            <h2 className="footer-title h6">Contacto</h2>
            <ul className="footer-text list-unstyled small mb-0">
              <li>Universidad Nacional de Hurlingham</li>
              <li>
                <a href="mailto:coronados.tech@unahur.edu.ar">coronados.tech@unahur.edu.ar</a>
              </li>
              <li>Villa Tesei, Buenos Aires, Argentina</li>
            </ul>
          </Col>
        </Row>

        <hr className="footer-divider" />

        <Row className="align-items-center">
          <Col md={8} className="small text-muted">
            © {year} Coronados Tech — Todos los derechos reservados.
          </Col>
          <Col md={4} className="small text-md-end text-muted mt-2 mt-md-0">
            Versión 1.0 · Trabajo Práctico CIU
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
