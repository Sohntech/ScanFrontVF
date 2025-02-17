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
import { Calendar, Filter, Users, BarChart2, RefreshCcw } from 'lucide-react'

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
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Dashboard Administrateur
                </h1>
                <p className="text-orange-100">
                  Gérez et analysez les présences des étudiants
                </p>
              </div>
              <Users className="w-12 h-12 text-white opacity-80" />
            </div>
          </div>
        </div>

        {/* Filters Card */}
        <Card className="p-6 bg-white shadow-xl rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-500 p-2 rounded-xl text-white">
                <Filter className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Filtres
              </h2>
            </div>
            <button
              onClick={resetFilters}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
            >
              <RefreshCcw className="w-4 h-4" />
              <span>Réinitialiser</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Date début */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Date début
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  className="pl-10 block w-full rounded-xl border-gray-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition-colors duration-200"
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
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  className="pl-10 block w-full rounded-xl border-gray-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition-colors duration-200"
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
                className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition-colors duration-200"
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
                className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-orange-500 focus:ring-orange-500 transition-colors duration-200"
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
        </Card>

        {/* Stats and Chart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Stats Card */}
          <Card className="p-6 bg-white shadow-xl rounded-3xl transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-orange-500 p-2 rounded-xl text-white">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Statistiques de présence
              </h3>
            </div>
            <Stats stats={stats} />
          </Card>

          {/* Chart Card */}
          <Card className="p-6 bg-white shadow-xl rounded-3xl transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-orange-500 p-2 rounded-xl text-white">
                <BarChart2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Répartition des présences
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#FF7900" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Presence Table Card */}
        <Card className="p-6 bg-white shadow-xl rounded-3xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-orange-500 p-2 rounded-xl text-white">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Liste des présences
            </h3>
          </div>
          <div className="overflow-x-auto">
            <PresenceTable presences={presences} isLoading={isLoading} />
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard