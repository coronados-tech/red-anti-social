export function formatPostDate(dateValue?: string) {
  if (!dateValue) return 'Sin fecha';

  return new Date(dateValue).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}