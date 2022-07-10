import axios from "axios";

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

export class ApiService {
  static call(method, relPath, body) {
    if (method === "get") return axios.get(`http://localhost:5000${relPath}`);
    return axios[method](`http://localhost:5000${relPath}`, body, config);
  }
}
