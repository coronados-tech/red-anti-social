import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import { loginUser } from "../api/users";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!loginValue.trim() || !password.trim()) {
      setError("Completá usuario/nickname y contraseña.");
      return;
    }

    setLoading(true);

    try {
      const { user } = await loginUser(loginValue.trim(), password);
      login(user);
      navigate("/perfil");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="form-card">
            <Card.Body>
              <h1 className="h3 mb-3">Iniciar sesión</h1>
              <p className="text-muted small">
                Ingresá con tu email o nickname y la contraseña registrada en el
                backend.
              </p>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="login-identifier">
                  <Form.Label>Usuario o nickname</Form.Label>
                  <Form.Control
                    type="text"
                    value={loginValue}
                    onChange={(e) => setLoginValue(e.target.value)}
                    placeholder="tu@email.com o tu_nickname"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="login-password">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="123456"
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="w-100"
                >
                  {loading ? "Ingresando..." : "Entrar"}
                </Button>
              </Form>

              <p className="mt-3 mb-0 small text-center">
                ¿No tenés cuenta? <Link to="/registro">Registrate acá</Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
