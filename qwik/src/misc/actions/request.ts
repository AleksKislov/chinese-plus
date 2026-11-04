export const BASE_URL = import.meta.env.PUBLIC_BASE_URL;

console.log(import.meta.env.PUBLIC_ENV, import.meta.env.PUBLIC_VERSION);

type ReqHeaders = {
  'Content-Type': string;
  'x-auth-token'?: string;
};

type ReqOptions = {
  method: string;
  headers: ReqHeaders;
  body?: string;
};

// result of ApiService.send: the data, or the message of a refused request
export type ApiResult<T> = { data: T; error?: undefined } | { data?: undefined; error: string };

const headers: ReqHeaders = {
  'Content-Type': 'application/json',
};

class ApiServiceFactory {
  private _baseUrl: string;

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  get baseUrl(): string {
    return this._baseUrl;
  }

  _getReqOptions(method: string, body: string | null, token?: string): ReqOptions {
    const options: ReqOptions = {
      headers,
      method,
    };
    if (token) {
      options.headers = { ...headers, 'x-auth-token': token };
    }
    if (body) {
      options.body = body;
    }
    return options;
  }

  async _myFetch(path: string, opts: ReqOptions, defaultVal?: any): Promise<any> {
    try {
      const res = await fetch(this._baseUrl + path, opts);
      if (!res.ok) {
        throw new Error(`REQUEST ERR for ${path}! Status: ${res.status}, ${await res?.text()}`);
      }
      return await res.json();
    } catch (err) {
      console.log('[fetch fail] for ', this._baseUrl + path, err);
      return defaultVal;
    }
  }

  get(path: string, token?: string, defaultVal?: any): Promise<any> {
    return this._myFetch(path, this._getReqOptions('GET', null, token), defaultVal);
  }

  post(path: string, body: Object, token?: string, defaultVal?: any): Promise<any> {
    return this._myFetch(
      path,
      this._getReqOptions('POST', JSON.stringify(body), token),
      defaultVal,
    );
  }

  put(path: string, body: Object | null, token?: string, defaultVal?: any): Promise<any> {
    return this._myFetch(
      path,
      this._getReqOptions('PUT', body ? JSON.stringify(body) : null, token),
      defaultVal,
    );
  }

  delete(path: string, token?: string, defaultVal?: any): Promise<any> {
    return this._myFetch(path, this._getReqOptions('DELETE', null, token), defaultVal);
  }

  // unlike the methods above, keeps why a request was refused (`{ msg }` of the backend),
  // for forms that show it
  async send<T>(
    method: 'POST' | 'PUT' | 'DELETE',
    path: string,
    body: object | null,
    token?: string,
  ): Promise<ApiResult<T>> {
    try {
      const opts = this._getReqOptions(method, body ? JSON.stringify(body) : null, token);
      const res = await fetch(this._baseUrl + path, opts);
      const data = await res.json().catch(() => null);
      if (!res.ok) return { error: data?.msg || `Ошибка ${res.status}` };
      return { data };
    } catch (err) {
      console.log('[fetch fail] for ', this._baseUrl + path, err);
      return { error: 'Сервер недоступен' };
    }
  }
}

export const ApiService = new ApiServiceFactory(BASE_URL);
