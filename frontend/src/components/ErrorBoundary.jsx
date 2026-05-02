import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught ERP Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6 text-center">
          <div className="max-w-md w-full bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-2xl border border-red-500/20">
            <span className="text-5xl mb-4 block">🚧</span>
            <h1 className="text-2xl font-black mb-2 dark:text-white">System Interrupted</h1>
            <p className="text-gray-500 text-sm mb-6">
              A frontend logic error occurred. Our engineers have been notified.
            </p>
            {process.env.NODE_ENV === "development" && (
              <pre className="text-[10px] text-left bg-red-50 dark:bg-red-950/20 p-4 rounded-xl text-red-500 overflow-auto max-h-40 mb-6 font-mono">
                {this.state.error?.toString()}
              </pre>
            )}
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-zinc-900 dark:bg-white dark:text-black text-white rounded-xl font-bold"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;