import axios from "axios";
import { getSession } from "../../libs/session";

const api = axios.create({
  baseURL: process.env.BACKEND_URL,
  timeout: 5000,
});

console.log("API Base URL:", process.env.BACKEND_URL);

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    const token = session.accessToken;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
