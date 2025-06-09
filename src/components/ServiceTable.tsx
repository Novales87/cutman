import React, { useState, useEffect } from 'react';
import CreateServiceForm from './CreateServiceForm'; // Importar el componente CreateServiceForm
import EditServiceForm from './EditServiceForm'; // Importar el componente EditServiceForm

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
  const [perPage, setPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [isCreatingService, setIsCreatingService] = useState(false); // Estado para controlar la creación de servicio
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null); // Estado para el ID del servicio a editar
  const [refetchTrigger, setRefetchTrigger] = useState(0); // Nuevo estado para forzar la recarga

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No autorizado: No se encontró el token de autenticación.');
        }

        let url = `${import.meta.env.VITE_API_BASE_URL}/services?page=${currentPage}&perPage=${perPage}`;
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
          throw new Error(errorData.message || 'Error al cargar servicios');
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
  }, [currentPage, perPage, searchQuery, refetchTrigger]); // Añadir refetchTrigger a las dependencias

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
          <p className="text-sm text-gray-400">Una lista de todos los servicios disponibles.</p>
        </div>
        <button
          onClick={() => setIsCreatingService(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Agregar servicio
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

      {loading && <p>Cargando servicios...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Duración</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingServiceId(service.id)}
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

export default ServiceTable;
