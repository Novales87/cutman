import React, { useState, useEffect, useCallback } from 'react';
import EditUserForm from './EditUserForm';
import CreateUserForm from './CreateUserForm';

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string;
  sucursalId: number;
}

interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  password?: string;
  roleId: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  page: number;
  perPage: number;
  totalPages: number;
  totalResults: number;
  data: User[];
}

interface UserTableProps {
  theme: string;
}

const UserTable: React.FC<UserTableProps> = ({ theme }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  const getRoleName = useCallback((roleId: number) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : 'Desconocido';
  }, [roles]);

  useEffect(() => {
    const fetchRoles = async () => {
      setRolesLoading(true);
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
          throw new Error(errorData.message ?? 'Error al cargar los roles.');
        }
        const data: Role[] = await response.json();
        setRoles(data);
      } catch (err: any) {
        console.error('Error al cargar roles:', err.message);
      } finally {
        setRolesLoading(false);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('No autorizado: No se encontró el token de autenticación.');
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/users/paginated?page=${currentPage}&perPage=${perPage}&search=${searchQuery}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message ?? 'Error al cargar usuarios');
        }

        const data: ApiResponse = await response.json();

        setUsers(data.data);
        setCurrentPage(data.page);
        setPerPage(data.perPage);
        setTotalPages(data.totalPages);
        setHasMore(data.page < data.totalPages);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, perPage, searchQuery, refetchTrigger]);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Usuarios</h2>
          <p className="text-sm text-gray-400">Una lista de todos los usuarios en tu cuenta, incluyendo su nombre, título, email y rol.</p>
        </div>
        <button
          onClick={() => setIsCreatingUser(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Agregar usuario
        </button>
      </div>

      <div className="mb-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="text"
          placeholder="Buscar usuarios..."
          value={searchQuery}
          onChange={handleSearchChange}
          className={`flex-1 p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
        />
        <div className="flex items-center space-x-2">
          <label htmlFor="perPageSelect" className="text-sm">Elementos por página:</label>
          <select
            id="perPageSelect"
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className={`p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      {loading && <p>Cargando usuarios...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className={`${theme === 'dark' ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'} divide-y`}>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{user.name} {user.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm"></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {rolesLoading ? 'Cargando...' : getRoleName(user.roleId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingUserId(user.id)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingUserId && (
        <EditUserForm
          userId={editingUserId}
          onClose={() => setEditingUserId(null)}
          onUserUpdated={() => {
            setEditingUserId(null);
            setRefetchTrigger(prev => prev + 1);
          }}
          theme={theme}
        />
      )}

      {isCreatingUser && (
        <CreateUserForm
          onClose={() => setIsCreatingUser(false)}
          onUserCreated={() => {
            setIsCreatingUser(false);
            setRefetchTrigger(prev => prev + 1);
          }}
          theme={theme}
        />
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          Anterior
        </button>
        <span className="text-sm">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={!hasMore}
          className={`px-4 py-2 rounded ${!hasMore ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default UserTable;
