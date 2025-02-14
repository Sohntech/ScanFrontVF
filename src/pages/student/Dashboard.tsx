import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks/store'
import { getStudentPresences } from '@/store/slices/presenceSlice'
import { Card, Stats, PresenceTable } from '@/components/ui'
// import { QRCodeSVG } from 'qrcode.react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'

const COLORS = ['#4CAF50', '#FFC107', '#F44336']

function StudentDashboard() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { presences } = useAppSelector((state) => state.presence)

  useEffect(() => {
    if (user?.id) {
      dispatch(getStudentPresences(user.id))
    }
  }, [dispatch, user?.id])

  const stats = presences.reduce(
    (acc: { present: number; late: number; absent: number }, presence) => {
      const key = presence.status.toLowerCase() as keyof typeof acc; // 👈 TypeScript comprend maintenant que c'est une clé valide
      acc[key]++;
      return acc;
    },
    { present: 0, late: 0, absent: 0 }
  );
  

  const chartData = [
    { name: 'Présents', value: stats.present },
    { name: 'Retards', value: stats.late },
    { name: 'Absents', value: stats.absent },
  ]

  const presenceRate = (stats.present / (presences.length || 1)) * 100

  return (
    <div className="space-y-6">
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations personnelles */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Mes informations
            </h2>
            <div className="flex items-start space-x-4">
              <img
                src={user?.photoUrl || 'https://via.placeholder.com/100'}
                alt=""
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-gray-500">{user?.email}</p>
                <p className="text-gray-500">Matricule: {user?.matricule}</p>
                <p className="text-gray-500">Référentiel: {user?.referentiel}</p>
              </div>
            </div>
          </div>

          {/* QR Code */}
        <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
  <h3 className="text-lg font-medium text-gray-900 mb-4">Mon QR Code</h3>
  {user?.qrCode && (
    <img src={user.qrCode} alt="QR Code" className="w-40 h-40" />
  )}
  <p className="text-sm text-gray-500">
    Scannez ce QR Code pour marquer votre présence
  </p>
</div>
</div>


        {/* Statistiques */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Mes statistiques
          </h3>
          <Stats stats={{ ...stats, total: presences.length }} />

          {/* Graphique */}
          <div className="h-64 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Historique des présences */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Historique des présences
          </h3>
          <PresenceTable 
            presences={presences} 
            showStudent={false} 
          />
        </div>
      </Card>
    </div>
  )
}

export default StudentDashboard