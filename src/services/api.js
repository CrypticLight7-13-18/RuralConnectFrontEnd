import axios from "axios";

// In dev we rely on the Vite proxy (see vite.config.js) so a relative base
// path keeps requests "same-origin" and avoids CORS. In production you can
// set VITE_BACKEND_URL to point to your deployed API.
export const backendURL = import.meta.env.VITE_BACKEND_URL || "";

const axiosInstance = axios.create({
  baseURL: backendURL,
  withCredentials: true, // Allow cookies to be sent with requests
  headers: {
    "Content-Type": "application/json",
  },
});

// const response = await axiosInstance.post("/");
// console.log(response)

export default axiosInstance;
