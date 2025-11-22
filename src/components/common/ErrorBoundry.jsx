// components/common/ErrorBoundary.jsx
import React, { useState, useEffect } from "react";
import "../../styles/error.css";

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const errorHandler = (event) => {
      console.error("Error caught by boundary:", event.error);
      setHasError(true);
      setError(event.error);
      event.preventDefault();
    };

    const rejectionHandler = (event) => {
      console.error("Promise rejection caught:", event.reason);
      setHasError(true);
      setError(event.reason);
      event.preventDefault();
    };

    window.addEventListener("error", errorHandler);
    window.addEventListener("unhandledrejection", rejectionHandler);

    return () => {
      window.removeEventListener("error", errorHandler);
      window.removeEventListener("unhandledrejection", rejectionHandler);
    };
  }, []);

  const handleReset = () => {
    setHasError(false);
    setError(null);
    window.location.reload();
  };

  if (hasError) {
    return (
      <div className="error-boundary">
        <div className="error-content">
          <h1>⚠️ Something went wrong</h1>
          <p className="error-message">
            {error?.message || "An unexpected error occurred"}
          </p>
          <button onClick={handleReset} className="error-reset-btn">
            Reload Dashboard
          </button>
          <details className="error-details">
            <summary>Error Details</summary>
            <pre>{error?.stack || "No stack trace available"}</pre>
          </details>
        </div>
      </div>
    );
  }

  return children;
};

export default ErrorBoundary;
