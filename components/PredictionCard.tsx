import React, { useState } from 'react';
import type { Prediction } from '../types';
import Modal from './Modal';
import PredictionDetail from './PredictionDetail';

interface PredictionCardProps {
  prediction: Prediction;
  onAddToHistory: (prediction: Prediction) => void;
}

const Team: React.FC<{ name: string; probability: number, escudo: string }> = ({ name, probability, escudo }) => (
  <div className="flex flex-col items-center text-center w-1/3">
     <img 
      src={escudo} 
      alt={name} 
      className="w-12 h-12 object-contain mb-2"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null; // prevent infinite loop
        target.src = `https://ui-avatars.com/api/?name=${name.substring(0, 2)}&background=random&color=fff&size=48`;
        target.classList.add('bg-gray-700', 'rounded-full');
      }}
    />
    <span className="font-semibold text-sm sm:text-base break-words">{name}</span>
    <span className="text-2xl font-bold text-neon-green">{probability}%</span>
  </div>
);

const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, onAddToHistory }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localTeam, visitorTeam] = prediction.partido.split(' vs ');

  const formattedDate = new Date(prediction.fecha).toLocaleString('es-ES', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleAddToHistoryClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que el modal se abra al hacer clic en el botón
    onAddToHistory(prediction);
  };

  return (
    <>
      <div
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-5 flex flex-col space-y-4 transform hover:scale-105 hover:border-neon-green transition-all duration-300 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsModalOpen(true); }}
        aria-haspopup="dialog"
      >
        <div className="text-center">
          <p className="font-bold text-electric-blue">{prediction.liga}</p>
          <p className="text-xs text-gray-400">{formattedDate}</p>
        </div>

        <div className="flex justify-between items-start text-white">
          <Team name={localTeam} probability={prediction.probabilidad.local} escudo={prediction.escudoLocal} />
          <div className="flex flex-col items-center w-1/3 pt-5">
            <span className="text-gray-400 text-sm">Empate</span>
            <span className="text-2xl font-bold text-white">{prediction.probabilidad.empate}%</span>
          </div>
          <Team name={visitorTeam} probability={prediction.probabilidad.visitante} escudo={prediction.escudoVisitante} />
        </div>

        <div className="bg-gray-900 rounded-lg p-3 text-center">
          <p className="text-sm text-gray-400">💡 Predicción</p>
          <p className="font-bold text-lg truncate">{prediction.razonamiento}</p>
        </div>

        <button
          onClick={handleAddToHistoryClick}
          className="w-full bg-electric-blue text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-colors z-10 relative"
        >
          Mover al Historial
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={prediction.partido}
      >
        <PredictionDetail prediction={prediction} />
      </Modal>
    </>
  );
};

export default PredictionCard;
