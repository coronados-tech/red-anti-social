export interface ContactoFormData {
  nombre: string;
  email: string;
  telefono: string;
  asunto: string;
  mensaje: string;
}

export type ContactoFormErrors = Partial<Record<keyof ContactoFormData, string>>;

export const CONTACTO_FORM_INICIAL: ContactoFormData = {
  nombre: '',
  email: '',
  telefono: '',
  asunto: '',
  mensaje: '',
};

export function validarContacto(formData: ContactoFormData): ContactoFormErrors {
  const errores: ContactoFormErrors = {};

  if (!formData.nombre.trim()) {
    errores.nombre = 'El nombre es obligatorio';
  } else if (formData.nombre.trim().length < 3) {
    errores.nombre = 'El nombre debe tener al menos 3 caracteres';
  }

  if (!formData.email.trim()) {
    errores.email = 'El email es obligatorio';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errores.email = 'Ingresá un email válido';
  }

  if (formData.telefono.trim() && formData.telefono.trim().length < 8) {
    errores.telefono = 'El teléfono debe tener al menos 8 dígitos';
  }

  if (!formData.mensaje.trim()) {
    errores.mensaje = 'El mensaje es obligatorio';
  } else if (formData.mensaje.trim().length < 10) {
    errores.mensaje = 'El mensaje debe tener al menos 10 caracteres';
  }

  return errores;
}
