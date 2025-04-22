export function toCamelCase(input: string): string {
  return input
    .replace(/[-_ ]+(\w)/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}
