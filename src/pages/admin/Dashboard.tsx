import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/store'
import { getPresences } from '@/store/slices/presenceSlice'
import { Card, Stats, PresenceTable } from '@/components/ui'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Calendar, Filter, Users, BarChart2, RefreshCcw, Code, Terminal, Sparkles, Cpu, Database, Menu } from 'lucide-react'

const referentiels = ['RefDigital', 'DevWeb', 'DevData', 'AWS', 'Hackeuse']

function AdminDashboard() {
  const dispatch = useAppDispatch()
  const { presences, isLoading } = useAppSelector((state) => state.presence)
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
    referentiel: '',
  })
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  useEffect(() => {
    dispatch(getPresences(filters))
  }, [dispatch, filters])

  const stats = presences.reduce(
    (acc, presence) => {
      const status = presence.status.toLowerCase() as 'present' | 'late' | 'absent';
      acc[status]++;
      return acc;
    },
    { present: 0, late: 0, absent: 0 }
  )

  const chartData = [
    { name: 'Présents', value: stats.present },
    { name: 'Retards', value: stats.late },
    { name: 'Absents', value: stats.absent },
  ]

  const resetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      status: '',
      referentiel: '',
    })
    setMobileFiltersOpen(false)
  }

  // Composant de filtres réutilisable
  const FilterInputs = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Date début */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Date début
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors duration-200" />
          </div>
          <input
            type="date"
            className="pl-10 block w-full rounded-xl border-gray-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition-all duration-200 hover:border-orange-300"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
        </div>
      </div>

      {/* Date fin */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Date fin
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors duration-200" />
          </div>
          <input
            type="date"
            className="pl-10 block w-full rounded-xl border-gray-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition-all duration-200 hover:border-orange-300"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
        </div>
      </div>

      {/* Statut */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Statut
        </label>
        <select
          className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition-all duration-200 hover:border-orange-300"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Tous</option>
          <option value="PRESENT">Présent</option>
          <option value="LATE">Retard</option>
          <option value="ABSENT">Absent</option>
        </select>
      </div>

      {/* Référentiel */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Référentiel
        </label>
        <select
          className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition-all duration-200 hover:border-orange-300"
          value={filters.referentiel}
          onChange={(e) => setFilters({ ...filters, referentiel: e.target.value })}
        >
          <option value="">Tous</option>
          {referentiels.map((ref) => (
            <option key={ref} value={ref}>
              {ref}
            </option>
          ))}
        </select>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600  "></div>
          <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl">
            <div className="p-4 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-orange-500 p-2 sm:p-3 rounded-2xl shadow-lg">
                      <Code className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">
                        École du Code Sonatel Academy
                      </h1>
                      <div className="flex items-center space-x-2 text-orange-50">
                        <Cpu className="w-4 h-4" />
                        <span className="text-sm sm:text-base">Dashboard Administrateur</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:space-x-4">
                    <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl">
                      <div className="flex items-center space-x-2 text-white text-sm">
                        <Database className="w-4 h-4" />
                        <span>Total Étudiants: {presences.length}</span>
                      </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl">
                      <div className="flex items-center space-x-2 text-white text-sm">
                        <Terminal className="w-4 h-4" />
                        <span>Taux de présence: {Math.round((stats.present / presences.length) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Card - Version Mobile */}
        <div className="md:hidden">
          <Card className="p-4 bg-white shadow-xl rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-xl shadow-lg">
                  <Filter className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Filtres</h2>
              </div>
              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="bg-gray-50 p-2 rounded-xl"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            {mobileFiltersOpen && (
              <div className="mt-4 space-y-4">
                <FilterInputs />
                <button
                  onClick={resetFilters}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl group"
                >
                  <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  <span>Réinitialiser</span>
                </button>
              </div>
            )}
          </Card>
        </div>

        {/* Filters Card - Version Desktop */}
        <div className="hidden md:block">
          <Card className="relative p-6 bg-white shadow-xl rounded-3xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full filter blur-3xl opacity-30"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-2xl shadow-lg">
                    <Filter className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Filtres Avancés
                  </h2>
                </div>
                <button
                  onClick={resetFilters}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl group"
                >
                  <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  <span>Réinitialiser</span>
                </button>
              </div>
              <FilterInputs />
            </div>
          </Card>
        </div>

        {/* Stats and Chart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Stats Card */}
          <Card className="relative p-4 sm:p-6 bg-white shadow-xl rounded-3xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full filter blur-3xl opacity-30"></div>
            <div className="relative">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 sm:p-3 rounded-2xl shadow-lg">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Statistiques en direct
                </h3>
              </div>
              <Stats stats={stats} />
            </div>
          </Card>

          {/* Chart Card */}
          <Card className="relative p-4 sm:p-6 bg-white shadow-xl rounded-3xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full filter blur-3xl opacity-30"></div>
            <div className="relative">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 sm:p-3 rounded-2xl shadow-lg">
                  <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Analyse des présences
                </h3>
              </div>
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: window.innerWidth < 768 ? 12 : 14 }}
                    />
                    <YAxis
                      tick={{ fontSize: window.innerWidth < 768 ? 12 : 14 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        fontSize: window.innerWidth < 768 ? '12px' : '14px'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="value" 
                      fill="url(#colorGradient)" 
                      radius={[8, 8, 0, 0]} 
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF7900" />
                        <stop offset="100%" stopColor="#FFB066" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>

        {/* Presence Table Card */}
        <Card className="relative p-4 sm:p-6 bg-white shadow-xl rounded-3xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full filter blur-3xl opacity-30"></div>
          <div className="relative">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 sm:p-3 rounded-2xl shadow-lg">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                Liste des présences
              </h3>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden border border-gray-200 sm:rounded-xl">
                  <PresenceTable 
                    presences={presences} 
                    isLoading={isLoading} 
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Mobile Quick Actions */}
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 p-4 z-50">
          <div className="flex justify-around max-w-md mx-auto">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex flex-col items-center space-y-1"
            >
              <div className="p-2 bg-orange-100 rounded-lg">
                <Filter className="w-5 h-5 text-orange-500" />
              </div>
              <span className="text-xs text-gray-600">Filtres</span>
            </button>
            <button
              onClick={resetFilters}
              className="flex flex-col items-center space-y-1"
            >
              <div className="p-2 bg-orange-100 rounded-lg">
                <RefreshCcw className="w-5 h-5 text-orange-500" />
              </div>
              <span className="text-xs text-gray-600">Réinitialiser</span>
            </button>
            <button className="flex flex-col items-center space-y-1">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart2 className="w-5 h-5 text-orange-500" />
              </div>
              <span className="text-xs text-gray-600">Stats</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-2 -m-2 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Fermer</span>
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <FilterInputs />
              </div>
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={resetFilters}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-orange-500 text-white rounded-xl shadow-lg hover:bg-orange-600 transition-colors duration-200"
                >
                  <RefreshCcw className="w-4 h-4" />
                  <span>Réinitialiser les filtres</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard