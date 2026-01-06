import axios from "axios";
import { getSession } from "../../libs/session";

const api = axios.create({
  baseURL: "http://localhost:5001",
  timeout: 5000,
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    const token = session.accessToken;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
