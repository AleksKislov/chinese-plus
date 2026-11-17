export const stripTrailingSlash = (path: string) =>
  path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;

/** A single menu link: lit only on its exact page. */
export const isLinkActive = (pathname: string, href: string) =>
  stripTrailingSlash(pathname) === stripTrailingSlash(href);

/**
 * A menu group (dropdown / submenu): lit when the current page is one of its links
 * or a page nested under one of them (e.g. /read/texts/123 under /read/texts).
 */
export const isGroupActive = (pathname: string, hrefs: string[]) => {
  const path = stripTrailingSlash(pathname);
  return hrefs.some((href) => {
    const base = stripTrailingSlash(href);
    return path === base || path.startsWith(`${base}/`);
  });
};

export const ACTIVE_MENU_CLASS = 'text-secondary font-semibold';
