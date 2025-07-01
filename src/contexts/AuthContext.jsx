import React, { createContext, useState, useEffect } from "react";
import { fetchUserProfile } from "../services/auth";

const AuthContext = createContext();

export { AuthContext };

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const profile = await fetchUserProfile();
      setUser(profile);
      setIsAuthenticated(true);
    } catch (err) {
      // User is not authenticated or session expired
      console.error("AuthProvider: Authentication check failed:", err);
      console.error("AuthProvider: Error message:", err.message);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
