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
      acc[presence.status.toLowerCase()]++
      return acc
    },
    { present: 0, late: 0, absent: 0 }
  )

  const chartData = [
    { name: 'Présents', value: stats.present },
    { name: 'Retards', value: stats.late },
    { name: 'Absents', value: stats.absent },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Tableau de bord administrateur
        </h2>

        {/* Filtres */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date début
            </label>
            <input
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-primary focus:ring-orange-primary"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date fin
            </label>
            <input
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-primary focus:ring-orange-primary"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Statut
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-primary focus:ring-orange-primary"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">Tous</option>
              <option value="PRESENT">Présent</option>
              <option value="LATE">Retard</option>
              <option value="ABSENT">Absent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Référentiel
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-primary focus:ring-orange-primary"
              value={filters.referentiel}
              onChange={(e) =>
                setFilters({ ...filters, referentiel: e.target.value })
              }
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

        {/* Statistiques */}
        <Stats stats={stats} />

        {/* Graphique */}
        <div className="h-96 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#FF7900" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tableau des présences */}
        <PresenceTable presences={presences} isLoading={isLoading} />
      </Card>
    </div>
  )
}

export default AdminDashboard