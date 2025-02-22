import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import jsPDF from "jspdf";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


interface PDFGeneratorProps {
  title: string;
  subtitle?: string;
  headers: string[];
  data: string[][];
  filename?: string;
}

export const generatePDF = (datas: PDFGeneratorProps) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  // Couleurs
  const colors = {
    primary: "#2563eb",
    textDark: "#1f2937",
    textLight: "#6b7280",
    headerBg: "#f3f4f6",
    borderColor: "#e5e7eb",
    altRow: "#f9fafb"
  };

  // Dimensions
  const pageWidth = doc.internal.pageSize.width;
  const margins = { left: 20, right: 20 };
  const contentWidth = pageWidth - margins.left - margins.right;
  const columnWidth = contentWidth / datas.headers.length;
  const rowHeight = 10;

  // Fonctions utilitaires
  const drawLine = (y: number) => {
    doc.setDrawColor(colors.borderColor);
    doc.setLineWidth(0.1);
    doc.line(margins.left, y, pageWidth - margins.right, y);
  };

  const drawRect = (x: number, y: number, w: number, h: number, color: string) => {
    doc.setFillColor(color);
    doc.rect(x, y, w, h, "F");
  };

  // En-tête du document
  let currentY = 20;

  // Titre
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(colors.textDark);
  doc.text(datas.title, pageWidth / 2, currentY, { align: "center" });

  // Sous-titre
  if (datas.subtitle) {
    currentY += 10;
    doc.setFontSize(12);
    doc.setTextColor(colors.textLight);
    doc.text(datas.subtitle, pageWidth / 2, currentY, { align: "center" });
  }

  currentY += 20;

  // En-tête du tableau
  drawRect(margins.left, currentY, contentWidth, rowHeight, colors.headerBg);

  doc.setFontSize(11);
  doc.setTextColor(colors.textDark);
  datas.headers.forEach((header, i) => {
    doc.setFont("helvetica", "bold");
    doc.text(
      header,
      margins.left + (i * columnWidth) + columnWidth / 2,
      currentY + 7,
      { align: "center" }
    );
  });

  currentY += rowHeight;
  drawLine(currentY);

  // Contenu du tableau
  datas.data.forEach((row, rowIndex) => {
    // Nouvelle page si nécessaire
    if (currentY > doc.internal.pageSize.height - 20) {
      doc.addPage();
      currentY = 20;

      // Répéter l'en-tête du tableau
      drawRect(margins.left, currentY, contentWidth, rowHeight, colors.headerBg);
      datas.headers.forEach((header, i) => {
        doc.setFont("helvetica", "bold");
        doc.text(
          header,
          margins.left + (i * columnWidth) + columnWidth / 2,
          currentY + 7,
          { align: "center" }
        );
      });
      currentY += rowHeight;
      drawLine(currentY);
    }

    // Fond alterné pour les lignes
    if (rowIndex % 2 === 0) {
      drawRect(margins.left, currentY, contentWidth, rowHeight, colors.altRow);
    }

    // Données de la ligne
    doc.setFont("helvetica", "normal");
    row.forEach((cell, i) => {
      doc.text(
        String(cell),
        margins.left + (i * columnWidth) + columnWidth / 2,
        currentY + 7,
        { align: "center" }
      );
    });

    currentY += rowHeight;
    drawLine(currentY);
  });

  // Pied de page
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const footer = `Page ${i} sur ${pageCount}`;
    doc.setFontSize(10);
    doc.setTextColor(colors.textLight);
    doc.text(
      footer,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  // Sauvegarder le PDF
  doc.save(datas.filename??"download.pdf");
};
