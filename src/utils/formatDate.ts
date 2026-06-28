export function formatPostDate(dateValue?: string) {
  if (!dateValue) return 'Sin fecha';

  return new Date(dateValue).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatCommentDate(dateValue?: string) {
  if (!dateValue) return 'Sin fecha';

  return new Date(dateValue).toLocaleString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
