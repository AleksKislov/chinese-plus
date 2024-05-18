export function validURL(str: string): boolean {
  try {
    const url = new URL(encodeURI(str));
    if (url) return true;
  } catch (_e) {
    /* noop */
  }
  return false;
}
