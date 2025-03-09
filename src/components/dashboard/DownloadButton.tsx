import { Download } from "lucide-react";
import { generatePDF } from "@/lib/utils";
import { Presence } from "@/types/index";

interface DownloadButtonProps {
  presences: Presence[];
}

export const DownloadButton = ({ presences }: DownloadButtonProps) => {
  const handleDownload = () => {
    const headers = ["Prenom et Nom", "Matricule", "Référentiel", "Status", "Heure", "Date"];
    const data = presences.map(dt => {
      const date = new Date(dt.scanTime);
      const dateFormat = date.toLocaleDateString("fr-FR");
      const heureFormat = date.toLocaleTimeString("fr-FR");
      return [
        `${dt.user.firstName} ${dt.user.lastName}`,
        dt.user.matricule,
        dt.user.referentiel,
        dt.status,
        heureFormat,
        dateFormat
      ];
    });
    
    generatePDF({
      title: "La liste des présences",
      headers,
      data,
      filename: "liste-presences.pdf"
    });
  };

  return (
    <button 
      onClick={handleDownload} 
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
    >
      <Download className="h-4 w-4 mr-2" />
      Exporter PDF
    </button>
  );
}; 