import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import jsPDF from "jspdf"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Interface améliorée avec options supplémentaires
interface PDFGeneratorProps {
  title: string
  subtitle?: string
  headers: string[]
  data: string[][]
  filename?: string
  // Nouvelles options
  logo?: {
    url: string
    width: number
    height: number
  }
  theme?: {
    primary: string
    secondary: string
    textDark: string
    textLight: string
    headerBg: string
    borderColor: string
    altRow: string
  }
  showPageNumbers?: boolean
  dateFormat?: string
  footer?: string
  metadata?: {
    author?: string
    subject?: string
    keywords?: string
  }
  columnWidths?: number[] // Largeurs personnalisées pour les colonnes
}

// Remplacer la fonction generatePDF complète par cette version améliorée

export const generatePDF = (datas: PDFGeneratorProps) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  // Ajout des métadonnées
  if (datas.metadata) {
    if (datas.metadata.author) doc.setProperties({ author: datas.metadata.author })
    if (datas.metadata.subject) doc.setProperties({ subject: datas.metadata.subject })
    if (datas.metadata.keywords) doc.setProperties({ keywords: datas.metadata.keywords })
  }

  // Thème par défaut avec les couleurs d'Orange
  const defaultTheme = {
    primary: "#FF7900", // Orange principal
    secondary: "#F16E00", // Orange secondaire
    textDark: "#000000", // Noir
    textLight: "#666666", // Gris
    headerBg: "#FFF0E2", // Fond orange très clair
    borderColor: "#CCCCCC", // Gris clair pour les bordures
    altRow: "#FFF8F2", // Fond alterné très légèrement orangé
  }

  // Fusion du thème par défaut avec les options personnalisées
  const colors = { ...defaultTheme, ...(datas.theme || {}) }

  // Dimensions
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  const margins = { left: 15, right: 15, top: 20, bottom: 20 }
  const contentWidth = pageWidth - margins.left - margins.right

  // Définir une taille de police standard pour tout le document
  const fontSize = {
    title: 16,
    subtitle: 12,
    header: 10,
    body: 9,
    footer: 8,
  }

  // Définir une hauteur de ligne minimale
  const minRowHeight = 8

  // Définir un padding standard pour les cellules
  const cellPadding = {
    top: 2,
    right: 3,
    bottom: 2,
    left: 3,
  }

  // Calcul des largeurs de colonnes
  let columnWidths: number[] = []

  if (datas.columnWidths && datas.columnWidths.length === datas.headers.length) {
    // Utiliser les largeurs personnalisées si elles sont fournies
    columnWidths = [...datas.columnWidths]

    // Vérifier que la somme des largeurs ne dépasse pas la largeur disponible
    const totalWidth = columnWidths.reduce((sum, width) => sum + width, 0)
    if (totalWidth > contentWidth) {
      const ratio = contentWidth / totalWidth
      columnWidths = columnWidths.map((width) => width * ratio)
    }
  } else {
    // Calculer les largeurs en fonction du contenu
    // D'abord, estimer la largeur nécessaire pour chaque colonne en fonction des en-têtes
    const headerWidths = datas.headers.map((header) => {
      doc.setFont("helvetica", "bold")
      doc.setFontSize(fontSize.header)
      return doc.getTextWidth(header) + cellPadding.left + cellPadding.right
    })

    // Ensuite, estimer la largeur nécessaire pour chaque colonne en fonction des données
    const dataWidths = new Array(datas.headers.length).fill(0)
    datas.data.forEach((row) => {
      row.forEach((cell, i) => {
        if (i < dataWidths.length) {
          doc.setFont("helvetica", "normal")
          doc.setFontSize(fontSize.body)
          const cellWidth = doc.getTextWidth(String(cell)) + cellPadding.left + cellPadding.right
          dataWidths[i] = Math.max(dataWidths[i], cellWidth)
        }
      })
    })

    // Prendre le maximum entre la largeur de l'en-tête et la largeur des données
    columnWidths = headerWidths.map((width, i) => Math.max(width, dataWidths[i]))

    // Ajuster les largeurs pour qu'elles tiennent dans la largeur disponible
    const totalWidth = columnWidths.reduce((sum, width) => sum + width, 0)
    if (totalWidth > contentWidth) {
      const ratio = contentWidth / totalWidth
      columnWidths = columnWidths.map((width) => width * ratio)
    } else if (totalWidth < contentWidth) {
      // Distribuer l'espace restant proportionnellement
      const remaining = contentWidth - totalWidth
      const totalOriginalWidth = columnWidths.reduce((sum, width) => sum + width, 0)
      columnWidths = columnWidths.map((width) => width + (width / totalOriginalWidth) * remaining)
    }
  }

  // Fonctions utilitaires


  const drawRect = (x: number, y: number, w: number, h: number, color: string) => {
    doc.setFillColor(color)
    doc.rect(x, y, w, h, "F")
  }

  const drawCell = (
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    options: {
      align?: "left" | "center" | "right"
      valign?: "top" | "middle" | "bottom"
      fontSize?: number
      fontStyle?: "normal" | "bold" | "italic"
      textColor?: string
      fillColor?: string
      drawBorder?: boolean
      borderColor?: string
      borderWidth?: number
      padding?: { top: number; right: number; bottom: number; left: number }
    } = {},
  ) => {
    const {
      align = "left",
      valign = "middle",
      fontSize: size = fontSize.body,
      fontStyle = "normal",
      textColor = colors.textDark,
      fillColor,
      drawBorder = false,
      borderColor = colors.borderColor,
      borderWidth = 0.1,
      padding = cellPadding,
    } = options

    // Remplir la cellule si une couleur de fond est spécifiée
    if (fillColor) {
      drawRect(x, y, width, height, fillColor)
    }

    // Dessiner la bordure si demandé
    if (drawBorder) {
      doc.setDrawColor(borderColor)
      doc.setLineWidth(borderWidth)
      doc.rect(x, y, width, height)
    }

    // Préparer le texte
    doc.setFont("helvetica", fontStyle)
    doc.setFontSize(size)
    doc.setTextColor(textColor)

    // Calculer la largeur disponible pour le texte
    const textWidth = width - padding.left - padding.right

    // Diviser le texte en lignes si nécessaire
    const lines = doc.splitTextToSize(String(text), textWidth)

    // Calculer la position y en fonction de l'alignement vertical
    let textY
    const lineHeight = size * 0.352778 // Conversion de points en mm
    const textHeight = lines.length * lineHeight

    if (valign === "top") {
      textY = y + padding.top + lineHeight
    } else if (valign === "bottom") {
      textY = y + height - padding.bottom - textHeight + lineHeight
    } else {
      // middle
      textY = y + height / 2 - textHeight / 2 + lineHeight
    }

    // Dessiner chaque ligne de texte
    lines.forEach((line: string, i: number) => {
      let textX
      if (align === "right") {
        textX = x + width - padding.right
      } else if (align === "center") {
        textX = x + width / 2
      } else {
        // left
        textX = x + padding.left
      }

      doc.text(line, textX, textY + i * lineHeight, { align })
    })

    // Retourner le nombre de lignes pour calculer la hauteur nécessaire
    return lines.length
  }

  // Fonction pour calculer la hauteur nécessaire pour une ligne
  const calculateRowHeight = (row: string[]): number => {
    let maxLines = 1

    row.forEach((cell, i) => {
      doc.setFont("helvetica", "normal")
      doc.setFontSize(fontSize.body)
      const textWidth = columnWidths[i] - cellPadding.left - cellPadding.right
      const lines = doc.splitTextToSize(String(cell), textWidth).length
      maxLines = Math.max(maxLines, lines)
    })

    const lineHeight = fontSize.body * 0.352778 // Conversion de points en mm
    return Math.max(minRowHeight, maxLines * lineHeight + cellPadding.top + cellPadding.bottom)
  }

  // Fonction pour formater la date
  const formatDate = () => {
    const now = new Date()
    if (datas.dateFormat) {
      return datas.dateFormat
        .replace("YYYY", now.getFullYear().toString())
        .replace("MM", (now.getMonth() + 1).toString().padStart(2, "0"))
        .replace("DD", now.getDate().toString().padStart(2, "0"))
        .replace("HH", now.getHours().toString().padStart(2, "0"))
        .replace("mm", now.getMinutes().toString().padStart(2, "0"))
    }
    return now.toLocaleDateString()
  }

  // Fonction pour ajouter un en-tête à chaque page
  const addHeader = (pageNum: number) => {
    // Logo ou texte Orange en haut à gauche
    if (datas.logo) {
      doc.addImage(datas.logo.url, "JPEG", margins.left, margins.top - 15, datas.logo.width, datas.logo.height)
    } else {
      doc.setFont("helvetica", "bold")
      doc.setFontSize(14)
      doc.setTextColor(colors.primary)
      doc.text("Orange", margins.left, margins.top - 5)
    }

    // Date en haut à droite
    doc.setFont("helvetica", "normal")
    doc.setFontSize(fontSize.footer)
    doc.setTextColor(colors.textLight)
    doc.text(formatDate(), pageWidth - margins.right, margins.top - 5, { align: "right" })

    // Numéro de page au centre
    if (datas.showPageNumbers !== false) {
      const pageText = `Page ${pageNum}`
      doc.text(pageText, pageWidth / 2, margins.top - 5, { align: "center" })
    }

    // Ligne séparatrice en haut
    doc.setDrawColor(colors.primary)
    doc.setLineWidth(0.5)
    doc.line(margins.left, margins.top - 2, pageWidth - margins.right, margins.top - 2)
  }

  // Fonction pour ajouter un pied de page à chaque page
  const addFooter = (pageNum: number, totalPages: number) => {
    // Ligne séparatrice en bas
    doc.setDrawColor(colors.primary)
    doc.setLineWidth(0.5)
    doc.line(margins.left, pageHeight - margins.bottom + 5, pageWidth - margins.right, pageHeight - margins.bottom + 5)

    // Texte du pied de page
    doc.setFont("helvetica", "normal")
    doc.setFontSize(fontSize.footer)
    doc.setTextColor(colors.textLight)

    // Pied de page personnalisé ou par défaut
    if (datas.footer) {
      doc.text(datas.footer, pageWidth / 2, pageHeight - margins.bottom + 10, { align: "center" })
    } else {
      doc.text("Document généré par Orange", pageWidth / 2, pageHeight - margins.bottom + 10, { align: "center" })
    }

    // Numérotation des pages
    if (datas.showPageNumbers !== false) {
      const footer = `Page ${pageNum} sur ${totalPages}`
      doc.text(footer, pageWidth / 2, pageHeight - margins.bottom + 15, { align: "center" })
    }
  }

  // Variables pour suivre la position actuelle
  let currentY = margins.top
  let currentPage = 1

  // Ajout du logo si fourni
  if (datas.logo) {
    doc.addImage(datas.logo.url, "JPEG", margins.left, currentY, datas.logo.width, datas.logo.height)
    currentY += datas.logo.height + 5
  }

  // Titre du document
  doc.setFont("helvetica", "bold")
  doc.setFontSize(fontSize.title)
  doc.setTextColor(colors.primary)
  doc.text(datas.title, pageWidth / 2, currentY, { align: "center" })
  currentY += 8

  // Sous-titre
  if (datas.subtitle) {
    doc.setFontSize(fontSize.subtitle)
    doc.setTextColor(colors.textLight)
    doc.text(datas.subtitle, pageWidth / 2, currentY, { align: "center" })
    currentY += 12
  } else {
    currentY += 4
  }

  // Ajout de l'en-tête à la première page
  addHeader(currentPage)

  // Fonction pour dessiner l'en-tête du tableau
  const drawTableHeader = (y: number): number => {
    // Hauteur de l'en-tête
    const headerHeight = minRowHeight + 4 // Un peu plus haut que les lignes normales

    // Fond de l'en-tête
    drawRect(margins.left, y, contentWidth, headerHeight, colors.headerBg)

    // Position x pour chaque colonne
    let x = margins.left

    // Dessiner chaque cellule d'en-tête
    datas.headers.forEach((header, i) => {
      drawCell(x, y, columnWidths[i], headerHeight, header, {
        align: "center",
        fontSize: fontSize.header,
        fontStyle: "bold",
        textColor: colors.textDark,
        drawBorder: true,
        borderColor: colors.primary,
        borderWidth: 0.3,
      })

      x += columnWidths[i]
    })

    return headerHeight
  }

  // Dessiner l'en-tête du tableau
  const headerHeight = drawTableHeader(currentY)
  currentY += headerHeight

  // Contenu du tableau
  datas.data.forEach((row, rowIndex) => {
    // Calculer la hauteur nécessaire pour cette ligne
    const rowHeight = calculateRowHeight(row)

    // Vérifier s'il faut passer à une nouvelle page
    if (currentY + rowHeight > pageHeight - margins.bottom - 20) {
      doc.addPage()
      currentPage++
      currentY = margins.top + 10

      // Ajouter l'en-tête à la nouvelle page
      addHeader(currentPage)

      // Redessiner l'en-tête du tableau
      const headerHeight = drawTableHeader(currentY)
      currentY += headerHeight
    }

    // Fond alterné pour les lignes
    if (rowIndex % 2 === 0) {
      drawRect(margins.left, currentY, contentWidth, rowHeight, colors.altRow)
    }

    // Position x pour chaque colonne
    let x = margins.left

    // Dessiner chaque cellule
    row.forEach((cell, i) => {
      // Déterminer l'alignement en fonction du type de données
      const isNumber = !isNaN(Number(cell.toString().replace(/[^0-9.-]+/g, "")))
      const align = isNumber ? "left" : "right"

      drawCell(x, currentY, columnWidths[i], rowHeight, cell, {
        align,
        fontSize: fontSize.body,
        drawBorder: true,
        borderColor: colors.borderColor,
        borderWidth: 0.1,
      })

      x += columnWidths[i]
    })

    currentY += rowHeight
  })

  

  // Pied de page pour toutes les pages
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    addFooter(i, pageCount)
  }

  // Sauvegarder le PDF
  doc.save(datas.filename || "orange-document.pdf")

  // Retourner le document pour permettre des opérations supplémentaires
  return doc
}

// Fonction d'aide pour utiliser le générateur
export const createTablePDF = (options: PDFGeneratorProps) => {
  return generatePDF(options)
}

