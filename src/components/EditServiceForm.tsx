import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/env';

interface ServiceData {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
}

interface EditServiceFormProps {
  serviceId: number;
  onClose: () => void;
  onServiceUpdated: () => void; // Para notificar a la tabla que se actualizó un servicio
  theme: string;
}

const EditServiceForm: React.FC<EditServiceFormProps> = ({ serviceId, onClose, onServiceUpdated, theme }) => {
  const [formData, setFormData] = useState<Partial<ServiceData>>({
    name: '',
    description: '',
    price: 0,
    duration: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No autorizado: No se encontró el token de autenticación.');
        }

        const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message ?? 'Error al cargar los datos del servicio.');
        }

        const data: ServiceData = await response.json();
        setFormData({
          name: data.name,
          description: data.description,
          price: data.price,
          duration: data.duration,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchServiceData();
    }
  }, [serviceId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value,
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

      const payload: Partial<ServiceData> = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        duration: formData.duration,
      };

      const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message ?? 'Error al actualizar el servicio.');
      }

      setSuccess('Servicio actualizado exitosamente.');
      onServiceUpdated(); // Notificar a la tabla para que recargue los datos
      onClose(); // Cerrar el formulario después de la actualización exitosa
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && serviceId) {
    return <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>Cargando datos del servicio...</div>;
  }

  if (error && serviceId) {
    return <div className={`p-4 text-red-500 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>Error: {error}</div>;
  }

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
      <div className={`p-6 rounded-lg shadow-lg w-full max-w-md ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <h2 className="text-2xl font-bold mb-4">Editar Servicio</h2>
        <form onSubmit={handleSubmit}>
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
            <label htmlFor="description" className="block text-sm font-medium mb-1">Descripción:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description ?? ''}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
              rows={3}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium mb-1">Precio:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price ?? 0}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="duration" className="block text-sm font-medium mb-1">Duración:</label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formData.duration ?? ''}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
              placeholder="Ej: 30 minutos"
              required
            />
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
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditServiceForm;
