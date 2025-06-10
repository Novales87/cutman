import React, { useState, useEffect } from 'react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string; // Nombre del elemento a eliminar (ej: "servicio", "usuario")
  theme: string;
  isWarning?: boolean; // Nuevo prop para indicar si debe titilar
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  theme,
  isWarning = false,
}) => {
  const [borderColor, setBorderColor] = useState('transparent');

  useEffect(() => {
    let interval: number; // Cambiado de NodeJS.Timeout a number
    if (isOpen && isWarning) {
      let colorIndex = 0;
      const colors = ['#FF0000', '#FFA500', '#FFFF00', '#008000', '#0000FF', '#4B0082', '#EE82EE']; // Colores del arcoíris
      interval = setInterval(() => {
        setBorderColor(colors[colorIndex]);
        colorIndex = (colorIndex + 1) % colors.length;
      }, 200); // Cambia cada 200ms
    } else {
      setBorderColor('transparent');
    }

    return () => clearInterval(interval);
  }, [isOpen, isWarning]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
      <div
        className={`p-6 rounded-lg shadow-lg w-full max-w-sm ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
        style={{ border: isWarning ? `3px solid ${borderColor}` : 'none', transition: 'border-color 0.2s ease-in-out' }}
      >
        <h2 className="text-xl font-bold mb-4">Confirmar Eliminación</h2>
        <p className="mb-6">¿Estás seguro de que quieres eliminar este {itemName}?</p>
        {isWarning && <p className="text-red-500 font-bold mb-4">¡ADVERTENCIA: Este es un usuario administrador!</p>}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
