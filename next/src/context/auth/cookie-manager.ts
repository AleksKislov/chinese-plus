import cookie from "js-cookie";

export function saveCookie(cookieName: string, token: string) {
  cookie.set("token", token, { expires: 30 });
}

export function removeCookie(cookieName: string) {
  cookie.remove(cookieName);
}

export function getCookie(cookieName: string): string | undefined {
  return cookie.get(cookieName);
}
