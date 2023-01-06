const BASE_URL = "http://localhost:5000";

export default async function apiGetReq(path: String): Promise<any> {
  try {
    const res = await fetch(BASE_URL + path);
    return await res.json();
  } catch (err) {
    console.log(err);
  }
}
