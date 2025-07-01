import React, { useEffect, useState } from "react";
import {
  Calendar,
  Store,
  MessageCircle,
  User,
  RefreshCw,
  LogOut,
} from "lucide-react";
import { fetchUserProfile, logout as logoutService } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Custom Medical Logo Component
const MedicalLogo = () => (
  <div className="flex items-center space-x-2">
    <div className="relative w-8 h-8">
      {/* Medical Cross */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-6 h-2 bg-white rounded-sm"></div>
        <div className="absolute w-2 h-6 bg-white rounded-sm"></div>
      </div>
      {/* Circle background */}
      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-white shadow-lg"></div>
    </div>
    <span className="text-lg font-bold text-white">PharmaConnect</span>
  </div>
);

export default function Navbar() {
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const profile = await fetchUserProfile();
      setUserData(profile);
    } catch (err) {
      setError("Failed to load user profile");
      console.error("Error loading user profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutService();
      authLogout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleNavigation = (section) => {
    setMobileMenuOpen(false); // Close mobile menu on navigation
    if (section === "appointments") {
      if (userData.role === "doctor") {
        navigate("/appointment");
      } else {
        navigate("/my-appointments");
      }
    } else if (section === "store") {
      navigate("/store");
    } else if (section === "chat") {
      navigate("/chat");
    }
  };

  if (isLoading) {
    return (
      <nav className="text-white p-4 shadow-lg bg-darkestBlue">
        <div className="flex justify-center items-center">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="ml-2">Loading...</span>
        </div>
      </nav>
    );
  }

  if (error || !userData.name) {
    return (
      <nav className="text-white p-4 shadow-lg bg-darkestBlue">
        <div className="flex justify-between items-center">
          <MedicalLogo />
          <div className="text-red-300">
            {error || "User not authenticated"}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="text-white shadow-lg bg-darkestBlue">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <MedicalLogo />
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button
                onClick={() => handleNavigation("appointments")}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-white hover:text-darkestBlue hover:bg-opacity-20 transition-colors duration-200 text-lightestBlue"
              >
                <Calendar className="w-4 h-4" />
                <span>Appointments</span>
              </button>
              {/* Only show Store and Chat if not doctor */}
              {userData.role !== "doctor" && (
                <>
                  <button
                    onClick={() => handleNavigation("store")}
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-white hover:text-darkestBlue hover:bg-opacity-20 transition-colors duration-200 text-lightestBlue"
                  >
                    <Store className="w-4 h-4" />
                    <span>Store</span>
                  </button>
                  <button
                    onClick={() => handleNavigation("chat")}
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-white hover:text-darkestBlue hover:bg-opacity-20 transition-colors duration-200 text-lightestBlue"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* User Info Section */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:block text-right">
              <div className="text-sm font-medium text-lightestBlue">
                {userData.name}
              </div>
              <div className="text-xs text-lightBlue">{userData.role}</div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full border-2 bg-darkBlue border-mediumBlue">
                <User className="w-4 h-4 text-lightBlue" />
              </div>

              <button
                onClick={loadUserProfile}
                className="p-2 rounded-md hover:bg-white hover:bg-opacity-20 transition-colors duration-200 text-lightBlue"
                title="Refresh profile"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={handleLogout}
                className="p-2 rounded-md hover:bg-red-500 hover:bg-opacity-20 transition-colors duration-200 text-lightBlue hover:text-red-300"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              className="p-2 rounded-md hover:bg-white hover:bg-opacity-20 transition-colors duration-200"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label="Open mobile menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 bg-darkestBlue shadow-lg z-50">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button
                onClick={() => handleNavigation("appointments")}
                className="flex items-center space-x-2 w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-white hover:bg-opacity-20 transition-colors duration-200 text-lightestBlue"
              >
                <Calendar className="w-5 h-5" />
                <span>Appointments</span>
              </button>
              {/* Only show Store and Chat if not doctor */}
              {userData.role !== "doctor" && (
                <>
                  <button
                    onClick={() => handleNavigation("store")}
                    className="flex items-center space-x-2 w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-white hover:bg-opacity-20 transition-colors duration-200 text-lightestBlue"
                  >
                    <Store className="w-5 h-5" />
                    <span>Store</span>
                  </button>
                  <button
                    onClick={() => handleNavigation("chat")}
                    className="flex items-center space-x-2 w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-white hover:bg-opacity-20 transition-colors duration-200 text-lightestBlue"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Chat</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
