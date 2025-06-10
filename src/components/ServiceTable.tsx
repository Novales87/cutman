import React, { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react'; // Importar iconos
import { API_BASE_URL } from '../utils/env';
import CreateServiceForm from './CreateServiceForm'; // Importar el componente CreateServiceForm
import EditServiceForm from './EditServiceForm'; // Importar el componente EditServiceForm
import DeleteConfirmationModal from './DeleteConfirmationModal'; // Importar el modal de confirmaciรณn

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
}

interface ApiResponse {
  page: number;
  perPage: number;
  totalPages: number;
  totalResults: number;
  data: Service[];
}

interface ServiceTableProps {
  theme: string;
}

const ServiceTable: React.FC<ServiceTableProps> = ({ theme }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [isCreatingService, setIsCreatingService] = useState(false); // Estado para controlar la creaciรณn de servicio
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null); // Estado para el ID del servicio a editar
  const [refetchTrigger, setRefetchTrigger] = useState(0); // Nuevo estado para forzar la recarga
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Estado para controlar el modal de eliminaciรณn
  const [serviceToDeleteId, setServiceToDeleteId] = useState<number | null>(null); // ID del servicio a eliminar

  const handleDeleteClick = (serviceId: number) => {
    setServiceToDeleteId(serviceId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (serviceToDeleteId === null) return;

    setIsDeleteModalOpen(false); // Cerrar el modal
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No autorizado: No se encontrรณ el token de autenticaciรณn.');
      }

      const response = await fetch(`${API_BASE_URL}/services/${serviceToDeleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message ?? 'Error al eliminar el servicio.');
      }

      setServices(services.filter(service => service.id !== serviceToDeleteId));
      setRefetchTrigger(prev => prev + 1); // Forzar recarga de la tabla
      setServiceToDeleteId(null); // Limpiar el ID
    } catch (err: any) {
      console.error('Error al eliminar servicio:', err.message);
      alert(`Error al eliminar servicio: ${err.message}`); // Mantener un alert simple para errores de eliminaciรณn
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setServiceToDeleteId(null);
  };

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No autorizado: No se encontrรณ el token de autenticaciรณn.');
        }

        let url = `${API_BASE_URL}/services?page=${currentPage}&perPage=${perPage}`;
        if (searchQuery) {
          url += `&search=${searchQuery}`;
        }

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message ?? 'Error al cargar servicios');
        }

        const data: ApiResponse = await response.json();

        setServices(data.data);
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

    fetchServices();
  }, [currentPage, perPage, searchQuery, refetchTrigger]); // Aรฑadir refetchTrigger a las dependencias

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
          <h2 className="text-2xl font-bold">Servicios</h2>
          <p className="text-sm text-gray-400">Servicios disponibles.</p>
        </div>
        <button
          onClick={() => setIsCreatingService(true)}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          Agregar
        </button>
      </div>

      <div className="mb-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="text"
          placeholder="Buscar servicios..."
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

      {loading && <p>Cargando servicios...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Descripciรณn</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Duraciรณn</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className={`${theme === 'dark' ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'} divide-y`}>
              {services.map((service) => (
                <tr key={service.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{service.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{service.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">${service.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{service.duration}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <div className="flex justify-end">
                      <button
                        onClick={() => setEditingServiceId(service.id)}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mr-4"
                        title="Editar"
                      >
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(service.id)}
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
        itemName="servicio"
        theme={theme}
      />

      {editingServiceId && (
        <EditServiceForm
          serviceId={editingServiceId}
          onClose={() => setEditingServiceId(null)}
          onServiceUpdated={() => {
            setEditingServiceId(null); // Cerrar el formulario
            setRefetchTrigger(prev => prev + 1); // Forzar recarga
          }}
          theme={theme}
        />
      )}

      {isCreatingService && (
        <CreateServiceForm
          onClose={() => setIsCreatingService(false)}
          onServiceCreated={() => {
            setIsCreatingService(false); // Cerrar el formulario
            setRefetchTrigger(prev => prev + 1); // Forzar recarga
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

export default ServiceTable;
