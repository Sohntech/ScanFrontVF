import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/store';
import { Card } from '@/components/ui';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { getProfile } from '@/store/slices/authSlice';
import { GraduationCap, Mail, IdCard, Calendar, Clock, QrCode } from 'lucide-react';

const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

function StudentDashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  let { presences } = useAppSelector((state) => state.presence);

  // Ajouter un console.log pour voir la structure
  console.log('First presence:', presences[0]);

  // Ajouter une assertion de type
  const typedPresences = presences as unknown as Array<{
    createdAt: string;
    subject: string;
    status: string;
  }>;

  useEffect(() => {
    (async () => {
      await dispatch(getProfile()).unwrap();
    })();
  }, []);

  const stats = [...typedPresences].reduce(
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
  ];

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header Section - Simplified and Modern */}
        <div className="bg-orange-500 bg-gradient 2-r from-orange-600 to-orange-700 rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-white">
            Tableau de Bord
          </h1>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* QR Code Section - Enhanced and Prominent */}
          <div className="lg:col-span-4 lg:row-span-2 order-1 lg:order-2">
            <Card className="h-full bg-white shadow-xl rounded-2xl overflow-hidden">
              <div className="relative h-full">
                {/* Decorative Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="grid grid-cols-8 grid-rows-8 gap-4 h-full">
                    {Array(64).fill(null).map((_, i) => (
                      <div key={i} className="bg-orange-500 rounded-full"></div>
                    ))}
                  </div>
                </div>
                
                <div className="relative p-6 flex flex-col items-center justify-center h-full space-y-6">
                  <div className="bg-orange-500 text-white p-4 rounded-full shadow-lg">
                    <QrCode className="w-8 h-8" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 text-center">
                    Scanner pour la présence
                  </h2>
                  
                  {user?.qrCode && (
                    <div className="bg-white p-6 sc rounded-2xl shadow-xl border-2 border-orange-100 transform hover:scale-105 transition-transform duration-300">
                      <img 
                        src={user.qrCode} 
                        alt="QR Code" 
                        className="w-full scale-125  max-w-[240px] h-auto"
                      />
                    </div>
                  )}
                  
                  <div className="text-center space-y-2">
                    <p className="text-orange-600 font-medium">
                      Code de présence personnel
                    </p>
                    <p>
                      <span>
                        {user?.matricule}
                      </span>
                    
                    </p>
                   
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Profile Section - Streamlined */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <Card className="bg-white shadow-lg rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative shrink-0">
                  <img
                    src={user?.photoUrl || 'https://via.placeholder.com/100'}
                    alt=""
                    className="w-24 h-24 rounded-2xl object-cover shadow-lg ring-4 ring-orange-50"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white p-2 rounded-xl shadow-lg">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                </div>
                
                <div className="flex-1 space-y-4 text-center sm:text-left">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </h2>
                    <p className="text-orange-600 font-medium">{user?.referentiel}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                      <Mail className="w-5 h-5 text-orange-500" />
                      <span className="text-sm text-gray-600 truncate">{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                      <IdCard className="w-5 h-5 text-orange-500" />
                      <span className="text-sm text-gray-600">#{user?.matricule}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Statistics Section - More Visual */}
          <div className="lg:col-span-8 order-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Attendance Stats */}
              <Card className="bg-white shadow-lg rounded-2xl p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-500 p-2 rounded-xl text-white">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Présences
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-emerald-50 p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-emerald-600">
                        {stats.present}
                      </div>
                      <div className="text-sm text-gray-600">Présent</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-orange-500">
                        {stats.late}
                      </div>
                      <div className="text-sm text-gray-600">Retard</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-red-500">
                        {stats.absent}
                      </div>
                      <div className="text-sm text-gray-600">Absent</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Chart */}
              <Card className="bg-white shadow-lg rounded-2xl p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-500 p-2 rounded-xl text-white">
                      <Clock className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Répartition
                    </h3>
                  </div>
                  
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={60}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {chartData.map((_, index) => (
                            <Cell 
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                              className="hover:opacity-80 transition-opacity"
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Presence History - Simplified */}
        <Card className="bg-white shadow-lg rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-500 p-2 rounded-xl text-white">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Historique
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 px-4 text-left text-sm font-medium text-gray-500">Date</th>
                  <th className="py-4 px-4 text-left text-sm font-medium text-gray-500">Cours</th>
                  <th className="py-4 px-4 text-left text-sm font-medium text-gray-500">Statut</th>
                </tr>
              </thead>
              <tbody>
                {typedPresences.map((presence, index) => (
                  <tr 
                    key={index}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {new Date(presence.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {presence.subject}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${presence.status.toLowerCase() === 'present' ? 'bg-emerald-100 text-emerald-800' :
                          presence.status.toLowerCase() === 'late' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'}`}>
                        {presence.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default StudentDashboard;