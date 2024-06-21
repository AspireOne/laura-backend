// Export all utils here.
// e.g. export * from './utils/date';
// Difference between utils and common:
// - utils are general and can be shared across projects.
// - common are project specific and should be shared only within the project.
// - common should also contain libs etc.

import Expo from "expo-server-sdk";
import { env } from "src/helpers/env";

export function replaceDiacritics(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function splitDate(date: Date): [number, number, number] {
  const [year, month, day] = date.toISOString().split("T")[0].split("-");
  return [parseInt(year, 10), parseInt(month, 10), parseInt(day, 10)];
}
