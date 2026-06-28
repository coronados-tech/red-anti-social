const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export interface PostFormData {
  titulo: string;
  description: string;
  imageFiles?: File[];
}

export type PostFormErrors = Partial<Record<keyof PostFormData, string>>;

function validarTitulo(titulo: string, errores: PostFormErrors) {
  const value = titulo.trim();
  if (!value) {
    errores.titulo = 'El título es obligatorio';
  } else if (value.length > 200) {
    errores.titulo = 'El título no puede tener más de 200 caracteres';
  }
}

function validarDescription(description: string, errores: PostFormErrors) {
  const value = description.trim();
  if (!value) {
    errores.description = 'La descripción es obligatoria';
  } else if (value.length > 5000) {
    errores.description = 'La descripción no puede tener más de 5000 caracteres';
  }
}

function validarImagenes(imageFiles: File[] | undefined, errores: PostFormErrors) {
  if (!imageFiles || imageFiles.length === 0) return;

  const invalid = imageFiles.find((file) => !ALLOWED_IMAGE_TYPES.includes(file.type));
  if (invalid) {
    errores.imageFiles = 'Las imágenes deben ser JPG, PNG o WEBP';
  }
}

export function validarPost(formData: PostFormData): PostFormErrors {
  const errores: PostFormErrors = {};

  validarTitulo(formData.titulo, errores);
  validarDescription(formData.description, errores);
  validarImagenes(formData.imageFiles, errores);

  return errores;
}

export function validarNuevoTag(tagName: string): string | null {
  const value = tagName.trim();
  if (!value) return 'La etiqueta no puede estar vacía';
  if (value.length > 50) return 'La etiqueta no puede tener más de 50 caracteres';
  return null;
}
