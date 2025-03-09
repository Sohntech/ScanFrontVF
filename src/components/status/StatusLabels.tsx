import { Check, Clock, AlertTriangle } from "lucide-react";

export const getStatusLabel = (status: string) => {
  switch (status.toLowerCase()) {
    case "present":
      return (
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
          Présent
        </span>
      );
    case "late":
      return (
        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
          Retard
        </span>
      );
    case "absent":
      return (
        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
          Absent
        </span>
      );
    default:
      return (
        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
          Inconnu
        </span>
      );
  }
};

export const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "present":
      return <Check className="w-5 h-5 text-green-500" />;
    case "late":
      return <Clock className="w-5 h-5 text-yellow-500" />;
    case "absent":
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    default:
      return null;
  }
}; 