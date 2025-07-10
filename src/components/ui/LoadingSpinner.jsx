// src/components/ui/LoadingSpinner.jsx
import { motion } from "framer-motion";

const LoadingSpinner = ({ size = "medium", className = "" }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-6 h-6", 
    large: "w-8 h-8"
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <motion.div
        className={`border-2 border-gray-300 border-t-blue-600 rounded-full ${sizeClasses[size]}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        aria-label="Loading"
        role="status"
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;