import axios from "axios";

// ---------------------------------------------------------------------------
//  Axios base URL and Socket URL configuration
// ---------------------------------------------------------------------------
// In development we rely on Vite proxy (see vite.config.js) so we leave the
// baseURL empty (same-origin). Service calls should prefix paths with "/api".
// In production the env var should be the backend origin, e.g.
//   VITE_BACKEND_URL=https://pharmaconnect-api.onrender.com
// which will make requests hit `${VITE_BACKEND_URL}/api/...`.

export const backendURL = import.meta.env.VITE_BACKEND_URL || "";

// For Socket.IO we need the origin *without* the /api path. If the env var is
// provided we use it, otherwise we fallback to current window origin (dev).
export const socketURL =
  import.meta.env.VITE_BACKEND_URL || window.location.origin;

const axiosInstance = axios.create({
  baseURL: backendURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------------------------------------------------------------------
//  Global error interceptor – converts any axios error to a unified object so
//  individual services/components can handle them consistently.
// ---------------------------------------------------------------------------

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Always attach a readable message
    let message = "Something went wrong";
    if (error.response?.data?.message) message = error.response.data.message;
    else if (error.message) message = error.message;

    // Make the unified error available to callers
    return Promise.reject({ ...error, message });
  }
);

export default axiosInstance;
