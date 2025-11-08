import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
});

// ✅ Obtener token desde cookie
function getCsrfToken() {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

// ✅ Interceptor: agrega CSRF
api.interceptors.request.use((config) => {
  const token = getCsrfToken();
  if (["post", "put", "patch", "delete"].includes(config.method)) {
    config.headers["X-CSRF-Token"] = token;
  }
  return config;
});

// ---------------- REFRESH TOKEN INTERCEPTOR ------------------

let isRefreshing = false;
let failedQueue = [];

function processQueue(error = null) {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve();
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    const isAuthMe = originalRequest.url.includes("/auth/me");
    const isRefresh = originalRequest.url.includes("/auth/refresh");

    // ❌ NO interceptar /me ni /refresh en la restauración de sesión
    if (isAuthMe || isRefresh) {
      return Promise.reject(err);
    }

    if (err.response?.status === 401 && !originalRequest._retry) {

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/auth/refresh");

        isRefreshing = false;
        processQueue();

        return api(originalRequest);
      } catch (refreshErr) {
        isRefreshing = false;
        processQueue(refreshErr);

        // ❌ NO redirigir automáticamente
        // Dejá que AuthContext limpie la sesión
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);


export default api;
