import { Presence } from '@/types/index'

interface PresenceTableProps {
  presences: Presence[]
  isLoading?: boolean
  showStudent?: boolean
}

function PresenceTable({ presences, isLoading, showStudent = true }: PresenceTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {showStudent && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Apprenant
              </th>
            )}
            {showStudent && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Matricule
              </th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Heure
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              <td
                colSpan={showStudent ? 5 : 3}
                className="px-6 py-4 text-center"
              >
                Chargement...
              </td>
            </tr>
          ) : presences.length === 0 ? (
            <tr>
              <td
                colSpan={showStudent ? 5 : 3}
                className="px-6 py-4 text-center"
              >
                Aucune présence trouvée
              </td>
            </tr>
          ) : (
            presences.map((presence) => (
              <tr key={presence.id}>
                {showStudent && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={presence.user?.photoUrl || 'https://via.placeholder.com/40'}
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {presence.user?.firstName} {presence.user?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {presence.user?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                )}
                {showStudent && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {presence.user?.matricule}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      presence.status === 'PRESENT'
                        ? 'bg-green-100 text-green-800'
                        : presence.status === 'LATE'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {presence.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(presence.scanTime).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(presence.scanTime).toLocaleTimeString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default PresenceTable