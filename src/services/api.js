import axios from "axios";

export const backendURL = "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: backendURL,
  withCredentials: true, // Allow cookies to be sent with requests
  headers: {
    "Content-Type": "application/json",
  }
});

export default axiosInstance;
