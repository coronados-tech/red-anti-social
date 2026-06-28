import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import PageContainer from '../components/PageContainer';

export default function NotFound() {
  return (
    <PageContainer className="text-center">
      <p className="display-1 fw-bold text-muted mb-2">404</p>
      <h1 className="h2 mb-3">Página no encontrada</h1>
      <p className="text-muted mb-4">
        La dirección que ingresaste no existe o fue movida.
      </p>
      <Button as={Link} to="/" variant="primary">
        Volver al inicio
      </Button>
    </PageContainer>
  );
}
