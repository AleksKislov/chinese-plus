"use client";
export function saveTokenLocally(token: string) {
  if (window === undefined) return;
  localStorage.setItem("token", token);
}
