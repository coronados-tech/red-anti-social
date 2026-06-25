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
import { createUser } from "../api/users";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nickname: "",
    name: "",
    lastName: "",
    email: "",
    password: "",
    birthDate: "",
    gender: "otro",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const required = Object.entries(form).filter(
      ([key, value]) => key !== "gender" && !value.trim(),
    );
    if (required.length > 0) {
      setError("Completá todos los campos obligatorios.");
      return;
    }

    setLoading(true);

    try {
      await createUser(form);
      setSuccess(
        "Usuario creado. Ahora podés iniciar sesión con la clave 123456.",
      );
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo crear el usuario",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} lg={7}>
          <Card className="form-card">
            <Card.Body>
              <h1 className="h3 mb-3">Registro</h1>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="reg-nickname">
                      <Form.Label>Nickname *</Form.Label>
                      <Form.Control
                        value={form.nickname}
                        onChange={(e) =>
                          updateField("nickname", e.target.value)
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="reg-email">
                      <Form.Label>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="reg-name">
                      <Form.Label>Nombre *</Form.Label>
                      <Form.Control
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="reg-lastName">
                      <Form.Label>Apellido *</Form.Label>
                      <Form.Control
                        value={form.lastName}
                        onChange={(e) =>
                          updateField("lastName", e.target.value)
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="reg-password">
                      <Form.Label>Contraseña *</Form.Label>
                      <Form.Control
                        type="password"
                        value={form.password}
                        onChange={(e) =>
                          updateField("password", e.target.value)
                        }
                        minLength={6}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="reg-birthDate">
                      <Form.Label>Fecha de nacimiento *</Form.Label>
                      <Form.Control
                        type="date"
                        value={form.birthDate}
                        onChange={(e) =>
                          updateField("birthDate", e.target.value)
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3" controlId="reg-gender">
                  <Form.Label>Género *</Form.Label>
                  <Form.Select
                    value={form.gender}
                    onChange={(e) => updateField("gender", e.target.value)}
                  >
                    <option value="femenino">Femenino</option>
                    <option value="masculino">Masculino</option>
                    <option value="otro">Otro</option>
                  </Form.Select>
                </Form.Group>

                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? "Registrando..." : "Crear cuenta"}
                </Button>
              </Form>

              <p className="mt-3 mb-0 small">
                ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
