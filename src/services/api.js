import axios from "axios";

// export const backendURL = "http://localhost:3000";
export const backendURL = "https://opulent-broccoli-4pjg9w97jqv2j97-3000.app.github.dev/"

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
