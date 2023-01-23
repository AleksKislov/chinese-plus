const BASE_URL = "http://localhost:5000";

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

export async function apiGetReq(path: string, token?: string): Promise<any> {
  const opts = getReqOptions("GET", null, token);
  try {
    const res = await fetch(BASE_URL + path, opts);
    if (!res.ok) throw new Error(`Error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.log(err);
  }
}

export async function apiPostReq(path: string, body: Object, token?: string): Promise<any> {
  const opts = getReqOptions("POST", JSON.stringify(body), token);
  try {
    const res = await fetch(BASE_URL + path, opts);
    return await res.json();
  } catch (err) {
    console.log(err);
  }
}

export async function apiDeleteReq(path: string, token?: string): Promise<any> {
  const opts = getReqOptions("DELETE", null, token);
  try {
    const res = await fetch(BASE_URL + path, opts);
    return await res.json();
  } catch (err) {
    console.log(err);
  }
}

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
