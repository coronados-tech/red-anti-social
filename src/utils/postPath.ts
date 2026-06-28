export function postPath(slug: string): string {
  return `/post/${encodeURIComponent(slug)}`;
}

export function postCommentsPath(slug: string): string {
  return `${postPath(slug)}#comentarios`;
}
