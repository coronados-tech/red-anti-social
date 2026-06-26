export const PROFILE_PHOTO_VIEWPORT = 280;
export const PROFILE_PHOTO_OUTPUT = 512;

export interface CoverLayout {
  displayWidth: number;
  displayHeight: number;
}

export function getCoverLayout(imageWidth: number, imageHeight: number, viewport: number): CoverLayout {
  const ratio = imageWidth / imageHeight;

  if (ratio >= 1) {
    return { displayWidth: viewport * ratio, displayHeight: viewport };
  }

  return { displayWidth: viewport, displayHeight: viewport / ratio };
}

export function clampOffset(
  offsetX: number,
  offsetY: number,
  layout: CoverLayout,
  zoom: number,
  viewport: number,
): { x: number; y: number } {
  const width = layout.displayWidth * zoom;
  const height = layout.displayHeight * zoom;
  const maxX = Math.max(0, (width - viewport) / 2);
  const maxY = Math.max(0, (height - viewport) / 2);

  return {
    x: Math.min(maxX, Math.max(-maxX, offsetX)),
    y: Math.min(maxY, Math.max(-maxY, offsetY)),
  };
}

export async function loadImageElement(
  source: string | File,
): Promise<{ image: HTMLImageElement; previewUrl: string }> {
  let previewUrl: string;

  if (typeof source === 'string') {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error('No se pudo cargar la imagen');
    }
    const blob = await response.blob();
    previewUrl = URL.createObjectURL(blob);
  } else {
    previewUrl = URL.createObjectURL(source);
  }

  const image = new Image();
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('No se pudo cargar la imagen'));
    image.src = previewUrl;
  });

  return { image, previewUrl };
}

export async function cropProfilePhoto(
  image: HTMLImageElement,
  offsetX: number,
  offsetY: number,
  zoom: number,
  viewport = PROFILE_PHOTO_VIEWPORT,
  outputSize = PROFILE_PHOTO_OUTPUT,
): Promise<File> {
  const layout = getCoverLayout(image.naturalWidth, image.naturalHeight, viewport);
  const { x, y } = clampOffset(offsetX, offsetY, layout, zoom, viewport);

  const scaledWidth = layout.displayWidth * zoom;
  const scaledHeight = layout.displayHeight * zoom;
  const drawX = (viewport - scaledWidth) / 2 + x;
  const drawY = (viewport - scaledHeight) / 2 + y;

  const canvas = document.createElement('canvas');
  canvas.width = outputSize;
  canvas.height = outputSize;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('No se pudo procesar la imagen');
  }

  const ratio = outputSize / viewport;
  context.scale(ratio, ratio);
  context.drawImage(image, drawX, drawY, scaledWidth, scaledHeight);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', 0.92);
  });

  if (!blob) {
    throw new Error('No se pudo generar la imagen');
  }

  return new File([blob], 'profile-picture.jpg', { type: 'image/jpeg' });
}