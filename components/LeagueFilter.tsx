
import React from 'react';

interface LeagueFilterProps {
  leagues: string[];
  selectedLeagues: string[];
  onFilterChange: (leagues: string[]) => void;
}

const LeagueFilter: React.FC<LeagueFilterProps> = ({ leagues, selectedLeagues, onFilterChange }) => {
  const handleLeagueClick = (league: string) => {
    const currentIndex = selectedLeagues.indexOf(league);
    const newSelectedLeagues = [...selectedLeagues];

    if (currentIndex === -1) {
      newSelectedLeagues.push(league);
    } else {
      newSelectedLeagues.splice(currentIndex, 1);
    }

    onFilterChange(newSelectedLeagues);
  };

  const handleSelectAll = () => {
    onFilterChange([]);
  };

  return (
    <div className="mb-6 p-4 bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-3 text-white">Filtrar por liga:</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleSelectAll}
          className={`px-3 py-1 text-sm font-medium rounded-full transition-colors duration-200 ${
            selectedLeagues.length === 0
              ? 'bg-neon-green text-gray-900'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Todas
        </button>
        {leagues.map((league) => (
          <button
            key={league}
            onClick={() => handleLeagueClick(league)}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors duration-200 ${
              selectedLeagues.includes(league)
                ? 'bg-electric-blue text-gray-900'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {league}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LeagueFilter;
