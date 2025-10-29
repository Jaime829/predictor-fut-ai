
import React, { useState, useCallback, useMemo } from 'react';
import { fetchPredictions } from './services/geminiService';
import type { Prediction, HistoryItem } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import PredictionCard from './components/PredictionCard';
import HistoryCard from './components/HistoryCard';
import Loader from './components/Loader';
import Error from './components/Error';
import LeagueFilter from './components/LeagueFilter';
import DateFilter from './components/DateFilter';

type View = 'upcoming' | 'history';
type DateFilterType = 'all' | 'today' | 'upcoming';

const SUPPORTED_LEAGUES = [
  'Premier League',
  'LaLiga',
  'Serie A',
  'Bundesliga',
  'Ligue 1',
  'Copa Libertadores',
  'Champions League',
  'Europa League'
];

const App: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[] | null>(null);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('predictionHistory', []);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<View>('upcoming');
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');

  const handleFetchPredictions = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPredictions(null);
    setSelectedLeagues([]);
    setDateFilter('all');
    try {
      const newPredictions = await fetchPredictions();
      setPredictions(newPredictions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddToHistory = (prediction: Prediction) => {
    const newHistoryItem: HistoryItem = { ...prediction, id: Date.now(), result: 'pending' };
    setHistory(prev => [newHistoryItem, ...prev]);
    setPredictions(prev => prev?.filter(p => p.partido !== prediction.partido) || null);
  };
  
  const handleMarkResult = (id: number, result: 'correct' | 'incorrect') => {
    setHistory(prev => prev.map(item => item.id === id ? { ...item, result } : item));
  };

  const handleDeleteHistoryItem = (id: number) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  }

  const availableLeagues = useMemo(() => {
    if (!predictions) return [];
    const leaguesFromPredictions = predictions.map(p => p.liga);
    const allLeagues = [...new Set([...SUPPORTED_LEAGUES, ...leaguesFromPredictions])];
    return allLeagues.sort();
  }, [predictions]);

  const filteredPredictions = useMemo(() => {
    if (!predictions) return null;

    const leagueFiltered = selectedLeagues.length === 0
      ? predictions
      : predictions.filter(p => selectedLeagues.includes(p.liga));

    if (dateFilter === 'all') {
      return leagueFiltered;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (dateFilter === 'today') {
        return leagueFiltered.filter(p => {
            const predictionDate = new Date(p.fecha);
            return predictionDate >= today && predictionDate < tomorrow;
        });
    }

    if (dateFilter === 'upcoming') {
        return leagueFiltered.filter(p => {
            const predictionDate = new Date(p.fecha);
            return predictionDate >= tomorrow;
        });
    }

    return leagueFiltered;
  }, [predictions, selectedLeagues, dateFilter]);


  const renderContent = () => {
    if (loading) {
      return <Loader />;
    }
    if (error) {
      return <Error message={error} onRetry={handleFetchPredictions} />;
    }
    if (activeView === 'upcoming') {
      if (!predictions) {
        return (
          <div className="text-center text-gray-400 mt-10">
            <p>Haz clic en "Actualizar Predicciones" para empezar.</p>
          </div>
        );
      }
       if (predictions.length === 0 && !loading) {
        return (
          <div className="text-center text-gray-400 mt-10">
            <p>No se encontraron predicciones. Inténtalo de nuevo más tarde.</p>
          </div>
        );
      }
      return (
        <>
          {availableLeagues.length > 0 && (
            <>
              <DateFilter selectedFilter={dateFilter} onFilterChange={setDateFilter} />
              <LeagueFilter
                leagues={availableLeagues}
                selectedLeagues={selectedLeagues}
                onFilterChange={setSelectedLeagues}
              />
            </>
          )}
          {filteredPredictions && filteredPredictions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {filteredPredictions.map((p, index) => (
                <PredictionCard key={`${p.partido}-${index}`} prediction={p} onAddToHistory={handleAddToHistory} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 mt-10">
              <p>No hay predicciones que coincidan con los filtros seleccionados.</p>
            </div>
          )}
        </>
      );
    }
    if (activeView === 'history') {
       if (history.length === 0) {
        return (
          <div className="text-center text-gray-400 mt-10 animate-fade-in">
            <p>Tu historial de predicciones está vacío.</p>
          </div>
        );
      }
      return (
        <div className="space-y-4 animate-fade-in">
          {history.map((item) => (
            <HistoryCard 
              key={item.id} 
              item={item} 
              onMarkResult={handleMarkResult} 
              onDelete={handleDeleteHistoryItem} 
            />
          ))}
        </div>
      );
    }
    return null;
  };
  
  const TabButton: React.FC<{view: View, label: string}> = ({ view, label }) => (
     <button
        onClick={() => setActiveView(view)}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
          activeView === view
            ? 'bg-electric-blue text-gray-900'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        {label}
      </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        
        <main>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex space-x-2 bg-gray-800 p-1 rounded-lg">
              <TabButton view="upcoming" label="Próximas Predicciones" />
              <TabButton view="history" label="Historial" />
            </div>
            <button
              onClick={handleFetchPredictions}
              disabled={loading}
              className="w-full sm:w-auto bg-neon-green text-gray-900 font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
            >
              {loading ? 'Analizando...' : 'Actualizar Predicciones'}
            </button>
          </div>
          
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
