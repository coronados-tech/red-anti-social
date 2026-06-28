export const REPORTE_MOTIVOS = [
  { value: 'ofensivo', label: 'Contenido ofensivo o discriminatorio' },
  { value: 'odio', label: 'Incitación al odio' },
  { value: 'violencia', label: 'Violencia o contenido gráfico' },
  { value: 'acoso', label: 'Acoso o amenazas' },
  { value: 'spam', label: 'Spam o engaño' },
  { value: 'suplantacion', label: 'Suplantación de identidad' },
  { value: 'otro', label: 'Otro motivo' },
] as const;

export interface ReportePostForm {
  motivo: string;
  descripcion: string;
  email: string;
  declaracion: boolean;
}

export type ReportePostErrors = Partial<Record<keyof ReportePostForm, string>>;

export function validarReportePost(
  form: ReportePostForm,
  requiereEmail: boolean,
): ReportePostErrors {
  const errores: ReportePostErrors = {};

  if (!form.motivo.trim()) {
    errores.motivo = 'Seleccioná un motivo del reporte';
  } else if (!REPORTE_MOTIVOS.some((motivo) => motivo.value === form.motivo)) {
    errores.motivo = 'Seleccioná un motivo válido';
  }

  if (!form.descripcion.trim()) {
    errores.descripcion = 'La descripción es obligatoria';
  } else if (form.descripcion.trim().length < 10) {
    errores.descripcion = 'La descripción debe tener al menos 10 caracteres';
  } else if (form.descripcion.trim().length > 500) {
    errores.descripcion = 'La descripción no puede superar los 500 caracteres';
  }

  if (requiereEmail) {
    if (!form.email.trim()) {
      errores.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errores.email = 'Ingresá un email válido';
    }
  }

  if (!form.declaracion) {
    errores.declaracion = 'Debés confirmar que el reporte es de buena fe';
  }

  return errores;
}
