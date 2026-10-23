import { type RequestHandler } from '@builder.io/qwik-city';
import { ApiService } from '~/misc/actions/request';

// Browser extension API (extension/): add / remove a dictionary word in the user's vocabulary.
// `id` is the dictionary word _id, which the extension's offline dictionary carries.

const OBJECT_ID_RE = /^[a-f0-9]{24}$/;

const proxy =
  (method: 'post' | 'delete'): RequestHandler =>
  async ({ request, params, json }) => {
    const token = request.headers.get('x-auth-token');
    if (!token) {
      json(401, { msg: 'No token' });
      return;
    }
    if (!OBJECT_ID_RE.test(params.id)) {
      json(400, { msg: 'Bad word id' });
      return;
    }
    const path = `/api/userwords/${params.id}`;
    const res =
      method === 'post'
        ? await ApiService.post(path, {}, token, null)
        : await ApiService.delete(path, token, null);
    if (!res) {
      json(502, { msg: 'Request failed' });
      return;
    }
    json(200, { ok: true });
  };

export const onPost = proxy('post');
export const onDelete = proxy('delete');
