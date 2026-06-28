export function buildTagFilterPath(basePath: string, tagName: string): string {
  return `${basePath}?tag=${encodeURIComponent(tagName)}`;
}
