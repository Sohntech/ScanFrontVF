import { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: number;
  total: number;
  color: string;
  onClick: () => void;
}

export const StatCard = ({ icon, title, value, total, color, onClick }: StatCardProps) => {
  // Calculer le pourcentage de manière sécurisée
  const percentage = total > 0 ? Math.min(Math.round((value / total) * 100), 100) : 0;
  
  // Extraire la couleur de fond pour la barre de progression
  const getProgressColor = () => {
    // Vérifier si la couleur est au format Tailwind (comme "bg-blue-500")
    if (color.includes('bg-')) {
      const colorParts = color.split('bg-')[1];
      return `bg-${colorParts}`;
    }
    // Si c'est une couleur personnalisée, la retourner telle quelle
    return color;
  };

  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 cursor-pointer"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <div className="flex items-baseline">
              <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
              <span className="ml-2 text-sm text-gray-500">
                / {total} <span className="font-medium">({percentage}%)</span>
              </span>
            </div>
          </div>
          <div className={`${color} rounded-full p-3 transition-transform group-hover:scale-110`}>
            {icon}
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500 font-medium">Progression</span>
            <span className="font-semibold">{percentage}%</span>
          </div>
          <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out ${getProgressColor()}`}
              style={{
                width: `${percentage}%`
              }}
            />
          </div>
        </div>
      </div>
      <div 
        className="absolute inset-0 border-2 border-transparent group-hover:border-opacity-100 rounded-xl transition-all duration-300"
        style={{ borderColor: color.includes('bg-') ? `var(--${color.split('bg-')[1].replace('-', '-')})` : color, 
                 opacity: 0 }}
        aria-hidden="true"
      />
    </div>
  );
};