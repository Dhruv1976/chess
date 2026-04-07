import React from 'react';

const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const loaderContent = (
    <div className={`${sizeClasses[size]} animate-spin`}>
      <svg
        className="h-full w-full text-transparent"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75 text-blue-500"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="bg-white rounded-lg p-8 shadow-xl border border-gray-200">
          <div className="text-blue-500">{loaderContent}</div>
          <p className="mt-4 text-gray-700 text-center font-semibold text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return <div className="flex items-center justify-center">{loaderContent}</div>;
};

export default Loader;
