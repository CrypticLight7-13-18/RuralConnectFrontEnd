import axiosInstance from "./api";
/**
 * Log in a user (patient or doctor)
 * @param {Object} credentials - { email, password, role }
 * @returns {Promise<Object>} - The response data
 */
export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post("/api/users/login", credentials);
    return response.data;
  } catch (error) {
    console.error("auth.js: Login request failed:", error);
    console.error("auth.js: Login error response:", error.response);
    console.error("auth.js: Login error message:", error.message);
    throw error;
  }
};

/**
 * Sign up a new user (patient or doctor)
 * @param {Object} userData - All required fields for patient/doctor + role
 * @returns {Promise<Object>} - The response data
 */
export const signup = async (userData) => {
  console.log(userData)
  try {
    const response = await axiosInstance.post("/api/users/signup", userData);
    return response.data;
  } catch (error) {
    console.error("auth.js: Signup request failed:", error);
    console.error("auth.js: Signup error response:", error.response);
    console.error("auth.js: Signup error message:", error.message);
    throw error;
  }
};

/**
 * Logout the current user
 * @returns {Promise<Object>} - The response data
 */
export const logout = async () => {
  try {
    const response = await axiosInstance.get("/api/users/logout");
    return response.data;
  } catch (error) {
    console.error("auth.js: Logout request failed:", error);
    console.error("auth.js: Logout error response:", error.response);
    throw error;
  }
};

/**
 * Get the current user's profile data
 * @return {Promise<Object>} - The user's profile data
 */
export const fetchUserProfile = async () => {
  try {
    const response = await axiosInstance.get("/api/users/me", {
      withCredentials: true, // Ensures the cookie gets sent
    });
    return response.data.data.user;
  } catch (error) {
    console.error("auth.js: fetchUserProfile request failed:", error);
    console.error("auth.js: fetchUserProfile error response:", error.response);
    console.error("auth.js: fetchUserProfile error message:", error.message);
    throw error;
  }
};
