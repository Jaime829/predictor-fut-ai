import React from 'react';
import type { HistoryItem } from '../types';

interface HistoryCardProps {
  item: HistoryItem;
  onMarkResult: (id: number, result: 'correct' | 'incorrect') => void;
  onDelete: (id: number) => void;
}

const getResultStyles = (result: HistoryItem['result']) => {
  switch (result) {
    case 'correct':
      return 'border-green-500 bg-green-500/10';
    case 'incorrect':
      return 'border-red-500 bg-red-500/10';
    default:
      return 'border-gray-600 bg-gray-800';
  }
};

const HistoryCard: React.FC<HistoryCardProps> = ({ item, onMarkResult, onDelete }) => {
  const [localTeam, visitorTeam] = item.partido.split(' vs ');

  const getWinner = () => {
    const { local, empate, visitante } = item.probabilidad;
    if (item.prediccion === 'Local') return `${localTeam} (${local}%)`;
    if (item.prediccion === 'Visitante') return `${visitorTeam} (${visitante}%)`;
    return `Empate (${empate}%)`;
  };
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const target = e.target as HTMLImageElement;
      target.onerror = null; // prevent infinite loop
      target.style.display = 'none'; // hide broken image icon
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between p-4 rounded-lg border-2 transition-colors ${getResultStyles(item.result)}`}>
      <div className="flex-1 mb-4 sm:mb-0 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 font-bold text-lg text-white">
          <img src={item.escudoLocal} onError={handleImageError} className="w-6 h-6 object-contain" alt={`${localTeam} logo`} />
          <span>{localTeam}</span>
          <span className="text-gray-400 text-sm">vs</span>
          <span>{visitorTeam}</span>
          <img src={item.escudoVisitante} onError={handleImageError} className="w-6 h-6 object-contain" alt={`${visitorTeam} logo`} />
        </div>
        <p className="text-sm text-gray-400">{item.liga}</p>
        <p className="text-sm text-gray-300 mt-1">
          <span className="font-semibold text-electric-blue">Predicción:</span> {getWinner()}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        {item.result === 'pending' ? (
          <>
            <button
              onClick={() => onMarkResult(item.id, 'correct')}
              className="bg-green-600 hover:bg-green-500 text-white font-bold p-2 rounded-full transition-colors"
              aria-label="Mark as correct"
            >
              ✅
            </button>
            <button
              onClick={() => onMarkResult(item.id, 'incorrect')}
              className="bg-red-600 hover:bg-red-500 text-white font-bold p-2 rounded-full transition-colors"
              aria-label="Mark as incorrect"
            >
              ❌
            </button>
          </>
        ) : (
          <span className={`px-3 py-1 text-sm font-bold rounded-full ${item.result === 'correct' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
            {item.result === 'correct' ? 'Acertada' : 'Fallada'}
          </span>
        )}
        <button
          onClick={() => onDelete(item.id)}
          className="bg-gray-600 hover:bg-gray-500 text-white font-bold p-2 rounded-full transition-colors"
          aria-label="Delete"
        >
         🗑️
        </button>
      </div>
    </div>
  );
};

export default HistoryCard;
