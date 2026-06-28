import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap';
import { loginUser } from '../api';
import PageContainer from '../components/PageContainer';
import { useAuth } from '../context/AuthContext';
import { focusPrimerCampoConError } from '../utils/focusPrimerCampoConError';
import { validarLogin, type LoginFormErrors } from '../utils/validacionUsuario';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState<LoginFormErrors>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    const nuevosErrores = validarLogin({ identifier: loginValue, password });
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) {
      focusPrimerCampoConError(event.currentTarget);
      return;
    }

    setLoading(true);

    try {
      const { user } = await loginUser(loginValue.trim(), password);
      login(user);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageContainer fill>
      <Row className="g-4">
        <Col lg={5}>
          <h1 className="h2 mb-3">Iniciar sesión</h1>
          <p className="text-muted mb-0">
            Ingresá con tu email o nickname y la contraseña registrada en el backend.
          </p>
        </Col>

        <Col lg={7}>
          <Card className="form-card">
            <Card.Body className="p-4">
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit} noValidate>
                <Form.Group className="mb-3" controlId="login-identifier">
                  <Form.Label>Usuario o nickname</Form.Label>
                  <Form.Control
                    type="text"
                    value={loginValue}
                    onChange={(e) => {
                      setLoginValue(e.target.value);
                      setErrores((prev) => ({ ...prev, identifier: '' }));
                    }}
                    placeholder="tu@email.com o tu_nickname"
                    isInvalid={!!errores.identifier}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.identifier}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="login-password">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrores((prev) => ({ ...prev, password: '' }));
                    }}
                    placeholder="123456"
                    isInvalid={!!errores.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button type="submit" variant="primary" disabled={loading} className="w-100">
                  {loading ? 'Ingresando...' : 'Entrar'}
                </Button>
              </Form>

              <p className="mt-3 mb-0 small">
                ¿No tenés cuenta? <Link to="/registro">Registrate acá</Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
}
