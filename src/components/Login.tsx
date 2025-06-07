import React, { useState } from 'react';
import portada from '../pictures/portada.jpg';
import { Sun, Moon } from 'lucide-react'; // Importar iconos de tema

interface LoginProps {
  onBackToHome: () => void;
  theme: string; // Añadir prop de tema
  toggleTheme: () => void; // Añadir prop para cambiar tema
}

const Login: React.FC<LoginProps> = ({ onBackToHome, theme, toggleTheme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [currentView, setCurrentView] = useState<'login' | 'forgotPassword' | 'register'>('login');

  const handleSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login - Email:', email);
    console.log('Login - Password:', password);
    console.log('Login - Remember Me:', rememberMe);
    alert('Simulando login...');
  };

  const handleSubmitForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Forgot Password - Email:', email);
    alert('Simulando recuperación de contraseña...');
  };

  const [registerName, setRegisterName] = useState('');
  const [registerLastName, setRegisterLastName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const handleSubmitRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register - Name:', registerName);
    console.log('Register - Last Name:', registerLastName);
    console.log('Register - Email:', registerEmail);
    console.log('Register - Password:', registerPassword);
    alert('Simulando registro...');
  };

  const renderForm = () => {
    switch (currentView) {
      case 'login':
        return (
          <form onSubmit={handleSubmitLogin}>
            <div className="mb-4">
              <label htmlFor="email" className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'text-gray-700'}`}
                placeholder="your@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                Password
              </label>
              <input
                type="password"
                id="password"
                className={`shadow appearance-none border rounded w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'text-gray-700'}`}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between mb-6">
              <label className={`flex items-center text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-green-600"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="ml-2">Remember me</span>
              </label>
            </div>
            <div className="mb-6">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                Sign in now
              </button>
            </div>
            <div className="text-center mb-6">
              <a href="#" onClick={() => setCurrentView('forgotPassword')} className={`inline-block align-baseline font-bold text-sm ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-800'}`}>
                Password Reset
              </a>
            </div>
            <div className="text-center text-xs">
              By click on "Sign in now" you agree to{' '}
              <a href="#" className={`inline-block align-baseline ${theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'}`}>
                Terms of Service
              </a>{' '}
              |{' '}
              <a href="#" className={`inline-block align-baseline ${theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'}`}>
                Privacy Policy
              </a>
            </div>
            <div className="text-center mt-4">
              <a href="#" onClick={() => setCurrentView('register')} className={`inline-block align-baseline font-bold text-sm ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-800'}`}>
                Registrarme
              </a>
            </div>
          </form>
        );
      case 'forgotPassword':
        return (
          <form onSubmit={handleSubmitForgotPassword}>
            <h2 className="text-2xl font-bold mb-6 text-center">Recuperar Contraseña</h2>
            <div className="mb-4">
              <label htmlFor="email" className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'text-gray-700'}`}
                placeholder="your@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                Enviar Solicitud
              </button>
            </div>
            <div className="text-center mt-4">
              <a href="#" onClick={() => setCurrentView('login')} className={`inline-block align-baseline font-bold text-sm ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-800'}`}>
                Volver al Login
              </a>
            </div>
          </form>
        );
      case 'register':
        return (
          <form onSubmit={handleSubmitRegister}>
            <h2 className="text-2xl font-bold mb-6 text-center">Registrarme</h2>
            <div className="mb-4">
              <label htmlFor="registerName" className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                Nombre
              </label>
              <input
                type="text"
                id="registerName"
                className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'text-gray-700'}`}
                placeholder="Tu nombre"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="registerLastName" className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                Apellido (Opcional)
              </label>
              <input
                type="text"
                id="registerLastName"
                className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'text-gray-700'}`}
                placeholder="Tu apellido"
                value={registerLastName}
                onChange={(e) => setRegisterLastName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="registerEmail" className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                Email
              </label>
              <input
                type="email"
                id="registerEmail"
                className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'text-gray-700'}`}
                placeholder="your@example.com"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="registerPassword" className={`block text-sm font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                Password
              </label>
              <input
                type="password"
                id="registerPassword"
                className={`shadow appearance-none border rounded w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'text-gray-700'}`}
                placeholder="********"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                Registrarme
              </button>
            </div>
            <div className="text-center mt-4">
              <a href="#" onClick={() => setCurrentView('login')} className={`inline-block align-baseline font-bold text-sm ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-800'}`}>
                Volver al Login
              </a>
            </div>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Sección de la imagen (oculta en móviles) */}
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: `url(${portada})` }}
        >
          {/* Contenido opcional para la imagen si es necesario */}
        </div>

        {/* Sección del formulario */}
        <div className={`w-full md:w-1/2 p-8 relative ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}> {/* Cambiar a bg-gray-900 para el formulario en modo oscuro */}
          <button
            type="button"
            onClick={onBackToHome}
            className={`absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-semibold ${theme === 'dark' ? 'bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400'}`}
            aria-label="Volver"
          >
            Volver
          </button>
          {/* Botón de tema para pantallas pequeñas */}
          <button onClick={toggleTheme} className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
            {theme === 'light' ? <Moon className="w-6 h-6 text-white" /> : <Sun className="w-6 h-6 text-white" />}
          </button>
          <h2 className="text-3xl font-bold mb-6 text-center mt-4">Sign in</h2> {/* Ajustar margen superior */}
          {renderForm()}
        </div>
      </div>
    </div>
  );
};

export default Login;
