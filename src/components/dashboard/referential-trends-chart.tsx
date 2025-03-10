"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ChevronDown, ArrowUpRight } from "lucide-react"

// Types simplifiés pour l'exemple
type User = {
  referentiel: string
  firstName: string
  lastName: string
  matricule: string
}

type Presence = {
  user: User
  status: string
  scanTime: string
}

type ReferentialTrendsProps = {
  presences: Presence[]
  isLoading: boolean
  referentiels: string[]
  colors: {
    present: string
    late: string
    absent: string
  }
}

export default function ReferentialTrendsChart({
  presences,
  isLoading,
  referentiels,
  colors = {
    present: "#10B981", // Green for present
    late: "#F59E0B", // Orange for late
    absent: "#EF4444", // Red for absent
  },
}: ReferentialTrendsProps) {
  const [chartData, setChartData] = useState<any[]>([])
  const [viewType, setViewType] = useState<"count" | "percentage">("percentage")
  const [showDropdown, setShowDropdown] = useState(false)
  const [, setHighlightedRef] = useState<string | null>(null)

  // Préparer les données pour le graphique
  useEffect(() => {
    if (presences.length === 0) return

    // Regrouper les présences par référentiel et par statut
    const referentialStats = referentiels.map((referentiel) => {
      // Filtrer les présences pour ce référentiel
      const referentialPresences = presences.filter((presence) => presence.user.referentiel === referentiel)

      // Compter les statuts
      const present = referentialPresences.filter((p) => p.status.toLowerCase() === "present").length
      const late = referentialPresences.filter((p) => p.status.toLowerCase() === "late").length
      const absent = referentialPresences.filter((p) => p.status.toLowerCase() === "absent").length
      const total = present + late + absent

      // Calculer les pourcentages
      const presentPercentage = total > 0 ? Math.round((present / total) * 100) : 0
      const latePercentage = total > 0 ? Math.round((late / total) * 100) : 0
      const absentPercentage = total > 0 ? Math.round((absent / total) * 100) : 0

      return {
        name: referentiel,
        present,
        late,
        absent,
        total,
        presentPercentage,
        latePercentage,
        absentPercentage,
      }
    })

    // Filtrer les référentiels qui ont des données
    const filteredStats = referentialStats.filter((stat) => stat.total > 0)

    // Trier par taux de présence (du plus élevé au plus bas)
    filteredStats.sort((a, b) => b.presentPercentage - a.presentPercentage)

    setChartData(filteredStats)
  }, [presences, referentiels])

  // Formater les données pour l'affichage
  const getFormattedData = () => {
    if (viewType === "percentage") {
      return chartData.map((item) => ({
        name: item.name,
        Présents: item.presentPercentage,
        Retards: item.latePercentage,
        Absents: item.absentPercentage,
        total: item.total,
      }))
    } else {
      return chartData.map((item) => ({
        name: item.name,
        Présents: item.present,
        Retards: item.late,
        Absents: item.absent,
        total: item.total,
      }))
    }
  }

  // Formater le tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
          <p className="font-medium text-gray-800">{label}</p>
          <p className="text-sm text-gray-600 mt-1">Total: {data.total} apprenants</p>
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm">Présents:</span>
              </div>
              <span className="text-sm font-medium">
                {viewType === "percentage" ? `${payload[0].value}%` : payload[0].value}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-sm">Retards:</span>
              </div>
              <span className="text-sm font-medium">
                {viewType === "percentage" ? `${payload[1].value}%` : payload[1].value}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm">Absents:</span>
              </div>
              <span className="text-sm font-medium">
                {viewType === "percentage" ? `${payload[2].value}%` : payload[2].value}
              </span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  // Formater les labels de l'axe Y

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="relative mb-6">
            <h1 className="text-center text-xl font-bold text-gray-800">Aucune donnée disponible</h1>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-orange-500 rounded-full"></div>
          </div>
          <p className="text-gray-600 text-center mb-4">
            Aucune présence n'a été enregistrée pour les filtres sélectionnés
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Contrôles du graphique */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Tendances par référentiel</h3>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span>{viewType === "percentage" ? "Pourcentages" : "Nombre"}</span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <button
                onClick={() => {
                  setViewType("percentage")
                  setShowDropdown(false)
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  viewType === "percentage" ? "bg-orange-50 text-orange-700" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Pourcentages
              </button>
              <button
                onClick={() => {
                  setViewType("count")
                  setShowDropdown(false)
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  viewType === "count" ? "bg-orange-50 text-orange-700" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Nombre
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Graphique */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={getFormattedData()}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            barGap={2}
            barSize={18}
            onMouseMove={(data) => {
              if (data.activeTooltipIndex !== undefined) {
                setHighlightedRef(chartData[data.activeTooltipIndex]?.name || null)
              }
            }}
            onMouseLeave={() => setHighlightedRef(null)}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" tickFormatter={(value) => value.toString()} domain={viewType === "percentage" ? [0, 100] : undefined} />
            <YAxis
              type="category"
              dataKey="name"
              width={80}
              tick={{
                fontSize: 12,
                fontWeight: 500,
                fill: "#6B7280",
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value) => <span className="text-sm font-medium">{value}</span>}
            />
            <Bar dataKey="Présents" stackId="a" fill={colors.present} radius={[4, 0, 0, 4]} animationDuration={1000} />
            <Bar dataKey="Retards" stackId="a" fill={colors.late} animationDuration={1000} animationBegin={200} />
            <Bar
              dataKey="Absents"
              stackId="a"
              fill={colors.absent}
              radius={[0, 4, 4, 0]}
              animationDuration={1000}
              animationBegin={400}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      {chartData.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <ArrowUpRight className="h-4 w-4 text-green-500" />
            <p className="text-sm text-gray-700">
              <span className="font-medium">{chartData[0].name}</span> a le meilleur taux de présence à{" "}
              <span className="font-medium text-green-600">{chartData[0].presentPercentage}%</span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

