
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-gray-500" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-xl
                      transition-all duration-200 hover:bg-gray-800"
          >
            <Home className="mr-2 h-5 w-5" />
            Return to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl
                      transition-all duration-200 hover:bg-gray-50"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
