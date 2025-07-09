import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ErrorProvider from "./contexts/ErrorContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </ErrorProvider>
  </StrictMode>
);
