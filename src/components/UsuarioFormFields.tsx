import { Link } from 'react-router-dom';
import { Col, Form, Row } from 'react-bootstrap';
import { GENDER_OPTIONS } from '../constants/genderOptions';
import { fechaLimiteNacimiento, type UsuarioFormErrors } from '../utils/validacionUsuario';

export interface UsuarioFormValues {
  nickname: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: string;
  gender: string;
}

interface UsuarioFormFieldsProps {
  idPrefix: string;
  form: UsuarioFormValues;
  errores: UsuarioFormErrors;
  onFieldChange: (field: keyof UsuarioFormValues, value: string) => void;
  passwordMode?: 'register' | 'confirm';
  showBirthDateLimits?: boolean;
}

function BirthDateField({
  idPrefix,
  value,
  error,
  showBirthDateLimits,
  onFieldChange,
}: {
  idPrefix: string;
  value: string;
  error?: string;
  showBirthDateLimits?: boolean;
  onFieldChange: (field: keyof UsuarioFormValues, value: string) => void;
}) {
  return (
    <Form.Group className="mb-3" controlId={`${idPrefix}-birthDate`}>
      <Form.Label>Fecha de nacimiento *</Form.Label>
      <Form.Control
        type="date"
        value={value}
        max={showBirthDateLimits ? fechaLimiteNacimiento(16) : undefined}
        min={showBirthDateLimits ? fechaLimiteNacimiento(100) : undefined}
        onChange={(e) => onFieldChange('birthDate', e.target.value)}
        isInvalid={!!error}
      />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  );
}

function GenderField({
  idPrefix,
  value,
  error,
  onFieldChange,
  showPlaceholder = false,
}: {
  idPrefix: string;
  value: string;
  error?: string;
  onFieldChange: (field: keyof UsuarioFormValues, value: string) => void;
  showPlaceholder?: boolean;
}) {
  return (
    <Form.Group className="mb-3" controlId={`${idPrefix}-gender`}>
      <Form.Label>Género *</Form.Label>
      <Form.Select
        value={value}
        onChange={(e) => onFieldChange('gender', e.target.value)}
        isInvalid={!!error}
      >
        {showPlaceholder && (
          <option value="" disabled>
            Seleccionar
          </option>
        )}
        {GENDER_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  );
}

export default function UsuarioFormFields({
  idPrefix,
  form,
  errores,
  onFieldChange,
  passwordMode = 'register',
  showBirthDateLimits = false,
}: UsuarioFormFieldsProps) {
  return (
    <>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId={`${idPrefix}-nickname`}>
            <Form.Label>Nickname *</Form.Label>
            <Form.Control
              value={form.nickname}
              onChange={(e) => onFieldChange('nickname', e.target.value)}
              isInvalid={!!errores.nickname}
            />
            <Form.Control.Feedback type="invalid">{errores.nickname}</Form.Control.Feedback>
            <Form.Text className="text-muted">
              Usá un nickname respetuoso. No se permiten referencias a figuras de odio ni
              contenido ofensivo.{' '}
              <Link to="/terminos" target="_blank" rel="noopener noreferrer">
                Ver normas
              </Link>
              .
            </Form.Text>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId={`${idPrefix}-email`}>
            <Form.Label>Email *</Form.Label>
            <Form.Control
              type="email"
              value={form.email}
              onChange={(e) => onFieldChange('email', e.target.value)}
              isInvalid={!!errores.email}
            />
            <Form.Control.Feedback type="invalid">{errores.email}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId={`${idPrefix}-name`}>
            <Form.Label>Nombre *</Form.Label>
            <Form.Control
              value={form.name}
              onChange={(e) => onFieldChange('name', e.target.value)}
              isInvalid={!!errores.name}
            />
            <Form.Control.Feedback type="invalid">{errores.name}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3" controlId={`${idPrefix}-lastName`}>
            <Form.Label>Apellido *</Form.Label>
            <Form.Control
              value={form.lastName}
              onChange={(e) => onFieldChange('lastName', e.target.value)}
              isInvalid={!!errores.lastName}
            />
            <Form.Control.Feedback type="invalid">{errores.lastName}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        {passwordMode === 'register' ? (
          <>
            <Col md={6}>
              <Form.Group className="mb-3" controlId={`${idPrefix}-password`}>
                <Form.Label>Contraseña *</Form.Label>
                <Form.Control
                  type="password"
                  value={form.password}
                  onChange={(e) => onFieldChange('password', e.target.value)}
                  isInvalid={!!errores.password}
                />
                <Form.Control.Feedback type="invalid">{errores.password}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <BirthDateField
                idPrefix={idPrefix}
                value={form.birthDate}
                error={errores.birthDate}
                showBirthDateLimits={showBirthDateLimits}
                onFieldChange={onFieldChange}
              />
            </Col>
          </>
        ) : (
          <>
            <Col md={6}>
              <BirthDateField
                idPrefix={idPrefix}
                value={form.birthDate}
                error={errores.birthDate}
                onFieldChange={onFieldChange}
              />
            </Col>
            <Col md={6}>
              <GenderField
                idPrefix={idPrefix}
                value={form.gender}
                error={errores.gender}
                onFieldChange={onFieldChange}
              />
            </Col>
          </>
        )}
      </Row>

      {passwordMode === 'register' ? (
        <GenderField
          idPrefix={idPrefix}
          value={form.gender}
          error={errores.gender}
          onFieldChange={onFieldChange}
          showPlaceholder
        />
      ) : (
        <Form.Group className="mb-3" controlId={`${idPrefix}-password`}>
          <Form.Label>Contraseña *</Form.Label>
          <Form.Control
            type="password"
            value={form.password}
            onChange={(e) => onFieldChange('password', e.target.value)}
            placeholder="Ingresá tu contraseña para confirmar"
            isInvalid={!!errores.password}
          />
          <Form.Control.Feedback type="invalid">{errores.password}</Form.Control.Feedback>
          <Form.Text className="text-muted">
            La API pide la contraseña cada vez que guardás cambios.
          </Form.Text>
        </Form.Group>
      )}
    </>
  );
}
