export const BASE_URL = import.meta.env.PUBLIC_BASE_URL;
export const GO_BASE_URL = import.meta.env.PUBLIC_GO_BASE_URL;

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

const headers: ReqHeaders = {
  'Content-Type': 'application/json',
};

class ApiServiceFactory {
  private _baseUrl: string;

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
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
      console.log(err);
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
}

export const ApiService = new ApiServiceFactory(BASE_URL);
export const GoApiService = new ApiServiceFactory(GO_BASE_URL);
