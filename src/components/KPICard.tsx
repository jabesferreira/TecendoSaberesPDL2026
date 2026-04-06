import React from 'react';
import { Info } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number | string;
  unit?: string;
  description: string;
  riskLevel?: 'green' | 'yellow' | 'orange' | 'red';
}

const KPICard: React.FC<KPICardProps> = ({ title, value, unit, description, riskLevel = 'green' }) => {
  const riskColors = {
    green: 'border-l-4 border-green-500 bg-green-50',
    yellow: 'border-l-4 border-yellow-500 bg-yellow-50',
    orange: 'border-l-4 border-orange-500 bg-orange-50',
    red: 'border-l-4 border-red-500 bg-red-50',
  };

  return (
    <div className={`${riskColors[riskLevel]} p-6 rounded-lg shadow-md relative group`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">
            {value}
            {unit && <span className="text-lg ml-2 text-gray-600">{unit}</span>}
          </p>
        </div>
        <button className="text-blue-500 hover:text-blue-700 relative">
          <Info size={20} />
          <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 text-white text-xs p-3 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto whitespace-normal">
            {description}
          </div>
        </button>
      </div>
    </div>
  );
};

export default KPICard;
