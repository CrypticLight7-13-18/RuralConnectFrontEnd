import React, { Component } from "react";
import { useError } from "../contexts/ErrorContext";

class InnerBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render shows fallback UI (optional)
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error captured by ErrorBoundary:", error, errorInfo);
    this.props.onError(error.message || "Something went wrong");
  }

  render() {
    return this.props.children;
  }
}

export default function ErrorBoundary({ children }) {
  const { addError } = useError();
  return <InnerBoundary onError={addError}>{children}</InnerBoundary>;
}
