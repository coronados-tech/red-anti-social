import type { PostImage } from '../types';

/** Orden de subida: la primera imagen del post es la de menor id. */
export function sortPostImages(images: PostImage[]): PostImage[] {
  return [...images].sort((a, b) => a.id - b.id);
}

export function getPrimaryPostImageUrl(images?: PostImage[] | null): string | undefined {
  const sorted = sortPostImages(images ?? []);
  return sorted[0]?.url;
}
