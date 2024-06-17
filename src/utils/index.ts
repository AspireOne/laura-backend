// Export all utils here.
// e.g. export * from './utils/date';
// Difference between utils and common:
// - utils are general and can be shared across projects.
// - common are project specific and should be shared only within the project.
// - common should also contain libs etc.

export function replaceDiacritics(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
