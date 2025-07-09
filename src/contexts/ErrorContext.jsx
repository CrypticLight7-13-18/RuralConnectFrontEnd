import React, { createContext, useContext, useState, useCallback } from "react";

// Context definition ---------------------------------------------------------
const ErrorContext = createContext({
  addError: () => {},
});

export const useError = () => useContext(ErrorContext);

// Provider -------------------------------------------------------------------
export default function ErrorProvider({ children }) {
  const [errors, setErrors] = useState([]);

  // Adds an error message and removes it automatically after 5 s
  const addError = useCallback((message) => {
    if (!message) return;
    const id = Date.now() + Math.random();
    setErrors((prev) => [...prev, { id, message }]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setErrors((prev) => prev.filter((err) => err.id !== id));
    }, 5000);
  }, []);

  return (
    <ErrorContext.Provider value={{ addError }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {errors.map((err) => (
          <div
            key={err.id}
            className="bg-red-600 text-white px-4 py-2 rounded shadow-md"
          >
            {err.message}
          </div>
        ))}
      </div>
    </ErrorContext.Provider>
  );
}
