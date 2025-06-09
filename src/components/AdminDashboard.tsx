import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Footer from './Footer';
import UserTable from './UserTable';
import ServiceTable from './ServiceTable';

interface AdminDashboardProps {
  theme: string;
  toggleTheme: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ theme, toggleTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'overview' | 'users' | 'appointments' | 'services' | 'settings'>('overview'); // Estado para controlar la vista
  const currentYear = new Date().getFullYear(); // Obtener el año actual

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 dark:bg-gray-950 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h2 className="text-2xl font-bold">Panel de Administración</h2>
          {/* Botón de tema */}
          <button
            onClick={toggleTheme}
            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800"
            style={{ backgroundColor: theme === 'dark' ? '#000000' : '#d1d5db' }}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              style={{ transform: theme === 'dark' ? 'translateX(20px)' : 'translateX(2px)' }}
            />
          </button>
          {/* Botón de hamburguesa para móviles */}
          <button
            className="md:hidden text-white focus:outline-none ml-4" // Añadir margen para separar del botón de tema
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          {/* Navegación de escritorio */}
          <nav className="hidden md:block">
            <ul className="flex space-x-4">
              <li><button type="button" onClick={() => setCurrentView('users')} className="hover:underline px-3 py-1 rounded hover:bg-gray-700">Usuarios</button></li>
              <li><button type="button" onClick={() => setCurrentView('appointments')} className="hover:underline px-3 py-1 rounded hover:bg-gray-700">Citas</button></li>
              <li><button type="button" onClick={() => setCurrentView('services')} className="hover:underline px-3 py-1 rounded hover:bg-gray-700">Servicios</button></li>
              <li><button type="button" onClick={() => setCurrentView('settings')} className="hover:underline px-3 py-1 rounded hover:bg-gray-700">Configuración</button></li>
              <li><button onClick={() => {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userRolId');
                window.location.href = '/'; // Redirigir a la página principal
              }} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded">Cerrar Sesión</button></li>
            </ul>
          </nav>
        </div>
        {/* Menú móvil (aparece cuando isMobileMenuOpen es true) */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4">
            <ul className="flex flex-col space-y-2">
              <li><button type="button" onClick={() => { setCurrentView('users'); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Usuarios</button></li>
              <li><button type="button" onClick={() => { setCurrentView('appointments'); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Citas</button></li>
              <li><button type="button" onClick={() => { setCurrentView('services'); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Servicios</button></li>
              <li><button type="button" onClick={() => { setCurrentView('settings'); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">Configuración</button></li>
              <li><button onClick={() => {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userRolId');
                window.location.href = '/'; // Redirigir a la página principal
              }} className="w-full text-left px-3 py-2 rounded-md text-base font-medium bg-gray-700 hover:bg-gray-600 text-white">Cerrar Sesión</button></li>
            </ul>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {currentView === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Estadísticas Rápidas</h2>
              <p>Total de usuarios: 150</p>
              <p>Citas pendientes: 25</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Actividad Reciente</h2>
              <ul>
                <li>Nueva cita de Juan Pérez</li>
                <li>Usuario María García registrado</li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Alertas</h2>
              <p className="text-red-400 dark:text-red-300">¡Hay 3 citas urgentes!</p>
            </div>
          </div>
        )}
        {currentView === 'users' && <UserTable theme={theme} />}
        {currentView === 'appointments' && <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}><h2 className="text-2xl font-bold">Gestión de Citas</h2><p>Contenido de citas aquí...</p></div>}
        {currentView === 'services' && <ServiceTable theme={theme} />}
        {currentView === 'settings' && <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}><h2 className="text-2xl font-bold">Configuración del Sistema</h2><p>Contenido de configuración aquí...</p></div>}
      </main>

      {/* Footer */}
      <Footer currentYear={currentYear} />
    </div>
  );
};

export default AdminDashboard;
