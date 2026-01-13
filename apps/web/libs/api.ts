import axios from "axios";
import { getSession, createSession, getRfSession } from "./session";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001",
  timeout: 5000,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    const token = session.accessToken;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = "Bearer " + token;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;
      const RfSession = await getRfSession();

      try {
        console.log("Refreshing token...");
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Refresh ${RfSession?.refreshToken}`,
            },
          }
        );

        const newAccessToken = res.data.accessToken;

        await createSession({
          user: { id: res.data.id },
          accessToken: newAccessToken,
        });

        api.defaults.headers.Authorization = "Bearer " + newAccessToken;

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = "Bearer " + newAccessToken;

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        throw err;
      } finally {
        isRefreshing = false;
      }
    }

    throw error;
  }
);

export default api;
