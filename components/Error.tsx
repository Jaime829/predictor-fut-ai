
import React from 'react';

interface ErrorProps {
  message: string;
  onRetry: () => void;
}

const Error: React.FC<ErrorProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-900/50 border-2 border-red-500 text-red-200 px-4 py-3 rounded-lg relative text-center" role="alert">
      <strong className="font-bold">¡Oops! Algo salió mal.</strong>
      <p className="block sm:inline ml-2">{message}</p>
      <button
        onClick={onRetry}
        className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
      >
        Reintentar
      </button>
    </div>
  );
};

export default Error;
