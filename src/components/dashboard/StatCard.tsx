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
  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer"
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <div className="flex items-baseline">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
              <span className="ml-2 text-sm text-gray-500">
                {total > 0 ? `(${Math.round((value / total) * 100)}%)` : "(0%)"}
              </span>
            </div>
          </div>
          <div className={`${color} rounded-lg p-3 transition-transform group-hover:scale-110`}>
            {icon}
          </div>
        </div>
        
        <div className="mt-4">
          <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: total > 0 ? `${(value / total) * 100}%` : "0%",
                backgroundColor: color.split(" ")[1]
              }}
            />
          </div>
        </div>
      </div>
      <div 
        className="absolute inset-0 border-2 border-transparent group-hover:border-primary-500 rounded-xl transition-colors duration-300"
        style={{ borderColor: color.split(" ")[1] }}
      />
    </div>
  );
}; 