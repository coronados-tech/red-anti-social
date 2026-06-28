import type { SearchableUser } from '../components/UserSearch';

interface PostFilterState {
  selectedUser?: SearchableUser | null;
  textFilter?: string;
  tagFilter?: string;
}

export function getEmptyFilterMessage({
  selectedUser = null,
  textFilter = '',
  tagFilter = '',
}: PostFilterState): string {
  const text = textFilter.trim();

  if (selectedUser && text) {
    return `No se encontró ningún post del usuario ${selectedUser.nickname} con el texto "${text}".`;
  }

  if (selectedUser) {
    return `No se encontró ningún post del usuario ${selectedUser.nickname}.`;
  }

  if (text) {
    return `No se encontró ningún post con el texto "${text}".`;
  }

  if (tagFilter) {
    return `No se encontró ningún post con la etiqueta #${tagFilter}.`;
  }

  return 'No se encontraron publicaciones con los filtros aplicados.';
}
