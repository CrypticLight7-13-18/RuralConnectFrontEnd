import axiosInstance from "./api";
/**
 * Log in a user (patient or doctor)
 * @param {Object} credentials - { email, password, role }
 * @returns {Promise<Object>} - The response data
 */
export const login = async (credentials) => {
  const response = await axiosInstance.post("/api/users/login", credentials);
  return response.data;
};

/**
 * Sign up a new user (patient or doctor)
 * @param {Object} userData - All required fields for patient/doctor + role
 * @returns {Promise<Object>} - The response data
 */
export const signup = async (userData) => {
  const response = await axiosInstance.post("/api/users/signup", userData);
  return response.data;
};

/**
 * Logout the current user
 * @returns {Promise<Object>} - The response data
 */
export const logout = async () => {
  const response = await axiosInstance.get("/api/users/logout");
  return response.data;
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
    console.error("Failed to fetch user profile:", error);
    throw error;
  }
};
