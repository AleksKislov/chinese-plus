export const BASE_URL = import.meta.env.PUBLIC_BASE_URL;

console.log(import.meta.env.PUBLIC_ENV);
type ReqHeaders = {
  "Content-Type": string;
  "x-auth-token"?: string;
};

type ReqOptions = {
  method: string;
  headers: ReqHeaders;
  body?: string;
};

const headers: ReqHeaders = {
  "Content-Type": "application/json",
};

function getReqOptions(method: string, body: string | null, token?: string): ReqOptions {
  const options: ReqOptions = {
    headers,
    method,
  };
  if (token) {
    options.headers = { ...headers, "x-auth-token": token };
  }
  if (body) {
    options.body = body;
  }
  return options;
}

async function myFetch(path: string, opts: ReqOptions, defaultVal?: any): Promise<any> {
  try {
    const res = await fetch(BASE_URL + path, opts);
    // if (!res.ok) throw new Error(`Error!!! status: ${res.status} - ${await res.text()}`);
    if (!res.ok) throw new Error(`Error!!! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.log(err);
    return defaultVal;
  }
}

export class ApiService {
  static get(path: string, token?: string, defaultVal?: any): Promise<any> {
    return myFetch(path, getReqOptions("GET", null, token), defaultVal);
  }

  static post(path: string, body: Object, token?: string, defaultVal?: any): Promise<any> {
    return myFetch(path, getReqOptions("POST", JSON.stringify(body), token), defaultVal);
  }

  static put(path: string, body: Object | null, token?: string, defaultVal?: any): Promise<any> {
    return myFetch(
      path,
      getReqOptions("PUT", body ? JSON.stringify(body) : null, token),
      defaultVal
    );
  }

  static delete(path: string, token?: string, defaultVal?: any): Promise<any> {
    return myFetch(path, getReqOptions("DELETE", null, token), defaultVal);
  }
}
