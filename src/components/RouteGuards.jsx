import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Component to protect routes that require authentication
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

// Component to redirect authenticated users away from auth pages
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  console.log(
    "PublicRoute - Loading:",
    loading,
    "Authenticated:",
    isAuthenticated,
    "User:",
    user
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    // Redirect to appropriate page based on user role
    const redirectTo = user.role === "doctor" ? "/appointment" : "/chat";
    console.log("PublicRoute - Redirecting authenticated user to:", redirectTo);
    return <Navigate to={redirectTo} replace />;
  }

  console.log("PublicRoute - Showing login page");
  return children;
};
