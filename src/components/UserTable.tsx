import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2 } from 'lucide-react'; // Importar iconos
import { API_BASE_URL } from '../utils/env';
import EditUserForm from './EditUserForm';
import CreateUserForm from './CreateUserForm';
import DeleteConfirmationModal from './DeleteConfirmationModal'; // Importar el modal de confirmaciรณn

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
  const [perPage, setPerPage] = useState(5);
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Estado para controlar el modal de eliminaciรณn
  const [userToDeleteId, setUserToDeleteId] = useState<number | null>(null); // ID del usuario a eliminar

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
          throw new Error('No autorizado: No se encontrรณ el token de autenticaciรณn para roles.');
        }
        const response = await fetch(`${API_BASE_URL}/roles`, {
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
          setError('No autorizado: No se encontrรณ el token de autenticaciรณn.');
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/users/paginated?page=${currentPage}&perPage=${perPage}&search=${searchQuery}`,
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

  const handleDeleteClick = (user: User) => {
    setUserToDeleteId(user.id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDeleteId === null) return;

    setIsDeleteModalOpen(false); // Cerrar el modal
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No autorizado: No se encontrรณ el token de autenticaciรณn.');
      }

      const response = await fetch(`${API_BASE_URL}/users/${userToDeleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message ?? 'Error al eliminar el usuario.');
      }

      setUsers(users.filter(user => user.id !== userToDeleteId));
      setRefetchTrigger(prev => prev + 1); // Forzar recarga de la tabla
      setUserToDeleteId(null); // Limpiar el ID
    } catch (err: any) {
      console.error('Error al eliminar usuario:', err.message);
      alert(`Error al eliminar usuario: ${err.message}`); // Mantener un alert simple para errores de eliminaciรณn
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setUserToDeleteId(null);
  };

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
          <p className="text-sm text-gray-400">Lista de Usuarios</p>
        </div>
        <button
          onClick={() => setIsCreatingUser(true)}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          Agregar
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
          <label htmlFor="perPageSelect" className="text-sm">Elementos por pรกgina:</label>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className={`${theme === 'dark' ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'} divide-y`}>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{user.name} {user.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {rolesLoading ? 'Cargando...' : getRoleName(user.roleId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <div className="flex justify-end">
                      <button
                        onClick={() => setEditingUserId(user.id)}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mr-4"
                        title="Editar"
                      >
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="text-red-600 hover:text-red-800"
                        title="Eliminar"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemName="usuario"
        theme={theme}
        isWarning={userToDeleteId !== null && users.find(u => u.id === userToDeleteId)?.roleId === 1}
      />

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
          className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
        >
          Anterior
        </button>
        <span className="text-sm">
          Pรกgina {currentPage} de {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={!hasMore}
          className={`px-4 py-2 rounded ${!hasMore ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default UserTable;
