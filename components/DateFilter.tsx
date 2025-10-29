
import React from 'react';

type DateFilterType = 'all' | 'today' | 'upcoming';

interface DateFilterProps {
  selectedFilter: DateFilterType;
  onFilterChange: (filter: DateFilterType) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ selectedFilter, onFilterChange }) => {
  const filters: { value: DateFilterType, label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'today', label: 'Hoy' },
    { value: 'upcoming', label: 'Próximos' },
  ];

  return (
    <div className="mb-4 p-4 bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-3 text-white">Filtrar por fecha:</h3>
      <div className="flex flex-wrap gap-2">
        {filters.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors duration-200 ${
              selectedFilter === value
                ? 'bg-neon-green text-gray-900'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DateFilter;
