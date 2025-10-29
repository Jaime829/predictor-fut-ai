export interface Prediction {
  partido: string;
  liga: string;
  fecha: string;
  prediccion: 'Local' | 'Empate' | 'Visitante';
  probabilidad: {
    local: number;
    empate: number;
    visitante: number;
  };
  razonamiento: string;
  escudoLocal: string;
  escudoVisitante: string;
}

export interface HistoryItem extends Prediction {
  id: number;
  result: 'pending' | 'correct' | 'incorrect';
}
