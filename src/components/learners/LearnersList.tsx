import { User } from "@/types/index";
import { MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import { useState } from "react";

interface LearnersListProps {
  data: User[];
  isLoading: boolean;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

export const LearnersList = ({ data, isLoading, onView, onEdit, onDelete }: LearnersListProps) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <div className="overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Apprenant
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Matricule
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Référentiel
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                      src={user.photoUrl}
                      alt=""
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.matricule}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.referentiel}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="relative">
                  <button
                    onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                  
                  {activeMenu === user.id && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            onView(user);
                            setActiveMenu(null);
                          }}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Voir détails
                        </button>
                        <button
                          onClick={() => {
                            onEdit(user);
                            setActiveMenu(null);
                          }}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </button>
                        <button
                          onClick={() => {
                            onDelete(user.id);
                            setActiveMenu(null);
                          }}
                          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center">
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
                  </div>
                ) : (
                  <div className="text-gray-500">Aucun apprenant trouvé</div>
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}; 