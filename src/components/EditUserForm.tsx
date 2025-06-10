import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/env';

interface UserData {
  id: number;
  name: string;
  lastName: string;
  email: string;
  roleId: number;
  password?: string; // La contraseña es opcional para la edición
}

interface EditUserFormProps {
  userId: number;
  onClose: () => void;
  onUserUpdated: () => void; // Para notificar a la tabla que se actualizó un usuario
  theme: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string;
  sucursalId: number;
}

// Custom hook for fetching roles
function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No autorizado: No se encontró el token de autenticación para roles.');
        const response = await fetch(`${API_BASE_URL}/roles`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message ?? 'Error al cargar los roles.');
        }
        const data: Role[] = await response.json();
        setRoles(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  return { roles, loading, error };
}

// Custom hook for fetching user data
function useUserData(userId: number) {
  const [formData, setFormData] = useState<Partial<UserData>>({
    name: '',
    lastName: '',
    email: '',
    roleId: undefined,
    password: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No autorizado: No se encontró el token de autenticación.');
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message ?? 'Error al cargar los datos del usuario.');
        }
        const data: UserData = await response.json();
        setFormData({
          name: data.name,
          lastName: data.lastName,
          email: data.email,
          roleId: data.roleId,
          password: '',
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchUserData();
  }, [userId]);

  return { formData, setFormData, loading, error };
}

// Subcomponent for the form fields
interface EditUserFieldsProps {
  formData: Partial<UserData>;
  roles: Role[];
  rolesLoading: boolean;
  rolesError: string | null;
  theme: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}
const EditUserFields: React.FC<EditUserFieldsProps> = ({
  formData, roles, rolesLoading, rolesError, theme, handleChange
}) => (
  <>
    <div className="mb-4">
      <label htmlFor="name" className="block text-sm font-medium mb-1">Nombre:</label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name ?? ''}
        onChange={handleChange}
        className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
        required
      />
    </div>
    <div className="mb-4">
      <label htmlFor="lastName" className="block text-sm font-medium mb-1">Apellido:</label>
      <input
        type="text"
        id="lastName"
        name="lastName"
        value={formData.lastName ?? ''}
        onChange={handleChange}
        className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
        required
      />
    </div>
    <div className="mb-4">
      <label htmlFor="email" className="block text-sm font-medium mb-1">Email:</label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email ?? ''}
        onChange={handleChange}
        className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
        required
      />
    </div>
    <div className="mb-4">
      <label htmlFor="password" className="block text-sm font-medium mb-1">Contraseña (dejar en blanco para no cambiar):</label>
      <input
        type="password"
        id="password"
        name="password"
        value={formData.password ?? ''}
        onChange={handleChange}
        className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
      />
    </div>
    <div className="mb-4">
      <label htmlFor="roleId" className="block text-sm font-medium mb-1">Rol:</label>
      {(() => {
        if (rolesLoading) {
          return <p>Cargando roles...</p>;
        }
        if (rolesError) {
          return <p className="text-red-500">Error al cargar roles: {rolesError}</p>;
        }
        return (
          <select
            id="roleId"
            name="roleId"
            value={formData.roleId ?? ''}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
            required
          >
            <option value="">Selecciona un rol</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        );
      })()}
    </div>
  </>
);

const EditUserForm: React.FC<EditUserFormProps> = ({ userId, onClose, onUserUpdated, theme }) => {
  const { roles, loading: rolesLoading, error: rolesError } = useRoles();
  const { formData, setFormData, loading, error } = useUserData(userId);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'roleId' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSuccess(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No autorizado: No se encontró el token de autenticación.');

      const payload: Partial<UserData> = {
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        roleId: formData.roleId,
      };
      if (formData.password) payload.password = formData.password;

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message ?? 'Error al actualizar el usuario.');
      }

      setSuccess('Usuario actualizado exitosamente.');
      onUserUpdated();
      onClose();
    } catch (err: any) {
      setSuccess(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  if ((loading || rolesLoading) && userId) {
    return <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>Cargando datos del usuario...</div>;
  }

  if ((error || rolesError) && userId) {
    return <div className={`p-4 text-red-500 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>Error: {error ?? rolesError}</div>;
  }

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
      <div className={`p-6 rounded-lg shadow-lg w-full max-w-md ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <h2 className="text-2xl font-bold mb-4">Editar Usuario</h2>
        <form onSubmit={handleSubmit}>
          <EditUserFields
            formData={formData}
            roles={roles}
            rolesLoading={rolesLoading}
            rolesError={rolesError}
            theme={theme}
            handleChange={handleChange}
          />
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded"
              disabled={submitLoading}
            >
              {submitLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserForm;
