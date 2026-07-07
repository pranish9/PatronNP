import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-patron-gray-100 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-patron-gray-200 p-8 text-center space-y-4">
            <h1 className="text-xl font-bold text-patron-black">Something went wrong</h1>
            <p className="text-sm text-patron-gray-500">
              This page hit an unexpected error. Try reloading — if it keeps happening, let us know.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-patron-green-600 hover:bg-patron-green-700 text-white"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
