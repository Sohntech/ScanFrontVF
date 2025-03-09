import { User, Presence } from "@/types/index";
import { useState } from "react";

interface LearnerFormProps {
  initialData?: User | Presence;
  onSubmit: (data: Partial<User>) => void;
  onCancel: () => void;
}

export const LearnerForm = ({ initialData, onSubmit, onCancel }: LearnerFormProps) => {
  const [formData, setFormData] = useState({
    firstName: initialData ? ('user' in initialData ? initialData.user.firstName : initialData.firstName) : "",
    lastName: initialData ? ('user' in initialData ? initialData.user.lastName : initialData.lastName) : "",
    email: initialData ? ('user' in initialData ? initialData.user.email : initialData.email) : "",
    matricule: initialData ? ('user' in initialData ? initialData.user.matricule : initialData.matricule) : "",
    referentiel: initialData ? ('user' in initialData ? initialData.user.referentiel : initialData.referentiel) : "",
    photoUrl: initialData ? ('user' in initialData ? initialData.user.photoUrl : initialData.photoUrl) : "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Prénom
          </label>
          <input
            type="text"
            required
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nom
          </label>
          <input
            type="text"
            required
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Matricule
          </label>
          <input
            type="text"
            required
            value={formData.matricule}
            onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Référentiel
          </label>
          <select
            value={formData.referentiel}
            onChange={(e) => setFormData({ ...formData, referentiel: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          >
            <option value="">Sélectionner un référentiel</option>
            <option value="RefDigital">RefDigital</option>
            <option value="DevWeb">DevWeb</option>
            <option value="DevData">DevData</option>
            <option value="AWS">AWS</option>
            <option value="Hackeuse">Hackeuse</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Photo URL
          </label>
          <input
            type="url"
            value={formData.photoUrl}
            onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          {initialData ? "Modifier" : "Ajouter"}
        </button>
      </div>
    </form>
  );
}; 