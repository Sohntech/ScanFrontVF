import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks/store'
// import { getStudentPresences } from '@/store/slices/presenceSlice'
import { Card, Stats, PresenceTable } from '@/components/ui'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { getProfile } from '@/store/slices/authSlice'
import { GraduationCap, Mail, IdCard, Calendar, Clock, CheckCircle } from 'lucide-react'

const COLORS = ['#008000', '#FF9800', '#FF5733']

function StudentDashboard() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  let { presences } = useAppSelector((state) => state.presence)

  useEffect(() => {
    (async () => {
      await dispatch(getProfile()).unwrap();
    })();
  }, [])

  const stats = [...presences].reduce(
    (acc: { present: number; late: number; absent: number }, presence) => {
      const key = presence.status.toLowerCase() as keyof typeof acc;
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Tableau de Bord Étudiant
            </h1>
            <p className="text-orange-100">
              Gérez vos présences et suivez vos statistiques
            </p>
          </div>
        </div>

        {/* Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white shadow-xl rounded-3xl transform hover:scale-[1.02] transition-transform duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative group">
                  <img
                    src={user?.photoUrl || 'https://via.placeholder.com/100'}
                    alt=""
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                  />
                  <div className="absolute -bottom-3 -right-3 bg-orange-500 text-white p-2 rounded-xl shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                </div>
                <div className="space-y-4 flex-1">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {user?.firstName} {user?.lastName}
                    </h2>
                    <p className="text-orange-500 font-medium">{user?.referentiel}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 bg-orange-50 p-3 rounded-xl">
                      <Mail className="w-5 h-5 text-orange-500" />
                      <span className="text-sm text-gray-600 truncate">{user?.email}</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-orange-50 p-3 rounded-xl">
                      <IdCard className="w-5 h-5 text-orange-500" />
                      <span className="text-sm text-gray-600">#{user?.matricule}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* QR Code Section */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white shadow-xl rounded-3xl transform hover:scale-[1.02] transition-transform duration-300">
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-orange-500 text-white p-3 rounded-full">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">QR Code Présence</h3>
                {user?.qrCode && (
                  <div className="bg-white p-4 rounded-2xl shadow-inner border border-orange-100">
                    <img src={user.qrCode} alt="QR Code" className="w-full max-w-[200px] h-auto" />
                  </div>
                )}
                <p className="text-sm text-gray-500 text-center">
                  Scannez pour marquer votre présence
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 bg-white shadow-xl rounded-3xl transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-orange-500 p-2 rounded-xl text-white">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Statistiques de présence
              </h3>
            </div>
            <Stats stats={{ ...stats, total: presences.length }} />
          </Card>

          <Card className="p-6 bg-white shadow-xl rounded-3xl transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-orange-500 p-2 rounded-xl text-white">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Répartition des présences
              </h3>
            </div>
            <div className="h-64">
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
                    {chartData.map((_entry, index) => (
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
          </Card>
        </div>

        {/* Presence History */}
        <Card className="p-6 bg-white shadow-xl rounded-3xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-orange-500 p-2 rounded-xl text-white">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Historique des présences
            </h3>
          </div>
          <div className="overflow-x-auto">
            <PresenceTable 
              presences={presences} 
              showStudent={false} 
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

export default StudentDashboard