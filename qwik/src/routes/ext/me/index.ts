import { type RequestHandler } from '@builder.io/qwik-city';
import { ApiService } from '~/misc/actions/request';
import { type UserFromDB } from '~/misc/actions/auth';

// Browser extension API (extension/): the BE isn't public, so the extension calls these
// FE-server endpoints with the site's `token` cookie value in x-auth-token.

/** Current user and the chinese strings of their vocabulary (to mark saved words) */
export const onGet: RequestHandler = async ({ request, json }) => {
  const token = request.headers.get('x-auth-token');
  if (!token) {
    json(401, { msg: 'No token' });
    return;
  }
  const user = (await ApiService.get('/api/auth', token, null)) as UserFromDB | null;
  if (!user) {
    json(401, { msg: 'Invalid token' });
    return;
  }
  const words = (await ApiService.get('/api/userwords/light', token, [])) as string[];
  json(200, { user: { name: user.name }, words });
};
