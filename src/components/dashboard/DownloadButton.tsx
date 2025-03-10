import { Download } from "lucide-react";
import { generatePDF } from "@/lib/utils";
import { Presence } from "@/types/index";
import * as XLSX from "xlsx";

interface DownloadButtonProps {
  presences: Presence[];
}

export const DownloadButton = ({ presences }: DownloadButtonProps) => {
  const handlePDFDownload = () => {
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
      title: "\nLa liste des présences",
      headers,
      data,
      filename: "liste-presences.pdf"
    });
  };

  const handleExcelDownload = () => {
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

    // Create a worksheet
    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);

    // Create a workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Présences");

    // Generate the Excel file and trigger download
    XLSX.writeFile(wb, "liste-presences.xlsx");
  };

  return (
    <div className="space-x-2">
      <button 
        onClick={handlePDFDownload} 
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
      >
        <Download className="h-4 w-4 mr-2" />
        Exporter PDF
      </button>
      
      <button 
        onClick={handleExcelDownload} 
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
      >
        <Download className="h-4 w-4 mr-2" />
        Exporter Excel
      </button>
    </div>
  );
};
