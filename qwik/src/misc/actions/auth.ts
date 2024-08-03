import Cookies from 'js-cookie';
import { type Cookie } from '@builder.io/qwik-city';

// export enum StatusCodes {
//   NotFound = 404,
//   Success = 200,
//   Accepted = 202,
//   BadRequest = 400,
//   Unauthorized = 401,
// }

export interface UserFromDB {
  _id: ObjectId;
  name: string;
  role?: 'admin' | 'moderator';
  email: string;
  finished_texts: string[] | null;
  seenVideos: string[] | null;
  daily_reading_goal?: number;
  read_today_num?: number;
  read_today_arr: {};
  newAvatar?: { type: string; background: string; seed: string };
}

export function logout() {
  Cookies.remove('token');
  // location.reload();
}

export const getTokenFromCookie = (cookie: Cookie) => {
  return cookie.get('token')?.value || '';
};
