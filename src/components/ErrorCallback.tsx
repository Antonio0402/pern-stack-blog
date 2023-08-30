import { FallbackProps } from "react-error-boundary";
export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.
  return (
    <div className="error">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary} data-style="auth" className="btn">
        Try again
      </button>
    </div>
  );
};
