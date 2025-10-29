
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center text-neon-green p-10">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-neon-green mb-4"></div>
      <h2 className="text-2xl font-bold mb-2">Analizando Partidos... 📊</h2>
      <p className="text-white">
        La IA está buscando en la web y calculando probabilidades.
      </p>
    </div>
  );
};

export default Loader;
