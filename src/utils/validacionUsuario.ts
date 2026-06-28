export function fechaLimiteNacimiento(edad: number): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() - edad);
  return date.toISOString().slice(0, 10);
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NICKNAME_REGEX = /^[a-zA-Z0-9_.-]+$/;
const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
const PASSWORD_REGEX = /^[a-zA-Z0-9_.-]+$/;

export interface UsuarioFormData {
  nickname: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: string;
  gender: string;
}

export type UsuarioFormErrors = Partial<Record<keyof UsuarioFormData, string>>;

export interface RegistroConsentData {
  acceptTerms: boolean;
  declareOver16: boolean;
}

export type RegistroConsentErrors = Partial<Record<keyof RegistroConsentData, string>>;

function validarNickname(nickname: string, errores: UsuarioFormErrors) {
  const value = nickname.trim();
  if (!value) {
    errores.nickname = 'El nickname es obligatorio';
  } else if (value.length < 3) {
    errores.nickname = 'El nickname debe tener al menos 3 caracteres';
  } else if (value.length > 30) {
    errores.nickname = 'El nickname no puede tener más de 30 caracteres';
  } else if (!NICKNAME_REGEX.test(value)) {
    errores.nickname =
      'El nickname solo puede contener letras, números, guiones bajos, puntos y guiones';
  }
}

function validarNombre(name: string, errores: UsuarioFormErrors) {
  const value = name.trim();
  if (!value) {
    errores.name = 'El nombre es obligatorio';
  } else if (value.length < 3) {
    errores.name = 'El nombre debe tener al menos 3 caracteres';
  } else if (value.length > 100) {
    errores.name = 'El nombre no puede tener más de 100 caracteres';
  } else if (!NAME_REGEX.test(value)) {
    errores.name = 'El nombre solo puede contener letras, acentos, ñ y espacios';
  }
}

function validarApellido(lastName: string, errores: UsuarioFormErrors) {
  const value = lastName.trim();
  if (!value) {
    errores.lastName = 'El apellido es obligatorio';
  } else if (value.length < 3) {
    errores.lastName = 'El apellido debe tener al menos 3 caracteres';
  } else if (value.length > 100) {
    errores.lastName = 'El apellido no puede tener más de 100 caracteres';
  } else if (!NAME_REGEX.test(value)) {
    errores.lastName = 'El apellido solo puede contener letras, acentos, ñ y espacios';
  }
}

function validarEmail(email: string, errores: UsuarioFormErrors) {
  const value = email.trim();
  if (!value) {
    errores.email = 'El email es obligatorio';
  } else if (!EMAIL_REGEX.test(value)) {
    errores.email = 'Ingresá un email válido';
  }
}

function validarPassword(password: string, errores: UsuarioFormErrors) {
  if (!password) {
    errores.password = 'La contraseña es obligatoria';
  } else if (password.length < 6) {
    errores.password = 'La contraseña debe tener al menos 6 caracteres';
  } else if (!PASSWORD_REGEX.test(password)) {
    errores.password =
      'La contraseña solo puede contener letras, números, guiones bajos, puntos y guiones';
  }
}

function validarFechaNacimiento(birthDate: string, errores: UsuarioFormErrors) {
  if (!birthDate.trim()) {
    errores.birthDate = 'La fecha de nacimiento es obligatoria';
    return;
  }

  const parsed = new Date(`${birthDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    errores.birthDate = 'La fecha de nacimiento debe ser una fecha válida';
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (parsed >= today) {
    errores.birthDate = 'La fecha de nacimiento debe ser anterior a hoy';
    return;
  }

  const fechaMaxima = new Date(today);
  fechaMaxima.setFullYear(today.getFullYear() - 16);
  if (parsed > fechaMaxima) {
    errores.birthDate = 'Debés tener al menos 16 años para registrarte';
    return;
  }

  const fechaMinima = new Date(today);
  fechaMinima.setFullYear(today.getFullYear() - 100);
  if (parsed < fechaMinima) {
    errores.birthDate = 'La edad no puede ser mayor a 100 años';
  }
}

function validarGenero(gender: string, errores: UsuarioFormErrors) {
  const value = gender.trim().toLowerCase();
  if (!value) {
    errores.gender = 'El género es obligatorio';
  } else if (!['masculino', 'femenino', 'x', 'otro'].includes(value)) {
    errores.gender = 'El género debe ser Masculino, Femenino o X';
  }
}

export function validarRegistro(formData: UsuarioFormData): UsuarioFormErrors {
  const errores: UsuarioFormErrors = {};

  validarNickname(formData.nickname, errores);
  validarNombre(formData.name, errores);
  validarApellido(formData.lastName, errores);
  validarEmail(formData.email, errores);
  validarPassword(formData.password, errores);
  validarFechaNacimiento(formData.birthDate, errores);
  validarGenero(formData.gender, errores);

  return errores;
}

export function validarRegistroConsent(consent: RegistroConsentData): RegistroConsentErrors {
  const errores: RegistroConsentErrors = {};

  if (!consent.acceptTerms) {
    errores.acceptTerms = 'Debés aceptar los términos y condiciones para registrarte';
  }

  if (!consent.declareOver16) {
    errores.declareOver16 = 'Debés declarar que sos mayor de 16 años';
  }

  return errores;
}

export function validarPerfil(formData: UsuarioFormData): UsuarioFormErrors {
  const errores: UsuarioFormErrors = {};

  validarNickname(formData.nickname, errores);
  validarNombre(formData.name, errores);
  validarApellido(formData.lastName, errores);
  validarEmail(formData.email, errores);
  validarFechaNacimiento(formData.birthDate, errores);
  validarGenero(formData.gender, errores);

  if (!formData.password) {
    errores.password = 'Ingresá tu contraseña para guardar los cambios.';
  } else if (formData.password.length < 6) {
    errores.password = 'La contraseña debe tener al menos 6 caracteres';
  } else if (!PASSWORD_REGEX.test(formData.password)) {
    errores.password =
      'La contraseña solo puede contener letras, números, guiones bajos, puntos y guiones';
  }

  return errores;
}

export interface LoginFormData {
  identifier: string;
  password: string;
}

export type LoginFormErrors = Partial<Record<keyof LoginFormData, string>>;

export function validarLogin(formData: LoginFormData): LoginFormErrors {
  const errores: LoginFormErrors = {};
  const identifier = formData.identifier.trim();

  if (!identifier) {
    errores.identifier = 'El nickname o email es obligatorio';
  } else if (identifier.includes('@')) {
    if (!EMAIL_REGEX.test(identifier)) {
      errores.identifier = 'Ingresá un email válido';
    }
  } else if (identifier.length < 3) {
    errores.identifier = 'El nickname debe tener al menos 3 caracteres';
  } else if (!NICKNAME_REGEX.test(identifier)) {
    errores.identifier =
      'El nickname solo puede contener letras, números, guiones bajos, puntos y guiones';
  }

  if (!formData.password) {
    errores.password = 'La contraseña es obligatoria';
  } else if (formData.password.length < 6) {
    errores.password = 'La contraseña debe tener al menos 6 caracteres';
  }

  return errores;
}
