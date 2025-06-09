import React, { useState, useEffect } from 'react';

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

const EditUserForm: React.FC<EditUserFormProps> = ({ userId, onClose, onUserUpdated, theme }) => {
  const [formData, setFormData] = useState<Partial<UserData>>({
    name: '',
    lastName: '',
    email: '',
    roleId: undefined, // Inicializar como undefined para que el select no tenga un valor por defecto si no hay roles
    password: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]); // Nuevo estado para los roles
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      setRolesLoading(true);
      setRolesError(null);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No autorizado: No se encontró el token de autenticación para roles.');
        }
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/roles`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al cargar los roles.');
        }
        const data: Role[] = await response.json();
        setRoles(data);
      } catch (err: any) {
        setRolesError(err.message);
      } finally {
        setRolesLoading(false);
      }
    };

    fetchRoles();
  }, []); // Se ejecuta una sola vez al montar el componente

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No autorizado: No se encontró el token de autenticación.');
        }

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al cargar los datos del usuario.');
        }

        const data: UserData = await response.json();
        setFormData({
          name: data.name,
          lastName: data.lastName,
          email: data.email,
          roleId: data.roleId,
          password: '', // No precargar la contraseña por seguridad
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'roleId' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No autorizado: No se encontró el token de autenticación.');
      }

      const payload: Partial<UserData> = {
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        roleId: formData.roleId,
      };

      // Solo incluir la contraseña si se ha modificado
      if (formData.password) {
        payload.password = formData.password;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el usuario.');
      }

      setSuccess('Usuario actualizado exitosamente.');
      onUserUpdated(); // Notificar a la tabla para que recargue los datos
      onClose(); // Cerrar el formulario después de la actualización exitosa
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && userId) {
    return <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>Cargando datos del usuario...</div>;
  }

  if (error && userId) {
    return <div className={`p-4 text-red-500 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>Error: {error}</div>;
  }

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
      <div className={`p-6 rounded-lg shadow-lg w-full max-w-md ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <h2 className="text-2xl font-bold mb-4">Editar Usuario</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-1">Nombre:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ''}
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
              value={formData.lastName || ''}
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
              value={formData.email || ''}
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
              value={formData.password || ''}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="roleId" className="block text-sm font-medium mb-1">Rol:</label>
            {rolesLoading ? (
              <p>Cargando roles...</p>
            ) : rolesError ? (
              <p className="text-red-500">Error al cargar roles: {rolesError}</p>
            ) : (
              <select
                id="roleId"
                name="roleId"
                value={formData.roleId ?? ''} // Usar ?? para manejar undefined
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
            )}
          </div>
          {success && <p className="text-green-500 mb-4">{success}</p>}
          {error && <p className="text-red-500 mb-4">{error}</p>}
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
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserForm;
