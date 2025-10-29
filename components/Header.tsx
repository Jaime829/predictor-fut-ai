
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl sm:text-5xl font-bold text-white">
        Predictor Futbolero <span className="text-neon-green">AI</span> ⚽
      </h1>
      <p className="text-gray-400 mt-2">
        Análisis y predicciones de partidos con IA de Gemini.
      </p>
    </header>
  );
};

export default Header;
