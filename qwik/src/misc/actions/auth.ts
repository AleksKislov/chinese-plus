// import { globalAction$ } from "@builder.io/qwik-city";
import Cookies from "js-cookie";
import { BASE_URL } from "./request";
import { type Cookie } from "@builder.io/qwik-city";

export enum StatusCodes {
  NotFound = 404,
  Success = 200,
  Accepted = 202,
  BadRequest = 400,
  Unauthorized = 401,
}

export interface UserFromDB {
  err?: number;
  user?: {
    _id: ObjectId;
    name: string;
    role?: "admin" | "moderator";
    email: string;
    finished_texts: string[] | null;
    seenVideos: string[] | null;
    daily_reading_goal?: number;
    read_today_num?: number;
    read_today_arr: {};
    newAvatar?: { type: string; background: string; seed: string };
  };
}

export function logout() {
  Cookies.remove("token");
  location.reload();
}

export async function getUser(token: string, controller?: AbortController): Promise<UserFromDB> {
  try {
    const resp = await fetch(BASE_URL + "/api/auth", {
      signal: controller?.signal,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    });
    if (resp.status === StatusCodes.Unauthorized) {
      return { err: StatusCodes.Unauthorized };
    }
    return { user: await resp.json() };
  } catch (e) {
    console.warn((e as Error).message);
    return { err: StatusCodes.NotFound };
  }
}

export const getTokenFromCookie = (cookie: Cookie) => {
  return cookie.get("token")?.value || "";
};
