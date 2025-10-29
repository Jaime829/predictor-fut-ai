import React from 'react';
import type { Prediction } from '../types';

interface PredictionDetailProps {
  prediction: Prediction;
}

const PredictionDetail: React.FC<PredictionDetailProps> = ({ prediction }) => {
  const [localTeam, visitorTeam] = prediction.partido.split(' vs ');

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const target = e.target as HTMLImageElement;
      target.onerror = null; // prevent infinite loop
      target.src = `https://ui-avatars.com/api/?name=${target.alt.substring(0, 2)}&background=random&color=fff&size=48`;
      target.classList.add('bg-gray-700', 'rounded-full');
  };

  return (
    <div className="space-y-4 text-gray-300">
      <div>
        <h3 className="font-bold text-lg text-white mb-1">📊 Análisis de la IA</h3>
        <p className="bg-gray-900 p-3 rounded-lg border border-gray-700">{prediction.razonamiento}</p>
      </div>
      <div>
        <h3 className="font-bold text-lg text-white mb-2">Probabilidades</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-700 p-3 rounded-lg flex flex-col items-center justify-between">
                <img src={prediction.escudoLocal} alt={localTeam} className="w-12 h-12 object-contain" onError={handleImageError} />
                <p className="font-semibold mt-2">{localTeam}</p>
                <p className="text-2xl font-bold text-neon-green">{prediction.probabilidad.local}%</p>
            </div>
             <div className="bg-gray-700 p-3 rounded-lg flex flex-col items-center justify-between">
                <div className="w-12 h-12 flex items-center justify-center">
                    <span className="text-3xl font-bold">vs</span>
                </div>
                <p className="font-semibold mt-2">Empate</p>
                <p className="text-2xl font-bold text-white">{prediction.probabilidad.empate}%</p>
            </div>
             <div className="bg-gray-700 p-3 rounded-lg flex flex-col items-center justify-between">
                <img src={prediction.escudoVisitante} alt={visitorTeam} className="w-12 h-12 object-contain" onError={handleImageError}/>
                <p className="font-semibold mt-2">{visitorTeam}</p>
                <p className="text-2xl font-bold text-neon-green">{prediction.probabilidad.visitante}%</p>
            </div>
        </div>
      </div>
       <div className="text-xs text-gray-500 pt-2">
        <p>Recuerda: Estas son predicciones estadísticas basadas en datos públicos y no garantizan el resultado final.</p>
      </div>
    </div>
  );
};

export default PredictionDetail;
