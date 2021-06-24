export function isValidRequest(
  obj: object,
): boolean {
  return 'scenarioDto' in obj || 'items' in obj;
}
