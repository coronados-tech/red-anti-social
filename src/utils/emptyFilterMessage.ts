interface EmptyFilterMessageParams {
  selectedUser: number | null;
  textFilter: string;
  tagFilter: number | null;
}

export function getEmptyFilterMessage(
  params: EmptyFilterMessageParams,
): string {
  const { selectedUser, textFilter, tagFilter } = params;
  const filters = [];

  if (textFilter) filters.push(`texto "${textFilter}"`);
  if (tagFilter) filters.push("etiqueta seleccionada");
  if (selectedUser) filters.push("usuario seleccionado");

  if (filters.length === 0) {
    return "No hay publicaciones que coincidan con los filtros.";
  }

  const filterText = filters.join(", ");
  return `No hay publicaciones con ${filterText}.`;
}
