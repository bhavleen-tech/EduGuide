import React from 'react';

const LoadingDots = () => {
  return (
    <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-2xl rounded-tl-none max-w-xs">
      <span className="text-sm font-medium text-gray-500 animate-pulse">Searching the web</span>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default LoadingDots;